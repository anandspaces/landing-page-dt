from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from core.llm import LLMEngine
from core.rag import RAGEngine
from core.edge_service import EdgeTTSEngine

import uvicorn
import threading
import asyncio

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
llm_engine = None
rag_engine = None
tts_engine = None

class ChatRequest(BaseModel):
    message: str

@app.on_event("startup")
async def startup_event():
    print("--- STARTING UP: CORS SHOULD BE ACTIVE ---")
    global llm_engine, rag_engine, tts_engine
    # Initialize engines
    try:
        llm_engine = LLMEngine()
        rag_engine = RAGEngine()
        tts_engine = EdgeTTSEngine()
        print(f"Engines initialized successfully. llm={llm_engine}, rag={rag_engine}")
        
        # Pre-warm TTS to avoid first-request latency
        asyncio.create_task(tts_engine.warmup())
        
    except Exception as e:
        print(f"Error initializing engines: {e}")
        with open("startup_failure.txt", "w") as f:
            f.write(str(e))

@app.post("/rag/ingest")
async def ingest_data():
    if not rag_engine:
        raise HTTPException(status_code=503, detail="RAG Engine not initialized")
    
    # Run in background thread to not block
    thread = threading.Thread(target=rag_engine.ingest_data)
    thread.start()
    return {"status": "Ingestion started in background"}

@app.post("/tts")
async def tts_endpoint(request: ChatRequest):
    if not tts_engine:
         raise HTTPException(status_code=503, detail="TTS Engine not initialized")
    
    # await the async generator
    audio_buffer = await tts_engine.generate_async(request.message)
    if not audio_buffer:
        raise HTTPException(status_code=500, detail="Generation failed")
        
    return StreamingResponse(audio_buffer, media_type="audio/mp3")

@app.post("/chat")
async def chat(request: ChatRequest):
    print(f"Chat Endpoint: llm_engine={llm_engine}, rag_engine={rag_engine}")
    if not llm_engine or not rag_engine:
        print("Chat Endpoint: Services are NONE.")
        raise HTTPException(status_code=503, detail="Services not initialized")
    
    import time
    start_time = time.time()
    user_query = request.message
    print(f"Received query: {user_query}")
    
    # 1. Retrieve Context
    t0 = time.time()
    context_chunks = rag_engine.retrieve(user_query)
    t1 = time.time()
    print(f"RAG Retrieval took: {t1 - t0:.2f}s")
    
    context_text = "\n\n".join(context_chunks)
    
    # 2. Construct Prompt
    system_prompt = (
        "You are Dextora, an advanced AI mentorship platform designed for students, teachers, and schools. "
        "Your goal is to provide personalized guidance, smart study strategies, and 24/7 support. "
        "Adhere to the following rules strictly:\n"
        "1. Answer ONLY using the provided Context. Do NOT use outside knowledge.\n"
        "2. If the user asks 'Who are you?' or 'What is your name?', reply exactly: "
        "'My name is Dextora.' followed by a brief 1-sentence summary of what Dextora is (from the context).\n"
        "If someone asks 'What is Dextora AI', clarify that you are simply 'Dextora' now, but answer the question about your capabilities.\n"
        "3. If the user greets you (Bi, Hi, Hello, Good Morning, etc.), respond politely and professionally as Dextora, then ask how you can help.\n"
        "4. If the answer is not in the Context, politely say: 'I can only provide information about Dextora and its dataset. I do not have information on that topic.'\n"
        "5. Keep responses concise, smart, and professional.\n"
        "\n\nContext:\n" + context_text
    )
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_query}
    ]

    print(f"Prompt constructed. Starting LLM stream...")
    
    # 3. Stream Response
    # measure time to first byte inside the generator or just log start here
    t2 = time.time()
    print(f"Pre-stream setup took: {t2 - start_time:.2f}s")
    
    return StreamingResponse(llm_engine.stream_chat(messages), media_type="text/event-stream")

if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    load_dotenv()
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    
    uvicorn.run(app, host=host, port=port)
