# chunking.py
import jsonlines
import re
from bs4 import BeautifulSoup
import nltk
from nltk.tokenize import sent_tokenize
from langchain_text_splitters import RecursiveCharacterTextSplitter

# NLTK 리소스 다운로드 (최초 1회만 실행)
try:
    nltk.data.find('tokenizers/punkt')
except nltk.downloader.DownloadError:
    nltk.download('punkt')


def clean_and_preserve_code(raw_html: str) -> str:
    """
    HTML 원문에서 코드 블록은 보존하고, 일반 텍스트는 정제하여 반환합니다.
    """
    soup = BeautifulSoup(raw_html, 'html.parser')
    
    code_blocks = []
    placeholders = []
    
    # 코드 블록을 플레이스홀더로 교체
    for i, code in enumerate(soup.find_all('code')):
        placeholder = f"@@CODE_BLOCK_{i}@@"
        code_blocks.append(code.get_text(separator='\n', strip=True))
        code.replace_with(placeholder)
        placeholders.append(placeholder)
    
    # 텍스트 추출
    text = soup.get_text(separator='\n')
    
    # 불필요한 태그/특수문자 제거 (한글 포함)
    text = re.sub(r'[@#][\w\d_-]+', '', text)  # @, #로 시작하는 토큰 제거
    text = re.sub(r'[^\w\sㄱ-힣.,!?()\[\]{}:;<>+=*/\"\'-@]', '', text)

    # 문장 단위 분리
    sentences = []
    for para in text.split('\n'):
        para = para.strip()
        if para:
            sentences.extend(sent_tokenize(para))
    
    # 완전 중복만 제거
    seen = set()
    unique_sentences = []
    for s in sentences:
        normalized = s.strip().lower()
        if normalized and normalized not in seen:
            seen.add(normalized)
            unique_sentences.append(s.strip())

    cleaned_text = ' '.join(unique_sentences)

    # 코드 블록 원래 위치에 복원
    for placeholder, code in zip(placeholders, code_blocks):
        cleaned_text = cleaned_text.replace(placeholder, f"\n{code}\n")
    
    cleaned_text = re.sub(r'\s*\n\s*', '\n', cleaned_text).strip()
    return cleaned_text


def process_chunks(input_file='crawled_data.jsonl', output_file='chunked_data.jsonl'):
    """
    크롤링된 데이터를 읽어와 청크로 분리하고 새로운 JSONL 파일에 저장합니다.
    """
    all_chunks = []
    try:
        with jsonlines.open(input_file, 'r') as reader:
            for obj in reader:
                url = obj['source']
                text = obj['text']
                
                cleaned_text = clean_and_preserve_code(text)
                
                # --- 청크 분할 파라미터 ---
                text_splitter = RecursiveCharacterTextSplitter(
                    chunk_size=800,     # 문맥 보존 강화
                    chunk_overlap=200,  # 중복 최소화
                    length_function=len,
                )
                chunks = text_splitter.split_text(cleaned_text)
                
                for i, chunk in enumerate(chunks):
                    all_chunks.append({
                        'source': url,
                        'chunk_id': f"{url.replace('/', '_').replace('.', '_')}_{i}",
                        'text': chunk
                    })
    except FileNotFoundError:
        print(f"Error: {input_file} not found. Please make sure you have crawled the data first.")
        return

    with jsonlines.open(output_file, 'w') as writer:
        for chunk_data in all_chunks:
            writer.write(chunk_data)
            
    print(f"Chunking complete. {len(all_chunks)} chunks saved to {output_file}")


if __name__ == "__main__":
    process_chunks()
