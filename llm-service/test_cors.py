import requests

url = "http://localhost:8000/chat"
try:
    print(f"Testing OPTIONS {url} with Origin header...")
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST"
    }
    response = requests.options(url, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {response.headers}")
    if response.status_code == 200:
        print("CORS Preflight OK.")
    elif response.status_code == 405:
        print("CORS FAILED (405 Method Not Allowed).")
    else:
        print(f"Unexpected status: {response.status_code}")
except Exception as e:
    print(f"Request failed: {e}")
