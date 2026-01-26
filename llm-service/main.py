from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from core.llm import LLMEngine
from core.rag import RAGEngine
from core.edge_service import EdgeTTSEngine

import uvicorn
import threading
import asyncio
from contextlib import asynccontextmanager

from fastapi.middleware.cors import CORSMiddleware

# Global instances
llm_engine = None
rag_engine = None
tts_engine = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("--- STARTING UP: CORS SHOULD BE ACTIVE ---")
    global llm_engine, rag_engine, tts_engine
    
    try:
        llm_engine = LLMEngine()
        rag_engine = RAGEngine()
        tts_engine = EdgeTTSEngine()
        print("Engines initialized successfully.")
        
        # Pre-warm TTS to avoid first-request latency
        asyncio.create_task(tts_engine.warmup())
        
    except Exception as e:
        print(f"Error initializing engines: {e}")
        raise
    
    yield
    
    # Shutdown (cleanup if needed)
    print("--- SHUTTING DOWN ---")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

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
    if not llm_engine or not rag_engine:
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
        "You are the Official AI Support Assistant for Dextora AI. "
        "Use the following Context to answer the user's question. "
        "Be helpful, friendly, and professional. "
        "If the answer is not in the Context, say you do not know."
        "\n\nContext:\n" + context_text
    )
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_query}
    ]

    print(f"Prompt constructed. Starting LLM stream...")
    
    # 3. Stream Response
    t2 = time.time()
    print(f"Pre-stream setup took: {t2 - start_time:.2f}s")
    
    return StreamingResponse(llm_engine.stream_chat(messages), media_type="text/event-stream")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "engines": {
            "llm": llm_engine is not None,
            "rag": rag_engine is not None,
            "tts": tts_engine is not None
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)