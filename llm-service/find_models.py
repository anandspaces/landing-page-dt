from huggingface_hub import HfApi
api = HfApi()
models = api.list_models(author="liquidai")
for model in models:
    print(model.modelId)
    print(f"  Private: {model.private}")
    print(f"  Gated: {model.gated}")
