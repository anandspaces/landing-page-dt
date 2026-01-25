import edge_tts
import io
import asyncio

class EdgeTTSEngine:
    def __init__(self):
        print("Initializing EdgeTTS Engine...")
        # British Male: en-GB-RyanNeural or en-GB-ThomasNeural
        # US Male: en-US-ChristopherNeural or en-US-GuyNeural
        self.voice = "en-GB-RyanNeural" 
        print(f"EdgeTTS using voice: {self.voice}")

    async def generate_async(self, text):
        try:
            communicate = edge_tts.Communicate(text, self.voice)
            audio_data = b""
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_data += chunk["data"]
            
            return io.BytesIO(audio_data)
        except Exception as e:
            print(f"EdgeTTS Error: {e}")
            return None

    def generate(self, text):
        # Helper for sync context if needed, but we will use async in main
        return asyncio.run(self.generate_async(text))

    async def warmup(self):
        print("Warming up TTS engine...")
        try:
            # Generate a very short silent-like text to initialize connection
            await self.generate_async("ok")
            print("TTS Engine execution wrapper warmed up.")
        except Exception as e:
            print(f"TTS Warmup failed: {e}")
