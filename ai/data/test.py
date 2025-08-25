import os
import json
import numpy as np
from pymilvus.model.dense import VoyageEmbeddingFunction

# Voyage Embedding 함수 초기화
voyage_ef = VoyageEmbeddingFunction(
    model_name="voyage-3",
    api_key=os.getenv("VOYAGE_API_KEY")
)

# 코사인 유사도 함수
def cosine_similarity(vec1, vec2):
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

# 1. data.jsonl 불러오기
embeddings_data = []
with open("data.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        embeddings_data.append(json.loads(line))

print(f"✅ 로드 완료: {len(embeddings_data)} 개 청크")

# 2. 사용자 질의 (Java 관련 문장 예시)
query = "Java에서 Garbage Collection은 메모리 관리의 핵심 기능이다."

# 3. 쿼리 임베딩 생성
query_embedding = voyage_ef.encode_queries([query])[0]

# 4. 모든 청크와 유사도 계산
results = []
for item in embeddings_data:
    sim = cosine_similarity(query_embedding, item["embedding"])
    results.append((sim, item))

# 5. 상위 3개 결과 정렬 후 출력
results.sort(key=lambda x: x[0], reverse=True)
top_k = 3

print("\n🔎 유사도 검색 결과:")
for rank, (sim, item) in enumerate(results[:top_k], start=1):
    print(f"[{rank}] 유사도: {sim:.4f}")
    print(f"    Source: {item['source']} (chunk_id={item['chunk_id']})")
    print(f"    Text: {item['text']}\n")
