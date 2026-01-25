import sys
import os

# Add current dir to path
sys.path.append(os.getcwd())

print("Importing core.zipvoice_service...")
try:
    from core.zipvoice_service import LuxTTSEngine
    print("Import successful class.")
    engine = LuxTTSEngine()
    print("Init successful.")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
