import os
from pathlib import Path

def get_directory_size(directory):
    total_size = 0
    try:
        for dirpath, dirnames, filenames in os.walk(directory):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                # skip if it is symbolic link
                if not os.path.islink(fp):
                    total_size += os.path.getsize(fp)
    except Exception as e:
        print(f"Error: {e}")
    return total_size

home = Path.home()
cache_dir = home / ".cache" / "huggingface" / "hub"
print(f"Checking cache at: {cache_dir}")

if cache_dir.exists():
    for folder in cache_dir.iterdir():
        if "liquidai" in folder.name.lower():
            size = get_directory_size(folder)
            print(f"Folder: {folder.name}")
            print(f"Size: {size / (1024*1024*1024):.2f} GB")
else:
    print("Cache directory not found.")
