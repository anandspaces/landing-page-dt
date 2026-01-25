import sys
import os

print("--- DIAGNOSTIC START ---")
print(f"Python: {sys.version}")
print(f"CWD: {os.getcwd()}")

try:
    print("1. Importing fastapi...")
    import fastapi
    print("   OK")
except Exception as e:
    print(f"   FAIL: {e}")

try:
    print("2. Importing llama_cpp...")
    import llama_cpp
    print("   OK")
except Exception as e:
    print(f"   FAIL: {e}")

try:
    print("3. Importing chromadb...")
    import chromadb
    print("   OK")
except Exception as e:
    print(f"   FAIL: {e}")

try:
    print("4. Importing sentence_transformers...")
    from sentence_transformers import SentenceTransformer
    print("   OK")
except Exception as e:
    print(f"   FAIL: {e}")

print("5. Checking core modules...")
try:
    from core.llm import LLMEngine
    print("   Import core.llm OK")
except Exception as e:
    print(f"   FAIL import core.llm: {e}")

try:
    from core.rag import RAGEngine
    print("   Import core.rag OK")
except Exception as e:
    print(f"   FAIL import core.rag: {e}")

print("--- DIAGNOSTIC END ---")
