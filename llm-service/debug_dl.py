from huggingface_hub import snapshot_download
import sys

MODEL_REPO = "liquidai/lfm-2.5-audio-1.5b"
DESTHAL = "models"

try:
    print(f"Attempting valid download of {MODEL_REPO}...")
    snapshot_download(repo_id=MODEL_REPO, local_dir=DESTHAL, local_dir_use_symlinks=False)
    print("Download success")
except Exception as e:
    print(f"Download FAILED: {e}")
