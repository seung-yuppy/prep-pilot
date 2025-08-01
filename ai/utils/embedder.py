import os
import json
from transformers import AutoTokenizer, AutoModel
import torch
from tqdm import tqdm

from dotenv import load_dotenv

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN") 

MODEL_NAME = "BM-K/KoSimCSE-roberta"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# 1. 모델 불러오기
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)
model.to(DEVICE)
model.eval()

# 2. 임베딩 함수
def get_embedding(text: str):
    # Ko-BGE 스타일: 문장: prefix 필요
    input_text = "문장: " + text
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        last_hidden = outputs.last_hidden_state  # (1, seq_len, hidden_size)
        attention_mask = inputs["attention_mask"].unsqueeze(-1)
        masked_output = last_hidden * attention_mask  # 마스킹
        embedding = masked_output.sum(dim=1) / attention_mask.sum(dim=1)
        return embedding.squeeze().cpu().tolist()

# 3. 메인 처리 함수
def embed_chunks(input_path: str, output_path: str):
    with open(input_path, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    embedded = []
    for chunk in tqdm(chunks, desc="Embedding chunks"):
        text = chunk.get("text", "")
        vector = get_embedding(text)
        chunk["embedding"] = vector
        embedded.append(chunk)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(embedded, f, ensure_ascii=False, indent=2)

    print(f"✅ Embedded {len(embedded)} chunks → {output_path}")

# 4. 실행 예시
if __name__ == "__main__":
    input_file = "data/chunks/chunk_rebeccacho_gitbook.json"
    output_file = "data/embeddings/embedding_rebeccacho_gitbook.json"
    embed_chunks(input_file, output_file)
