import glob
import os

print(f"Current CWD: {os.getcwd()}")
print(f"Data Dir: data")
print(f"Abs Data Dir: {os.path.abspath('data')}")

files = glob.glob(os.path.join("data", "**", "*.csv"), recursive=True)
print(f"Glob found: {files}")

print("Listing directory 'llm-service/data':")
try:
    print(os.listdir("llm-service/data"))
except Exception as e:
    print(e)
