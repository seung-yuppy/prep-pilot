import os
from blogs import mkyong, javable, tistory_pjh, tistory_juntcom, velopert, outsider
from utils.writer import save_json
from tqdm import tqdm

# 크롤링 대상 블로그 리스트 
BLOG_MODULES = [
    ("mkyong", mkyong.get_articles),
    ("javable", javable.get_articles),
    ("tistory_pjh", tistory_pjh.get_articles),
    ("tistory_juntcom", tistory_juntcom.get_articles),
    ("velopert", velopert.get_articles),
    ("outsider", outsider.get_articles),
]

DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

def main():
    for blog_name, fetch_func in BLOG_MODULES:
        print(f"\n\u2728 {blog_name} 크롤링 중...")
        articles = fetch_func()
        filtered = [a for a in articles if len(a['body']) >= 500]
        print(f"\u2705 수집: {len(articles)}개, 필터링 후: {len(filtered)}개")
        save_json(filtered, os.path.join(DATA_DIR, f"{blog_name}.json"))

if __name__ == "__main__":
    main()
