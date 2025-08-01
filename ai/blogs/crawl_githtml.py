import sys
import os
import time
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utils.cleaner import clean_text
from utils.writer import save_json

# 템플릿에서 output 파일명 추출
def get_output_name(url_template):
    parsed = urlparse(url_template)
    domain = parsed.netloc.replace('.', '_')
    path = parsed.path.strip('/').split('/')
    if '{}' in path[-1]:
        slug = path[-2] if len(path) >= 2 else "content"
    else:
        slug = path[-1].split('{')[0]
    return f"{domain}__{slug}.json"

# 템플릿 파일 읽기 + URL 확장
def parse_url_templates(file_path):
    template_map = {}
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip() or '{}' not in line:
                continue
            template, rng = line.strip().split()
            start, end = map(int, rng.split('-'))
            urls = [template.format(i) for i in range(start, end + 1)]
            template_map[template] = urls
    return template_map

# GitHub Pages / GitBook용 선택자만 사용
SELECTORS = [
    ".book-body .page-wrapper",
    ".markdown-body",
    "article"
]

TEMPLATE_FILE = "url_templates/githtml_urls.txt"
OUTPUT_DIR = "data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

template_map = parse_url_templates(TEMPLATE_FILE)

for template, urls in template_map.items():
    results = []
    failed = []
    output_file = os.path.join(OUTPUT_DIR, get_output_name(template))

    print(f"\n📦 {template} → 총 {len(urls)}개 URL 처리 중...")

    for i, url in enumerate(tqdm(urls, desc="크롤링 중")):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
        except Exception as e:
            print(f"[ERROR] {url} 요청 실패: {e}")
            failed.append(url)
            continue

        soup = BeautifulSoup(response.text, "html.parser")
        content_div = None
        for sel in SELECTORS:
            content_div = soup.select_one(sel)
            if content_div:
                break

        if not content_div:
            print(f"[WARN] 본문을 찾을 수 없음: {url}")
            failed.append(url)
            continue

        title_tag = content_div.find("h1")
        title = title_tag.get_text(strip=True) if title_tag else f"Chapter {i + 1}"

        raw_text = content_div.get_text(separator="\n")
        cleaned_text = clean_text(raw_text)

        results.append({
            "chapter": i + 1,
            "title": title,
            "url": url,
            "content": cleaned_text
        })

        time.sleep(0.3)

    save_json(results, output_file)
    print(f"✅ 저장 완료: {output_file} ({len(results)}개)")

    if failed:
        failed_file = os.path.join(OUTPUT_DIR, "failed_urls.txt")
        with open(failed_file, "a", encoding="utf-8") as f:
            for u in failed:
                f.write(u + "\n")
        print(f"⚠️ 실패한 URL {len(failed)}개 → {failed_file}")
