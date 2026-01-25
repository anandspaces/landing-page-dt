import requests
import json

url = "http://localhost:8000/tts"
payload = {"message": "Hello, this is a test of the Dextora Voice System."}
headers = {'Content-Type': 'application/json'}

print(f"Testing TTS Endpoint: {url}")
try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Success! Audio data received.")
        print(f"Content Length: {len(response.content)} bytes")
        with open("test_output.mp3", "wb") as f:
            f.write(response.content)
        print("Saved to test_output.mp3")
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Connection Failed: {e}")
