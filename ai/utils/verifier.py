import os
import json
from dotenv import load_dotenv
from transformers import AutoTokenizer, AutoModel, TextStreamer
import torch
from sklearn.metrics.pairwise import cosine_similarity
from tqdm import tqdm

# 환경변수 로드
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# 모델 설정
MODEL_NAME = "snunlp/KR-SBERT-V40K-klueNLI-augSTS"
LLM_NAME = "nlpai-lab/kullm3-7b-instruct"  # 모델명

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, token=HF_TOKEN)
model = AutoModel.from_pretrained(MODEL_NAME, token=HF_TOKEN).to(DEVICE)

# LLM용
llm_tokenizer = AutoTokenizer.from_pretrained(LLM_NAME, token=HF_TOKEN)
llm_model = AutoModel.from_pretrained(LLM_NAME, device_map="auto", torch_dtype=torch.float16, token=HF_TOKEN)
streamer = TextStreamer(llm_tokenizer)

# 유사도 검사
def get_top_similar_chunks(user_input, embedded_chunks, top_k=3):
    input_emb = model.encode(user_input, convert_to_tensor=True).cpu().detach().numpy().reshape(1, -1)
    chunk_vectors = [chunk['vector'] for chunk in embedded_chunks]
    similarities = cosine_similarity(input_emb, chunk_vectors)[0]
    top_indices = similarities.argsort()[-top_k:][::-1]
    return [(embedded_chunks[i], similarities[i]) for i in top_indices]

# LLM 평가 함수
def ask_llm(system_prompt, user_prompt):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]
    input_ids = llm_tokenizer.apply_chat_template(messages, return_tensors="pt").to(DEVICE)
    output = llm_model.generate(input_ids, max_new_tokens=512, streamer=streamer, do_sample=False)
    return llm_tokenizer.decode(output[0], skip_special_tokens=True)

#  메인
def main():
    user_input = input("✍️ 문장을 입력하세요: ")

    # 1. Load Embedding DB
    with open("data/embeddings/embedding_rebeccacho_gitbook.json", "r", encoding="utf-8") as f:
        embedded_chunks = json.load(f)

    # 2. 유사 chunk 뽑기
    top_chunks = get_top_similar_chunks(user_input, embedded_chunks, top_k=3)

    print("\n📊 유사한 문장:")
    for i, (chunk, sim) in enumerate(top_chunks):
        print(f"# {i+1} - 유사도: {round(sim, 3)}\n본문: {chunk['text']}\n")

    # 3. 신뢰도 판단 (LLM)
    context = "\n".join([f"{i+1}. {chunk['text']}" for i, (chunk, _) in enumerate(top_chunks)])
    system_prompt = "너는 자바를 공부하는 한국 블로그 글의 사실성 판단을 돕는 AI야."
    user_prompt = f"다음 문장은 신뢰할 수 있을까?\n\n문장: {user_input}\n\n비교 대상:\n{context}\n\n신뢰도 평가와 이유를 알려줘."

    print("\n🤖 신뢰도 판단:")
    result = ask_llm(system_prompt, user_prompt)
    print(result)

    # 4. 오타 및 문법 검사
    correction_prompt = f"다음 문장에서 문법적 오류나 오타가 있다면 수정하고, 없다면 '문제 없음'이라고 말해줘.\n\n문장: {user_input}"
    print("\n✏️ 오타 검사 및 수정:")
    correction = ask_llm(system_prompt, correction_prompt)
    print(correction)

if __name__ == "__main__":
    main()
