import requests
import time

url = "http://localhost:8000/rag/ingest"
print(f"Triggering ingestion via {url}...")
try:
    response = requests.post(url)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
