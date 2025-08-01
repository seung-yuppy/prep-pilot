import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TextStreamer
from dotenv import load_dotenv
import os

# 🔐 환경 변수에서 HuggingFace 토큰 로딩
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

# 📌 모델 정보
MODEL_DIR = "nlpai-lab/KULLM3"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# LLM 저장 위치
model = AutoModelForCausalLM.from_pretrained(
    MODEL_DIR,
    torch_dtype=torch.float16,
    device_map="auto",  # 자동 디바이스 분배
    offload_folder="offload"  # offload 시 사용할 폴더 지정
)

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)

# ✅ 모델 & 토크나이저 로드 (Private 모델일 경우 token 꼭 포함)
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR, token=HF_TOKEN)
model = AutoModelForCausalLM.from_pretrained(
    MODEL_DIR,
    torch_dtype=torch.float16 if DEVICE == "cuda" else torch.float32,
    device_map="auto",
    token=HF_TOKEN
)

# 💬 실시간 응답 출력용 스트리머
streamer = TextStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)

# 🧠 LLM 실행 함수
def run_llm_review(user_input: str):
    system_prompt = "당신은 한국어 교육용 AI입니다. 사용자가 입력한 문장에서 문법 오류, 오타, 개념 오류 등을 찾아 설명해주세요. 가능하면 신뢰도도 판단해주세요."
    
    # 🗣️ Chat template 구성
    conversation = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]

    # 🧾 템플릿 적용 및 토큰화
    inputs = tokenizer.apply_chat_template(
        conversation,
        tokenize=True,
        add_generation_prompt=True,
        return_tensors="pt"
    ).to(DEVICE)

    # 🚀 응답 생성
    _ = model.generate(
        inputs,
        streamer=streamer,
        max_new_tokens=1024,
        temperature=0.7,
        do_sample=True,
        top_p=0.95,
    )

# 🖥️ 진입점
if __name__ == "__main__":
    user_input = input("검사할 문장을 입력하세요: ")
    run_llm_review(user_input)
