from huggingface_hub import HfApi, login
import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(env_path)

token = os.getenv("HF_TOKEN")
print(f"Token: {token[:4]}...")

api = HfApi()

REPO_ID = "liquidai/lfm-2.5-audio-1.5b"
REPO_ID_ALT = "LiquidAI/LFM2.5-Audio-1.5B"

def check(repo):
    with open("access_result.txt", "a") as f:
        f.write(f"Checking {repo}...\n")
        try:
            info = api.model_info(repo, token=token)
            f.write(f"SUCCESS! Found model: {info.id}\n")
            f.write(f"Private: {info.private}\n")
            f.write(f"Gated: {info.gated}\n")
        except Exception as e:
            f.write(f"FAILED: {e}\n")

if os.path.exists("access_result.txt"):
    os.remove("access_result.txt")

check(REPO_ID)
check(REPO_ID_ALT)
