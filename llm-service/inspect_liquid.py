try:
    import liquid_audio
    print("--- BEGIN ATTRIBUTES ---")
    for x in dir(liquid_audio):
        if not x.startswith("__"):
            print(x)
    print("--- END ATTRIBUTES ---")

except ImportError:
    print("liquid_audio not installed")
except Exception as e:
    print(f"Error: {e}")
