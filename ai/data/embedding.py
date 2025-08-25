import os
import json
from pymilvus.model.dense import VoyageEmbeddingFunction

# Voyage 초기화
voyage_ef = VoyageEmbeddingFunction(
    model_name="voyage-3",
    api_key=os.getenv("VOYAGE_API_KEY")
)

# chunked_data.jsonl 읽기
chunks = []
with open("chunked_data.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        chunks.append(json.loads(line))

# 배치 사이즈
BATCH_SIZE = 500  

with open("data.jsonl", "w", encoding="utf-8") as f_out:
    for i in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[i:i + BATCH_SIZE]
        texts = [c["text"] for c in batch]

        # Voyage API 호출
        embeddings = voyage_ef.encode_documents(texts)

        # 저장
        for chunk, emb in zip(batch, embeddings):
            record = {
                "source": chunk["source"],
                "chunk_id": chunk["chunk_id"],
                "text": chunk["text"],
                "embedding": emb.tolist()
            }
            f_out.write(json.dumps(record, ensure_ascii=False) + "\n")

        print(f"✅ {i + len(batch)} / {len(chunks)} 완료")
