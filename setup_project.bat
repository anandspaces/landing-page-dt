@echo off
echo ===========================================
echo Dextora AI - Microservices Setup
echo ===========================================

echo Installing Frontend Dependencies...
call npm install

echo Installing Backend Dependencies...
cd llm-service
pip install -r requirements.txt

echo Downloading AI Models (Approx 2GB)...
python download_model.py
15: 
16: echo Ingesting Data into Vector Database (Training)...
17: python ingest_standalone.py

echo.
echo ===========================================
echo Setup Complete!
echo Run 'npm run dev' to start frontend
echo Run 'python main.py' (in llm-service) to start backend
echo ===========================================
pause
