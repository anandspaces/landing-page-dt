import chromadb
from sentence_transformers import SentenceTransformer
import os
import glob
import csv
from uuid import uuid4

class RAGEngine:
    def __init__(self, persist_directory="chroma_db"):
        print("Initializing RAG Engine...")
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(name="knowledge_base")
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        print("RAG Engine ready.")

    def ingest_data(self, data_dir="data"):
        """
        Read .txt files from data/company and data/competitors and index them.
        """
        files = glob.glob(os.path.join(data_dir, "**", "*.txt"), recursive=True)
        print(f"Found {len(files)} files to ingest.")
        
        for file_path in files:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Simple chunking by paragraphs or fixed size
            chunks = self._chunk_text(content)
            
            if not chunks:
                continue
                
            ids = [str(uuid4()) for _ in chunks]
            embeddings = self.embedder.encode(chunks).tolist()
            metadatas = [{"source": file_path} for _ in chunks]
            
            self.collection.add(
                documents=chunks,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids
            )
            print(f"Ingested {len(chunks)} chunks from {file_path}")

        # Ingest CSVs
        csv_files = glob.glob(os.path.join(data_dir, "**", "*.csv"), recursive=True)
        print(f"Found {len(csv_files)} CSV files to ingest.")
        for csv_file in csv_files:
            self.ingest_csv(csv_file)

    def ingest_csv(self, file_path):
        """
        Ingest Q&A CSV. Format: Question, Answer
        """
        print(f"Ingesting CSV: {file_path}")
        ids = []
        documents = []
        metadatas = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    question = row.get('Question', '').strip()
                    answer = row.get('Answer', '').strip()
                    
                    if question and answer:
                        # Format: "Q: <Question>\nA: <Answer>"
                        full_text = f"Q: {question}\nA: {answer}"
                        
                        ids.append(str(uuid4()))
                        documents.append(full_text)
                        metadatas.append({"source": file_path, "type": "qa_pair"})
            
            if documents:
                embeddings = self.embedder.encode(documents).tolist()
                self.collection.add(
                    documents=documents,
                    embeddings=embeddings,
                    metadatas=metadatas,
                    ids=ids
                )
                print(f"Ingested {len(documents)} Q&A pairs from {file_path}")
                
        except Exception as e:
            print(f"Error ingesting CSV {file_path}: {e}")

    def _chunk_text(self, text, chunk_size=500):
        """
        Simple overlapping chunker.
        """
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - 50): # 50 word overlap
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)
        return chunks

    def retrieve(self, query, n_results=1):
        """
        Retrieve relevant context for a query.
        """
        query_embedding = self.embedder.encode([query]).tolist()
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=n_results
        )
        return results["documents"][0] if results["documents"] else []
