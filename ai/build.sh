set -e  # 하나라도 실패하면 중단

echo "📦 Installing dependencies..."
pip install -r requirements.txt
python -m nltk.downloader punkt

echo "🌐 Crawling..."
python data/crawling.py

echo "✂️  Chunking..."
python data/chunk.py

echo "🧮 Embedding..."
python data/embedding.py

echo "🗄️  Ingesting into Chroma..."
python app/ingest.py

echo "✅ Build finished successfully!"