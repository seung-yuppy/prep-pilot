import os
import json
import numpy as np
from openai import OpenAI
from pymilvus.model.dense import VoyageEmbeddingFunction
from dotenv import load_dotenv
import nltk
nltk.download("punkt")  # 문장 분리를 위한 데이터 다운로드 (최초 1회만 실행)

from nltk.tokenize import sent_tokenize

# --- .env 로드 ---
load_dotenv()

# --- 1. OpenAI (LLM) ---
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --- 2. Voyage (임베딩) ---
voyage_ef = VoyageEmbeddingFunction(
    model_name="voyage-3",
    api_key=os.getenv("VOYAGE_API_KEY")
)

# --- Helper: 코사인 유사도 ---
def cosine_similarity(vec1, vec2):
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

# --- Helper: NLTK 기반 청크 분할 ---
def chunk_text_nltk(text, max_chars=500, overlap=1):
    """
    긴 텍스트를 문장 단위로 분리 후, max_chars 기준으로 묶어서 청크 생성
    - max_chars: 청크 최대 길이 (문자 단위)
    - overlap: 앞 청크에서 몇 개 문장을 겹칠지
    """
    sentences = sent_tokenize(text)
    chunks = []
    current_chunk = []
    current_len = 0

    for sent in sentences:
        if current_len + len(sent) > max_chars:
            chunks.append(" ".join(current_chunk))
            # overlap 처리
            if overlap > 0:
                current_chunk = current_chunk[-overlap:]
                current_len = sum(len(s) for s in current_chunk)
            else:
                current_chunk = []
                current_len = 0
        current_chunk.append(sent)
        current_len += len(sent)

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks

# --- Step 1. data.jsonl 불러오기 ---
embeddings_data = []
with open("../data/data.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        embeddings_data.append(json.loads(line))

print(f"✅ Loaded {len(embeddings_data)} chunks from data.jsonl")

# --- Step 2. 사용자 텍스트 읽기 ---
with open("text.txt", "r", encoding="utf-8") as f:
    user_text = f.read().strip()

print(f"✅ Loaded user text: {len(user_text)} chars")

# --- Step 3. 사용자 텍스트 청크 분할 (NLTK 이용) ---
user_chunks = chunk_text_nltk(user_text, max_chars=500, overlap=1)

# --- Step 4. 각 청크별로 RAG 수행 & 교정 ---
for idx, query in enumerate(user_chunks, start=1):
    # 4-1. 쿼리 임베딩 생성 (Voyage 사용)
    query_embedding = voyage_ef.encode_queries([query])[0]

    # 4-2. 모든 저장 청크와 유사도 계산
    results = []
    for item in embeddings_data:
        sim = cosine_similarity(query_embedding, item["embedding"])
        results.append((sim, item))

    results.sort(key=lambda x: x[0], reverse=True)
    top_k = 3
    top_chunks = [item for _, item in results[:top_k]]

    # 4-3. LLM에 교정 요청
    context = "\n".join([c["text"] for c in top_chunks])
    prompt = f"""
    다음 문장을 옳게 교정해줘.
    출력 형식은 반드시 아래처럼:
    잘못된 문장: ...
    추천 문장: ...

    문장:
    {query}

    참고 문맥:
    {context}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    print(f"\n=== 청크 {idx} 교정 결과 ===")
    print(response.choices[0].message.content)
