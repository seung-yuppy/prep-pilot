import os
import json
import nltk
nltk.download('punkt')
from nltk.tokenize import sent_tokenize

def split_into_chunks(text: str, max_len: int = 500):
    """
    문장을 max_len 기준으로 묶어서 chunk 리스트 반환 // 지금은 500자임
    """
    sentences = sent_tokenize(text)
    chunks = []
    current = ""

    for sent in sentences:
        if len(current) + len(sent) + 1 <= max_len:
            current += " " + sent
        else:
            if current.strip():
                chunks.append(current.strip())
            current = sent

    if current.strip():
        chunks.append(current.strip())

    return chunks


def chunk_json_file(input_path: str, output_path: str, max_len: int = 500):
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    all_chunks = []
    for item in data:
        content = item.get("content", "")
        chunks = split_into_chunks(content, max_len)
        for idx, chunk in enumerate(chunks):
            all_chunks.append({
                "chunk_id": f"{item.get('chapter', 'doc')}_{idx+1:02}",
                "title": item.get("title", ""),
                "source": item.get("url", ""),
                "text": chunk
            })

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, ensure_ascii=False, indent=2)

    print(f"✅ Chunked {len(all_chunks)} blocks → {output_path}")


if __name__ == "__main__":
    # 예시 실행 경로
    input_file = "data/rebeccacho_gitbook.json"
    output_file = "data/chunks/chunk_rebeccacho_gitbook.json"
    chunk_json_file(input_file, output_file, max_len=500)
