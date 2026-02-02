from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:rizwanzahid@localhost:5432/taskmgmt")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class TaskAnalytics(Base):
    __tablename__ = "task_analytics"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, index=True)
    title = Column(String)
    status = Column(String)
    assigned_to_user_id = Column(Integer)
    event_time = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)
