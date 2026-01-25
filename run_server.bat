@echo off
echo Starting Local LLM Service...
cd %~dp0
call conda run -n dextora-llm python llm-service/main.py
pause
