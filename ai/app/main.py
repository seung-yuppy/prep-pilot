import os
import json
import traceback
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import nltk
from nltk.tokenize import sent_tokenize
import chromadb
from pymilvus.model.dense import VoyageEmbeddingFunction
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# --- NLTK 리소스 다운로드 ---
nltk.download("punkt")
try:
    nltk.download("punkt_tab")
except:
    pass

# --- .env 로드 ---
load_dotenv()

# --- OpenAI (LLM) ---
OPENAI_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_KEY) if OPENAI_KEY else None

# --- Voyage 임베딩 ---
voyage_api_key = os.getenv("VOYAGE_API_KEY")
embedding_model = VoyageEmbeddingFunction(
    model_name="voyage-3",
    api_key=voyage_api_key
)

# --- Chroma DB ---
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection("blogs")

# --- FastAPI 앱 ---
app = FastAPI(
    title="RAG Correction & Quiz API (Chroma + Voyage)",
    version="0.7"
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helper: 텍스트 청크 분리 ---
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

class CorrectionItem(BaseModel):
    wrong: str
    correct: str

class CorrectionResponse(BaseModel):
    input: str
    corrections: List[CorrectionItem]

class QuizItem(BaseModel):
    question: str
    answer: str

class QuizResponse(BaseModel):
    input: str
    quizzes: List[QuizItem]

# --- Normalize ---
def normalize_corrections(data) -> List[dict]:
    if isinstance(data, dict):
        data = [data]
    normalized = []
    for item in data:
        normalized.append({
            "wrong": str(item.get("wrong", "")).strip(),
            "correct": str(item.get("correct", "")).strip()
        })
    return normalized

def normalize_quizzes(data) -> List[dict]:
    if isinstance(data, dict):
        data = [data]
    normalized = []
    for item in data:
        normalized.append({
            "question": str(item.get("question", "")).strip(),
            "answer": str(item.get("answer", "")).strip()
        })
    return normalized

# --- 교정 API ---
@app.post("/correct", response_model=CorrectionResponse)
def correct_text(request: TextRequest):
    user_text = request.text.strip()
    user_chunks = chunk_text_nltk(user_text, max_chars=500, overlap=1)
    corrections_all = []

    for query in user_chunks:
        try:
            if not client:
                raise RuntimeError("❌ OPENAI_API_KEY가 설정되지 않았습니다.")

            query_vec = embedding_model.encode_queries([query])[0]
            docs = collection.query(query_embeddings=[query_vec], n_results=3)
            if not docs.get("documents") or not docs["documents"][0]:
                raise ValueError("⚠️ Chroma DB에서 검색 결과가 없습니다.")

            top_chunks = docs["documents"][0]
            context = "\n".join(top_chunks)

            prompt = f"""
            아래 문장에서 잘못된 부분을 찾아 교정해줘.

            ⚠️ 반드시 JSON 배열만 출력하세요.
            - 각 항목은 "wrong", "correct" 두 개의 key만 가져야 합니다.
            - JSON 배열 이외의 텍스트는 절대 포함하지 마세요.

            예시:
            [
              {{"wrong": "잘못된 문장 예시", "correct": "교정된 문장 예시"}}
            ]

            문장:
            {query}

            참고 문맥:
            {context}
            """

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )

            generated = json.loads(response.choices[0].message.content)
            corrections_all.extend(normalize_corrections(generated))

        except Exception as e:
            tb = traceback.format_exc()
            corrections_all.append({
                "wrong": "⚠️ 에러 발생",
                "correct": f"{str(e)}\n{tb}"
            })

    return CorrectionResponse(input=user_text, corrections=corrections_all)

# --- 퀴즈 API ---
@app.post("/generate-quiz", response_model=QuizResponse)
def generate_quiz(request: TextRequest):
    user_text = request.text.strip()
    user_chunks = chunk_text_nltk(user_text, max_chars=500, overlap=1)
    quizzes_all = []

    for chunk in user_chunks:
        try:
            if not client:
                raise RuntimeError("❌ OPENAI_API_KEY가 설정되지 않았습니다.")

            prompt = f"""
            아래 글을 기반으로 학습용 **주관식 문제**를 3개 만들어줘.

            ⚠️ 반드시 JSON 배열만 출력하세요.
            - 각 항목은 "question", "answer" 두 개의 key만 가져야 합니다.
            - 답변은 반드시 글 속에서 찾을 수 있어야 합니다.
            - JSON 배열 이외의 텍스트는 절대 포함하지 마세요.

            출력 예시:
            [
              {{"question": "Java는 어떤 언어인가?", "answer": "객체지향 언어"}},
              {{"question": "Java는 어디서 실행되는가?", "answer": "JVM"}},
              {{"question": "JVM의 약자는 무엇인가?", "answer": "Java Virtual Machine"}}
            ]

            글:
            {chunk}
            """

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )

            generated = json.loads(response.choices[0].message.content)
            quizzes_all.extend(normalize_quizzes(generated))

        except Exception as e:
            tb = traceback.format_exc()
            quizzes_all.append({
                "question": "⚠️ 에러 발생",
                "answer": f"{str(e)}\n{tb}"
            })

    return QuizResponse(input=user_text, quizzes=quizzes_all)
