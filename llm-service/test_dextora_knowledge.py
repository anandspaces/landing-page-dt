import requests
import json

url = "http://localhost:8000/chat"
headers = {'Content-Type': 'application/json'}

def ask(question):
    print(f"\nAsking: {question}")
    payload = {"message": question}
    try:
        with requests.post(url, json=payload, headers=headers, stream=True) as response:
            if response.status_code == 200:
                full_response = ""
                for chunk in response.iter_content(chunk_size=None):
                    if chunk:
                        text = chunk.decode('utf-8')
                        print(text, end='', flush=True)
                        full_response += text
                print("\n--- End ---")
            else:
                print(f"Error: {response.text}")
    except Exception as e:
        print(f"Connection Failed: {e}")

ask("What is Dextora AI?")
ask("How does Dextora help teachers?")
