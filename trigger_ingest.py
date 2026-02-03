import requests
try:
    response = requests.post("http://localhost:8000/rag/ingest")
    print(response.json())
except Exception as e:
    print(f"Ingest failed: {e}")
