import os
import time
from pathlib import Path

home = Path.home()
target_dir = home / ".cache" / "huggingface" / "hub" / "models--LiquidAI--LFM2.5-Audio-1.5B"

print(f"Checking {target_dir}")
if target_dir.exists():
    for root, dirs, files in os.walk(target_dir):
        for name in files:
            filepath = Path(root) / name
            mtime = filepath.stat().st_mtime
            age = time.time() - mtime
            print(f"File: {name} | Age: {age:.1f}s | Size: {filepath.stat().st_size} bytes")
else:
    print("Directory not found")
