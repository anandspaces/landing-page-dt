from huggingface_hub import HfApi
api = HfApi()
print("Searching for 'liquid' models...")
models = api.list_models(search="liquid")
count = 0
for model in models:
    if "liquid" in model.modelId.lower():
        print(f"{model.modelId} (Gated: {model.gated})")
        count += 1
if count == 0:
    print("No models found matching 'liquid'")
