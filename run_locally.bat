@echo off
echo Starting Enterprise Task Management System (LOCAL)...

:: Start .NET TaskService in a new window
echo Starting .NET TaskService...
cd TaskService
start "TaskService" dotnet run
cd ..

:: Start Python AnalyticsService in a new window
echo Starting Python AnalyticsService...
cd AnalyticsService
if not exist venv (
    python -m venv venv
)
call .\venv\Scripts\activate
pip install -r requirements.txt
start "AnalyticsService" uvicorn main:app --reload --port 8000
cd ..

echo Both services are starting. 
echo .NET Swagger: http://localhost:5000/swagger
echo Python API: http://localhost:8000/docs
pause
