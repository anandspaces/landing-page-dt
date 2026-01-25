import os
import torch
import torchaudio
import io
from zipvoice.luxvoice import LuxTTS

class LuxTTSEngine:
    def __init__(self):
        print("Initializing LuxTTS Engine...")
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {self.device}")
        
        try:
            self.model = LuxTTS('YatharthS/LuxTTS', device=self.device)
            print("LuxTTS Model Loaded.")
        except Exception as e:
            print(f"Error loading LuxTTS: {e}")
            raise e

        # Load Prompt
        self.prompt_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "male_voice.wav")
        self.encoded_prompt = None
        
        if not os.path.exists(self.prompt_path):
            print(f"Warning: Prompt file not found at {self.prompt_path}")
        else:
            print(f"Encoding prompt audio from {self.prompt_path}...")
            try:
                # encode_prompt might take time
                self.encoded_prompt = self.model.encode_prompt(self.prompt_path, rms=0.01)
                print("Prompt encoded successfully.")
            except Exception as e:
                print(f"Error encoding prompt: {e}")

    def generate(self, text):
        if self.encoded_prompt is None:
            print("Cannot generate: Encoded prompt is None")
            return None
        
        try:
            print(f"Generating TTS for: {text[:50]}...")
            # Generate speech (returns tensor)
            # Default sample rate for LuxTTS is 48000
            audio = self.model.generate_speech(text, self.encoded_prompt, num_steps=4)
            
            # Convert to Bytes
            buffer = io.BytesIO()
            # Audio is likely (1, T) or (T,). Torchaudio expects (C, T)
            if audio.dim() == 1:
                audio = audio.unsqueeze(0)
            
            # Ensure CPU for saving
            audio = audio.cpu()
            
            torchaudio.save(buffer, audio, 48000, format="wav")
            buffer.seek(0)
            return buffer
        except Exception as e:
            print(f"Generation error: {e}")
            import traceback
            traceback.print_exc()
            return None
