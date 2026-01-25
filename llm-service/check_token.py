import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")
load_dotenv(env_path)

token = os.getenv("HF_TOKEN")
if token:
    print(f"Token found: '{token[:3]}...{token[-3:]}' (Length: {len(token)})")
    if token.startswith("hf_"):
        print("Prefix valid.")
    else:
        print("WARNING: Token should start with 'hf_'")
else:
    print("Token NOT found.")
