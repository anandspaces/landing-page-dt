import requests
import json

url = "http://localhost:8000/chat"
payload = {"message": "Hello"}
headers = {"Content-Type": "application/json"}

tests = [
    "Hello",
    "Who are you?",
    "What is Dextora?",
    "What is the capital of France?"
]

for query in tests:
    try:
        print(f"\n--- Testing: {query} ---")
        response = requests.post(url, json={"message": query}, headers=headers)
        print(f"Status: {response.status_code}")
        # Local LLM streams, so we might get a raw stream response. 
        # For this test, we just want to see if it works without erroring.
        # Since it streams, requests.post might return immediately or wait.
        # Let's just print the beginning of the text
        print(f"Response: {response.text[:200]}...") 
    except Exception as e:
        print(f"Request failed: {e}")
