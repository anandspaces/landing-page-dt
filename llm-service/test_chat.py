import requests
import json

url = "http://localhost:8000/chat"
payload = {"message": "Hello, are you working?"}
headers = {"Content-Type": "application/json"}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload, headers=headers, stream=True)
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Response Stream:")
        for chunk in response.iter_content(chunk_size=None):
            if chunk:
                try:
                    print(chunk.decode('utf-8'), end='', flush=True)
                except:
                    print(chunk)
        print("\n[End of Stream]")
    else:
        print(f"Error: {response.text}")

except Exception as e:
    print(f"Request failed: {e}")
