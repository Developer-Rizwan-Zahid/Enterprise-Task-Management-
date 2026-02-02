from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models.models import SessionLocal, TaskAnalytics
from services.mq_consumer import run_consumer_thread
import os
import csv
from io import StringIO
from fastapi.responses import StreamingResponse

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Analytics & Reports Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Start RabbitMQ consumer on startup
@app.on_event("startup")
def startup_event():
    run_consumer_thread()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from pydantic import BaseModel
from datetime import datetime

class TaskEvent(BaseModel):
    Id: int
    Title: str
    Status: str
    AssignedToUserId: int = None

@app.post("/analytics/log")
def log_task_event(event: TaskEvent, db: Session = Depends(get_db)):
    analytics = TaskAnalytics(
        task_id=event.Id,
        title=event.Title,
        status=event.Status,
        assigned_to_user_id=event.AssignedToUserId
    )
    db.add(analytics)
    db.commit()
    return {"status": "success"}

# --- Analytics APIs ---

@app.get("/analytics/task-summary")
def get_task_summary(db: Session = Depends(get_db)):
    total = db.query(TaskAnalytics).count()
    return {"total_events": total}

@app.get("/analytics/user-performance")
def get_user_performance(db: Session = Depends(get_db)):
    # Group by user and count tasks
    results = db.execute("SELECT assigned_to_user_id, COUNT(*) as count FROM task_analytics GROUP BY assigned_to_user_id").fetchall()
    return [{"user_id": r[0], "task_count": r[1]} for r in results]

@app.get("/analytics/tasks-by-status")
def get_tasks_by_status(db: Session = Depends(get_db)):
    results = db.execute("SELECT status, COUNT(*) as count FROM task_analytics GROUP BY status").fetchall()
    return {r[0]: r[1] for r in results}

@app.get("/analytics/tasks-by-date")
def get_tasks_by_date(db: Session = Depends(get_db)):
    results = db.execute("SELECT CAST(event_time AS DATE), COUNT(*) as count FROM task_analytics GROUP BY CAST(event_time AS DATE)").fetchall()
    return {str(r[0]): r[1] for r in results}

@app.get("/analytics/completion-rate")
def get_completion_rate(db: Session = Depends(get_db)):
    total = db.query(TaskAnalytics).count()
    done = db.query(TaskAnalytics).filter(TaskAnalytics.status == "Done").count()
    rate = (done / total * 100) if total > 0 else 0
    return {"completion_rate": f"{rate:.2f}%"}

# --- Reports APIs ---

@app.get("/reports/weekly")
def get_weekly_report(db: Session = Depends(get_db)):
    total = db.query(TaskAnalytics).count()
    done = db.query(TaskAnalytics).filter(TaskAnalytics.status == "Done").count()
    return {
        "report_type": "Weekly",
        "total_tasks_monitored": total,
        "completed_tasks": done,
        "status": "Active"
    }

@app.get("/reports/monthly")
def get_monthly_report(db: Session = Depends(get_db)):
    total = db.query(TaskAnalytics).count()
    done = db.query(TaskAnalytics).filter(TaskAnalytics.status == "Done").count()
    return {
        "report_type": "Monthly",
        "total_tasks_monitored": total,
        "completed_tasks": done,
        "status": "Finalized"
    }

@app.get("/reports/export/pdf")
def export_pdf():
    # Mocking PDF export
    return {"message": "PDF Report generated successfully", "download_url": "/static/reports/report.pdf"}

@app.get("/reports/export/csv")
def export_csv(db: Session = Depends(get_db)):
    tasks = db.query(TaskAnalytics).all()
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "TaskID", "Title", "Status", "User", "Date"])
    for t in tasks:
        writer.writerow([t.id, t.task_id, t.title, t.status, t.assigned_to_user_id, t.event_time])
    
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=report.csv"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
