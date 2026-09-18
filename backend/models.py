from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(String(1000), nullable=True)
    project_type = Column(String(50), nullable=False)
    status = Column(String(50), default="Active", nullable=False)

    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", backref="projects")


class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    name = Column(String(150), nullable=False)
    description = Column(String(1000), nullable=True)

    geometry = Column(
        Geometry("POLYGON", srid=4326),
        nullable=False
    )

    area_hectares = Column(Integer, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    project = relationship(
        "Project",
        backref="sites"
    )

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)

    site_id = Column(
        Integer,
        ForeignKey("sites.id"),
        nullable=False
    )

    year = Column(Integer, nullable=False)

    carbon_value = Column(Integer, nullable=True)

    biodiversity_index = Column(Integer, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    site = relationship(
        "Site",
        backref="analytics"
    )