from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Project
from auth import get_current_user


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


@router.post("/")
def create_project(
    name: str,
    description: str = None,
    project_type: str = "Carbon",
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = Project(
        name=name,
        description=description,
        project_type=project_type,
        created_by=current_user["id"]
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return {
        "message": "Project created successfully",
        "project": {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "project_type": project.project_type,
            "status": project.status,
            "created_by": project.created_by
        }
    }


@router.get("/")
def get_projects(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    projects = (
        db.query(Project)
        .filter(Project.created_by == current_user["id"])
        .all()
    )

    return {
        "projects": [
            {
                "id": project.id,
                "name": project.name,
                "description": project.description,
                "project_type": project.project_type,
                "status": project.status,
                "created_by": project.created_by
            }
            for project in projects
        ]
    }


@router.get("/{project_id}")
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.created_by == current_user["id"]
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return {
        "project": {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "project_type": project.project_type,
            "status": project.status,
            "created_by": project.created_by
        }
    }


@router.put("/{project_id}")
def update_project(
    project_id: int,
    name: str,
    description: str = None,
    project_type: str = "Carbon",
    status: str = "Active",
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.created_by == current_user["id"]
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    project.name = name
    project.description = description
    project.project_type = project_type
    project.status = status

    db.commit()
    db.refresh(project)

    return {
        "message": "Project updated successfully",
        "project": {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "project_type": project.project_type,
            "status": project.status
        }
    }


@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.created_by == current_user["id"]
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully"
    }