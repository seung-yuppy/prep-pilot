import re
from bs4 import BeautifulSoup
import nltk
nltk.download('punkt')
from nltk.tokenize import sent_tokenize

def clean_text(raw_html: str) -> str:
    """
    HTML 원문을 정제하여 문장 단위로 정리된 텍스트 반환.
    코드 감지 없음. 문단/문장 단위 구분만 유지.
    """
    # 1. HTML 태그 제거 (개행 기준으로 분리)
    soup = BeautifulSoup(raw_html, 'html.parser')
    text = soup.get_text(separator='\n')

    # 2. 해시태그, 멘션 제거
    text = re.sub(r'[@#][\w\d_-]+', '', text)

    # 3. 특수기호/이모지 제거 (기본 기호 제외)
    text = re.sub(r'[^\w\s.,!?()\[\]{}:;<>+=*/\"\'-]', '', text)

    # 4. 줄 단위 → 문장 단위로 분리
    sentences = []
    for para in text.split('\n'):
        para = para.strip()
        if para:
            sentences.extend(sent_tokenize(para))

    # 5. 중복 문장 제거 + 너무 짧은 문장 제거
    seen = set()
    unique_sentences = []
    for s in sentences:
        normalized = s.strip().lower()
        if normalized and normalized not in seen and len(s.split()) >= 4:
            seen.add(normalized)
            unique_sentences.append(s.strip())

    # 6. 문장들을 다시 문단 형태로 복원 (줄바꿈 기반)
    cleaned = '\n'.join(unique_sentences)
    return cleaned
