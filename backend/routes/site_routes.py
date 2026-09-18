from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape, to_shape
from shapely.geometry import shape, mapping

from database import get_db
from models import Site, Project
from auth import get_current_user


router = APIRouter(
    prefix="/sites",
    tags=["Sites"]
)


@router.post("/{project_id}")
def create_site(
    project_id: int,
    name: str,
    geometry: dict = Body(...),
    description: str = None,
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

    try:
        polygon = shape(geometry)

        if polygon.geom_type != "Polygon":
            raise ValueError("Geometry must be a Polygon")

        if not polygon.is_valid:
            raise ValueError("Polygon geometry is invalid")

    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid polygon geometry: {str(error)}"
        )

    site = Site(
        project_id=project_id,
        name=name,
        description=description,
        geometry=from_shape(
            polygon,
            srid=4326
        )
    )

    db.add(site)
    db.commit()
    db.refresh(site)

    return {
        "message": "Site created successfully",
        "site": {
            "id": site.id,
            "project_id": site.project_id,
            "name": site.name,
            "description": site.description
        }
    }


@router.get("/project/{project_id}")
def get_project_sites(
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

    sites = (
        db.query(Site)
        .filter(Site.project_id == project_id)
        .all()
    )

    return {
        "sites": [
            {
                "id": site.id,
                "project_id": site.project_id,
                "name": site.name,
                "description": site.description,
                "area_hectares": site.area_hectares
            }
            for site in sites
        ]
    }


@router.get("/{site_id}")
def get_site(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    site = (
        db.query(Site)
        .join(Project)
        .filter(
            Site.id == site_id,
            Project.created_by == current_user["id"]
        )
        .first()
    )

    if not site:
        raise HTTPException(
            status_code=404,
            detail="Site not found"
        )

    return {
        "site": {
            "id": site.id,
            "project_id": site.project_id,
            "name": site.name,
            "description": site.description,
            "area_hectares": site.area_hectares
        }
    }


@router.delete("/{site_id}")
def delete_site(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    site = (
        db.query(Site)
        .join(Project)
        .filter(
            Site.id == site_id,
            Project.created_by == current_user["id"]
        )
        .first()
    )

    if not site:
        raise HTTPException(
            status_code=404,
            detail="Site not found"
        )

    db.delete(site)
    db.commit()

    return {
        "message": "Site deleted successfully"
    }


@router.get("/project/{project_id}/geojson")
def get_project_sites_geojson(
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

    sites = (
        db.query(Site)
        .filter(Site.project_id == project_id)
        .all()
    )

    features = []

    for site in sites:
        polygon = to_shape(site.geometry)

        features.append({
            "type": "Feature",
            "id": site.id,
            "geometry": mapping(polygon),
            "properties": {
                "id": site.id,
                "name": site.name,
                "description": site.description,
                "project_id": site.project_id,
                "area_hectares": site.area_hectares
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }