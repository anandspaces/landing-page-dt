import os
import torch
from dotenv import load_dotenv
from transformers import AutoModelForCausalLM, AutoTokenizer, TextIteratorStreamer
from threading import Thread

# Load env from parent dir if needed, or current
base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_path, ".env"))

class LLMEngine:
    def __init__(self):
        print("Initializing Qwen Engine...")
        
        self.model_id = "Qwen/Qwen2.5-0.5B-Instruct"
        print(f"Target Model: {self.model_id}")

        try:
            # Load Tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_id)
            
            # Load Model
            # device_map="auto" will use GPU if available
            # torch_dtype="auto" will use fp16 if available
            print("Loading model... (this might download on first run)")
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_id,
                torch_dtype="auto",
                device_map="auto"
            )
            print("Qwen model loaded successfully.")

        except Exception as e:
            print(f"Failed to load model: {e}")
            # Ensure we log this visibly
            with open("startup_error.log", "w") as f:
                f.write(f"Startup Error: {e}\n")
            raise e

    def stream_chat(self, messages, temperature=0.7):
        """
        Stream response using TextIteratorStreamer.
        """
        try:
            # Apply Chat Template
            # Qwen supports apply_chat_template
            text = self.tokenizer.apply_chat_template(
                messages,
                tokenize=False,
                add_generation_prompt=True
            )
            
            model_inputs = self.tokenizer([text], return_tensors="pt").to(self.model.device)

            # Streamer setup
            streamer = TextIteratorStreamer(self.tokenizer, skip_prompt=True, skip_special_tokens=True)
            
            # Generate kwargs
            generate_kwargs = dict(
                model_inputs,
                streamer=streamer,
                max_new_tokens=512,
                temperature=temperature,
                do_sample=True, # required for temperature
            )

            # Run generation in a separate thread so we can yield from streamer
            t = Thread(target=self.model.generate, kwargs=generate_kwargs)
            t.start()

            # Yield tokens as they appear
            for new_text in streamer:
                yield new_text

        except Exception as e:
            yield f"Error generating response: {e}"

    def chat(self, messages, temperature=0.7):
        # Non-streaming fallback
        full_response = ""
        for chunk in self.stream_chat(messages, temperature):
            full_response += chunk
        return full_response
