from huggingface_hub import snapshot_download, login
import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(env_path)

token = os.getenv("HF_TOKEN")
if token:
    print("Logging in...")
    login(token=token)

print("Starting snapshot_download check...")
try:
    path = snapshot_download(
        repo_id="LiquidAI/LFM2.5-Audio-1.5B",
        token=token
    )
    print(f"SUCCESS! Model path: {path}")
except Exception as e:
    print(f"FAILED: {e}")
