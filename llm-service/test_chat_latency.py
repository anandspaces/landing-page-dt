import requests
import json
import time

url = "http://localhost:8000/chat"
payload = {"message": "Hello, what is Dextora AI?"}
headers = {'Content-Type': 'application/json'}

print(f"Testing Chat Endpoint: {url}")
start_time = time.time()
try:
    with requests.post(url, json=payload, headers=headers, stream=True) as response:
        print(f"Response Status: {response.status_code}")
        if response.status_code == 200:
            print("Stream started...")
            first_byte = True
            for chunk in response.iter_content(chunk_size=None):
                if first_byte:
                    t_first = time.time()
                    print(f"Time to first chunk: {t_first - start_time:.2f}s")
                    first_byte = False
                if chunk:
                    print(chunk.decode('utf-8'), end='', flush=True)
            t_end = time.time()
            print(f"\nTotal time: {t_end - start_time:.2f}s")
        else:
            print(f"Error: {response.text}")
except Exception as e:
    print(f"Connection Failed: {e}")
