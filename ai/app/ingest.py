import os
import json
import chromadb
from dotenv import load_dotenv

# --- .env 로드 ---
load_dotenv()

# --- Chroma DB 초기화 ---
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection("blogs")

# --- JSONL 로드 ---
file_path = "data/data.jsonl"
with open(file_path, "r", encoding="utf-8") as f:
    lines = [json.loads(line) for line in f]

print(f"✅ Loaded {len(lines)} chunks from {file_path}")

# --- 데이터 삽입 (embedding 필드 직접 사용) ---
ids = [f"{item['source']}_{item['chunk_id']}_{i}" for i, item in enumerate(lines)]
docs = [item["text"] for item in lines]
metas = [{"source": item["source"], "chunk_id": item["chunk_id"]} for item in lines]
embeds = [item["embedding"] for item in lines]

collection.add(ids=ids, documents=docs, embeddings=embeds, metadatas=metas)

print(f"✅ Inserted {len(ids)} chunks into Chroma DB (using pre-computed embeddings)")
