import sys
try:
    print("Importing torch...")
    import torch
    print(f"Torch imported: {torch.__version__}")
    
    print("Importing transformers...")
    from transformers import AutoModelForCausalLM
    print("Transformers imported")
    
    print("Importing liquid_audio...")
    import liquid_audio
    print("Liquid Audio imported")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
