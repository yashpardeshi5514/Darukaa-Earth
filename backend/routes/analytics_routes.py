from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Analytics, Site, Project
from auth import get_current_user


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get("/site/{site_id}")
def get_site_analytics(
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

    analytics = (
        db.query(Analytics)
        .filter(Analytics.site_id == site_id)
        .order_by(Analytics.year)
        .all()
    )

    return {
        "site": {
            "id": site.id,
            "name": site.name
        },
        "analytics": [
            {
                "year": item.year,
                "carbon_value": item.carbon_value,
                "biodiversity_index": item.biodiversity_index
            }
            for item in analytics
        ]
    }