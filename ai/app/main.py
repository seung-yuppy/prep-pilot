import os
import json
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import nltk
nltk.download("punkt")

from nltk.tokenize import sent_tokenize
import chromadb
from langchain_openai import OpenAIEmbeddings

# --- .env 로드 ---
load_dotenv()

# --- OpenAI (LLM) ---
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --- Chroma DB ---
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection("blogs")

# --- Embedding 모델 (사용자 쿼리 임베딩용) ---
embedding_model = OpenAIEmbeddings(model="text-embedding-3-large")

# --- FastAPI ---
app = FastAPI(title="RAG Correction & Quiz API (Chroma, pre-embedded)", version="0.4")

# --- Helper: 청크 분리 ---
def chunk_text_nltk(text, max_chars=500, overlap=1):
    sentences = sent_tokenize(text)
    chunks, current_chunk, current_len = [], [], 0
    for sent in sentences:
        if current_len + len(sent) > max_chars:
            chunks.append(" ".join(current_chunk))
            if overlap > 0:
                current_chunk = current_chunk[-overlap:]
                current_len = sum(len(s) for s in current_chunk)
            else:
                current_chunk, current_len = [], 0
        current_chunk.append(sent)
        current_len += len(sent)
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks

# --- Request/Response 모델 ---
class TextRequest(BaseModel):
    text: str

class CorrectionResponse(BaseModel):
    input: str
    corrections: list

class QuizResponse(BaseModel):
    input: str
    quizzes: list

# --- 교정 API ---
@app.post("/correct", response_model=CorrectionResponse)
def correct_text(request: TextRequest):
    user_text = request.text.strip()
    user_chunks = chunk_text_nltk(user_text, max_chars=500, overlap=1)

    results_all = []
    for query in user_chunks:
        # 사용자 입력 임베딩
        query_vec = embedding_model.embed_query(query)

        # Chroma에서 검색
        docs = collection.query(query_embeddings=[query_vec], n_results=3)
        top_chunks = docs["documents"][0]

        context = "\n".join(top_chunks)
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
        results_all.append(response.choices[0].message.content.strip())

    return CorrectionResponse(input=user_text, corrections=results_all)

# --- 문제 생성 API ---
@app.post("/generate-quiz", response_model=QuizResponse)
def generate_quiz(request: TextRequest):
    user_text = request.text.strip()
    user_chunks = chunk_text_nltk(user_text, max_chars=500, overlap=1)

    quizzes_all = []
    for chunk in user_chunks:
        prompt = f"""
        아래 글을 기반으로 학습용 **주관식 문제**를 3개 만들어줘.
        - 반드시 글 속에서 답을 찾을 수 있어야 한다.
        - 각 문제와 정답을 JSON 배열 형식으로 출력: 
          [{{"question": "...", "answer": "..."}}]

        글:
        {chunk}
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json"}  # JSON 강제
        )

        try:
            generated = json.loads(response.choices[0].message.content)
            quizzes_all.extend(generated)
        except Exception:
            quizzes_all.append({
                "question": "파싱 실패",
                "answer": response.choices[0].message.content.strip()
            })

    return QuizResponse(input=user_text, quizzes=quizzes_all)
