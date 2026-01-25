from huggingface_hub import hf_hub_download
import os
from dotenv import load_dotenv

# Resolve absolute path to .env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Check for .env in current dir
env_path = os.path.join(BASE_DIR, ".env")
if os.path.exists(env_path):
    load_dotenv(env_path)
    print(f"Loaded .env from {env_path}")

DESTINATION_FOLDER = os.path.join(BASE_DIR, "models")

# Llama 3.2 3B Instruct GGUF
REPO_ID = "hugging-quants/Llama-3.2-3B-Instruct-Q4_K_M-GGUF"
FILENAME = "llama-3.2-3b-instruct-q4_k_m.gguf"

def download_model():
    print(f"Starting download script...")
    print(f"Target directory: {DESTINATION_FOLDER}")
    
    if not os.path.exists(DESTINATION_FOLDER):
        os.makedirs(DESTINATION_FOLDER)
        print("Created target directory.")
    
    print(f"Downloading {FILENAME} from {REPO_ID}...")
    
    try:
        model_path = hf_hub_download(
            repo_id=REPO_ID,
            filename=FILENAME,
            local_dir=DESTINATION_FOLDER,
            local_dir_use_symlinks=False
        )
        print(f"SUCCESS: Model downloaded to: {model_path}")
        return
    except Exception as e:
        print(f"ERROR during download: {e}")
        print("Please ensure you have internet access.")

if __name__ == "__main__":
    download_model()
