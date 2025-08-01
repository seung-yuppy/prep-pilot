import requests
import os
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from urllib.parse import urlparse

# GitBook 목차 URL → 글 URL 추출
def extract_from_gitbook(base_url):
    try:
        res = requests.get(base_url, timeout=10)
        res.raise_for_status()
    except Exception as e:
        print(f"[ERROR] GitBook 요청 실패: {base_url} → {e}")
        return []

    soup = BeautifulSoup(res.text, "html.parser")
    base = "https://" + urlparse(base_url).netloc

    return [
        base + a['href']
        for a in soup.find_all("a", href=True)
        if a['href'].startswith("/java-handbook/")
    ]

# Tistory sitemap.xml → 글 URL 추출
def extract_from_sitemap(sitemap_url):
    urls = []
    try:
        res = requests.get(sitemap_url)
        res.raise_for_status()
        root = ET.fromstring(res.content)
        for loc in root.findall(".//{*}loc"):
            url = loc.text
            if url.startswith("http"):
                urls.append(url)
    except Exception as e:
        print(f"[ERROR] sitemap 요청 실패: {sitemap_url} → {e}")
    return urls

# 파일에서 줄 단위로 사이트 URL 읽고 추출 방식에 따라 처리
def process_sources(source_txt, output_txt, mode):
    with open(source_txt, "r", encoding="utf-8") as f:
        sources = [line.strip() for line in f if line.strip()]

    all_urls = []
    for src in sources:
        if mode == "githtml" and "gitbook.io" in src:
            urls = extract_from_gitbook(src)
        elif mode == "tistory" and "tistory.com" in src:
            urls = extract_from_sitemap(src)
        else:
            print(f"[WARN] 처리 불가능한 URL: {src}")
            urls = []

        all_urls.extend(urls)

    if not all_urls:
        print("⚠️ 저장할 URL 없음")
        return

    # 기존 URL과 중복 제거
    existing_urls = set()
    if os.path.exists(output_txt):
        with open(output_txt, "r", encoding="utf-8") as f:
            existing_urls = set(line.strip() for line in f if line.strip())

    new_urls = [url for url in all_urls if url not in existing_urls]
    if not new_urls:
        print("✅ 새로운 URL 없음 (모두 이미 존재)")
        return

    with open(output_txt, "a", encoding="utf-8") as f:
        for url in new_urls:
            f.write(url + "\n")

    print(f"✅ 총 {len(new_urls)}개 새로운 URL 저장됨 → {output_txt}")

# 예시 실행
if __name__ == "__main__":
    os.makedirs("url_templates", exist_ok=True)

    process_sources(
        source_txt="url_sources/githtml_sources.txt",
        output_txt="url_templates/githtml_urls.txt",
        mode="githtml"
    )

    process_sources(
        source_txt="url_sources/tistory_sources.txt",
        output_txt="url_templates/tistory_urls.txt",
        mode="tistory"
    )
