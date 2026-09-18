from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from routes.auth_routes import router as auth_router
from routes.project_routes import router as project_router
from routes.site_routes import router as site_router
from routes.analytics_routes import router as analytics_router

from database import Base, engine
from models import User, Project, Site, Analytics

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Darukaa.Earth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(project_router)
app.include_router(site_router)
app.include_router(analytics_router)


@app.get("/")
def root():
    return {"message": "Darukaa.Earth API is running"}


@app.get("/health")
def health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "database": "connected"
    }