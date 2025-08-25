import requests
from bs4 import BeautifulSoup
import re
import jsonlines

def get_page_content(url):
    """
    URL에 따라 적절한 CSS 선택자를 사용하여 본문 내용을 추출합니다.
    """
    try:
        response = requests.get(url)
        response.raise_for_status() # HTTP 오류가 발생하면 예외를 발생시킵니다.
        soup = BeautifulSoup(response.text, 'html.parser')

        # 최신 GitBook 사이트의 main 태그를 먼저 찾습니다.
        main_content = soup.find('main')

        if not main_content:
            # URL 도메인에 따라 다른 CSS 선택자 사용 (대체 방안)
            if 'nbcamp.gitbook.io' in url:
                main_content = soup.find('div', class_='grid [&amp;>*+*]:mt-5 whitespace-pre-wrap')
            elif 'gitbooks.io' in url:
                # 구버전 GitBook (rebeccacho.gitbooks.io)
                main_content = soup.find('div', class_='book-body') or soup.find('section', class_='markdown-section')
            elif 'gitbook.io' in url:
                # 다른 gitbook.io 사이트
                main_content = soup.find('main', class_='css-v1b106') or soup.find('main', class_='css-1d22qpl')
            elif 'github.io' in url:
                # GitHub Pages
                main_content = soup.find('article', class_='post-content') or soup.find('div', class_='post-content')
        
        if main_content:
            for unwanted_tag in main_content(['script', 'style', 'nav', 'aside', 'footer', '.group/codeblock']):
                unwanted_tag.decompose()
            
            text = main_content.get_text(separator=' ', strip=True)
            text = re.sub(r'\s+', ' ', text).strip()
            return text
        else:
            print(f"Warning: Could not find main content div for {url}. Please check the URL and HTML structure.")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Error crawling {url}: {e}")
        return None

def crawl_urls_to_jsonl(url_file_path='data/url.txt', output_file_path='data/crawled_data.jsonl'):
    """
    url.txt에서 URL을 읽어와 크롤링하고 결과를 JSONL 파일로 저장합니다.
    """
    urls = []
    try:
        with open(url_file_path, 'r', encoding='utf-8') as f:
            urls = [line.strip() for line in f if line.strip()]
    except FileNotFoundError:
        print(f"Error: {url_file_path} not found.")
        return

    with jsonlines.open(output_file_path, 'w') as writer:
        for url in urls:
            print(f"Crawling {url}...")
            content = get_page_content(url)
            
            if content and content.strip():
                data = {
                    'source': url,
                    'text': content
                }
                writer.write(data)
    print(f"Crawling complete. Data saved to {output_file_path}")

if __name__ == "__main__":
    crawl_urls_to_jsonl()