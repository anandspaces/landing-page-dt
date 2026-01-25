@echo off
echo Triggering RAG Ingestion...
curl -X POST http://localhost:8000/rag/ingest
echo.
pause
