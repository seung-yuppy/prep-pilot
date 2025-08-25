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

# --- NLTK 리소스 다운로드 ---
nltk.download("punkt")
try:
    nltk.download("punkt_tab")  # 일부 버전에서 필요
except:
    pass

# --- .env 로드 ---
load_dotenv()

# --- OpenAI (LLM) ---
OPENAI_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_KEY) if OPENAI_KEY else None

# --- Voyage 임베딩 (DB와 통일) ---
voyage_api_key = os.getenv("VOYAGE_API_KEY")
embedding_model = VoyageEmbeddingFunction(
    model_name="voyage-3",
    api_key=voyage_api_key
)

# --- Chroma DB ---
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection("blogs")

# --- FastAPI ---
app = FastAPI(
    title="RAG Correction & Quiz API (Chroma + Voyage)",
    version="0.6"
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
        try:
            if not client:
                raise RuntimeError("❌ OPENAI_API_KEY가 설정되지 않았습니다.")

            # 사용자 입력 임베딩 (Voyage)
            query_vec = embedding_model.encode_queries([query])[0]

            # Chroma 검색
            docs = collection.query(query_embeddings=[query_vec], n_results=3)
            if not docs.get("documents") or not docs["documents"][0]:
                raise ValueError("⚠️ Chroma DB에서 검색 결과가 없습니다.")

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

        except Exception as e:
            tb = traceback.format_exc()
            results_all.append(f"⚠️ 에러 발생: {str(e)}\n{tb}")

    return CorrectionResponse(input=user_text, corrections=results_all)

# --- 문제 생성 API ---
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
            - 반드시 글 속에서 답을 찾을 수 있어야 한다.
            - 각 문제와 정답을 JSON 배열 형식으로 출력: 
              [{{"question": "...", "answer": "..."}}]

            글:
            {chunk}
            """

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}  # ✅ 수정됨
            )

            generated = json.loads(response.choices[0].message.content)
            quizzes_all.extend(generated)

        except Exception as e:
            tb = traceback.format_exc()
            quizzes_all.append({
                "question": "⚠️ 에러 발생",
                "answer": f"{str(e)}\n{tb}"
            })

    return QuizResponse(input=user_text, quizzes=quizzes_all)
