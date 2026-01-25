import os
import sys
from dotenv import load_dotenv

load_dotenv()

try:
    from liquid_audio import LFM2AudioModel, LFM2AudioProcessor
    print("Imports successful.")
except ImportError as e:
    print(f"Import Error: {e}")
    sys.exit(1)

token = os.getenv("HF_TOKEN")
print(f"Token present: {bool(token)}")

# Calculate path manually to match core/llm.py logic
base_dir = os.path.dirname(os.path.abspath(__file__))
# Note: debug_load.py is in llm-service/, so base_dir IS llm-service/
# core/llm.py base_dir was one level up from core/ -> llm-service/
# So logic:
# In core/llm.py: os.path.dirname(os.path.dirname(...core/llm.py)) -> llm-service/
# So model path = llm-service/models

model_path = os.path.join(base_dir, "models")
print(f"Model Path: {model_path}")
print(f"Directory Contents: {os.listdir(model_path) if os.path.exists(model_path) else 'Missing'}")

repo_id = "LiquidAI/LFM2.5-Audio-1.5B"

from huggingface_hub import snapshot_download

print("Attempting to load model (Offline Mode)...")
try:
    # Try to resolve path from cache without hitting internet
    target_path = snapshot_download("LiquidAI/LFM2.5-Audio-1.5B", local_files_only=True)
    print(f"Found in cache at: {target_path}")

    model = LFM2AudioModel.from_pretrained(target_path)
    print("Model Loaded!")
    proc = LFM2AudioProcessor.from_pretrained(target_path)
    print("Processor Loaded!")
except Exception as e:
    with open("error.log", "w", encoding="utf-8") as f:
        f.write(f"FAILED TO LOAD: {e}\n")
        import traceback
        traceback.print_exc(file=f)
    print("Error written to error.log")

