set -e

echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo "🔤 Downloading NLTK resources..."
python -m nltk.downloader punkt
python -m nltk.downloader punkt_tab

echo "🌐 Crawling..."
python data/crawling.py

echo "✂️ Chunking..."
python data/chunk.py

echo "🧮 Embedding..."
python data/embedding.py

echo "🗄️ Ingesting into Chroma..."
python app/ingest.py

echo "✅ Build finished successfully!"
