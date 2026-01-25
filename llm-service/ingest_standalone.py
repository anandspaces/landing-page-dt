import os
import sys

# Add the current directory to sys.path to ensure we can import 'core'
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from core.rag import RAGEngine

def main():
    print("Starting Standalone Ingestion...")
    
    # Initialize RAG Engine (creates/loads chroma_db)
    rag = RAGEngine(persist_directory=os.path.join(current_dir, "chroma_db"))
    
    # Define data directory (assumes we want to ingest from specific locations)
    # The setup script moves the csv to 'data' or we can point to repo root if needed.
    # Based on checking, the default 'data' folder inside llm-service is the target.
    data_dir = os.path.join(current_dir, "data")
    
    # Verify data directory exists
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        print(f"Created data directory at {data_dir}. Please place your documents/CSVs here.")
    
    # Check for the CSV specifically in the repo root if not in data 
    # (Since I moved it to the root of the repo, I should check there too or copy it)
    repo_root = os.path.dirname(current_dir) # llm-service/.. -> dextora-website-main
    
    # Look for known CSVs in repo root and copy/ingest them
    extra_csvs = ["dextora_100_questions_clean.csv", "dextora_training.csv"]
    for csv_name in extra_csvs:
        csv_path = os.path.join(repo_root, csv_name)
        if os.path.exists(csv_path):
            print(f"Found {csv_name} in repo root. Ingesting directly...")
            rag.ingest_csv(csv_path)
    
    # Ingest from data folder
    print(f"Ingesting from {data_dir}...")
    rag.ingest_data(data_dir=data_dir)
    
    print("Ingestion Complete. Vector DB is ready.")

if __name__ == "__main__":
    main()
