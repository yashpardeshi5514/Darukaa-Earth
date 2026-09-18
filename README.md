# Darukaa.Earth

A full-stack geospatial data analytics platform for monitoring carbon and biodiversity projects.

## Overview

Darukaa.Earth allows administrators to:

- Create and manage environmental projects
- Add multiple geographic sites to projects
- Draw site boundaries directly on an interactive Mapbox map
- Store geographic polygons using PostgreSQL + PostGIS
- View project sites on a map
- Select individual sites
- View carbon and biodiversity performance over time
- Authenticate securely using JWT

## Tech Stack

### Frontend

- React
- Vite
- Mapbox GL JS
- Mapbox GL Draw
- Chart.js
- React Chart.js 2

### Backend

- Python
- FastAPI
- SQLAlchemy
- JWT authentication
- GeoAlchemy2
- Shapely

### Database

- PostgreSQL
- PostGIS

## Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │                     │
                    │ Mapbox + Chart.js   │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │                     │
                    │ Auth / Projects     │
                    │ Sites / Analytics   │
                    └──────────┬──────────┘
                               │
                               │ SQLAlchemy
                               ▼
                    ┌─────────────────────┐
                    │ PostgreSQL +        │
                    │      PostGIS        │
                    │                     │
                    │ Users               │
                    │ Projects            │
                    │ Sites               │
                    │ Analytics           │
                    └─────────────────────┘


Database Schema
Users
| Column        | Type     |
| ------------- | -------- |
| id            | Integer  |
| name          | String   |
| email         | String   |
| password_hash | String   |
| created_at    | DateTime |

Projects
| Column       | Type        |
| ------------ | ----------- |
| id           | Integer     |
| name         | String      |
| description  | String      |
| project_type | String      |
| status       | String      |
| created_by   | Foreign Key |
| created_at   | DateTime    |

Sites
| Column        | Type            |
| ------------- | --------------- |
| id            | Integer         |
| project_id    | Foreign Key     |
| name          | String          |
| description   | String          |
| geometry      | PostGIS Polygon |
| area_hectares | Integer         |
| created_at    | DateTime        |

Analytics
| Column             | Type        |
| ------------------ | ----------- |
| id                 | Integer     |
| site_id            | Foreign Key |
| year               | Integer     |
| carbon_value       | Integer     |
| biodiversity_index | Integer     |
| created_at         | DateTime    |

API Endpoints
Authentication
POST /auth/register
POST /auth/login
GET  /auth/me

Projects
POST   /projects/
GET    /projects/
GET    /projects/{project_id}
PUT    /projects/{project_id}
DELETE /projects/{project_id}

Sites
POST   /sites/{project_id}
GET    /sites/project/{project_id}
GET    /sites/{site_id}
GET    /sites/project/{project_id}/geojson
DELETE /sites/{site_id}

Analytics
GET /analytics/site/{site_id}

Local Setup

Prerequisites
Node.js
Python 3
PostgreSQL
PostGIS

Clone the repository
git clone <repository-url>
cd Darukaa-Earth

Backend Setup
cd backend

python -m venv venv

Windows
.\venv\Scripts\Activate.ps1

Install dependencies:
pip install -r requirements.txt

Create .env:
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/darukaa_earth

Start the backend:
uvicorn main:app --reload

Backend:
http://127.0.0.1:8000

Swagger documentation:
http://127.0.0.1:8000/docs

Frontend Setup
cd frontend
npm install

Create .env.local:
VITE_API_URL=http://127.0.0.1:8000
VITE_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN

Start the frontend:
npm run dev

Frontend:
http://localhost:5173

Authentication
The application uses JWT bearer authentication.
After login, the access token is stored in the browser's local storage and sent with protected API requests.

Geospatial Workflow
Site boundaries are created using Mapbox GL Draw.
The resulting GeoJSON polygon is sent to FastAPI.
FastAPI validates the polygon using Shapely and stores it as a PostGIS geometry using GeoAlchemy2.
The backend can convert the stored PostGIS geometry back to GeoJSON for Mapbox rendering.

Mapbox Draw
     ↓
GeoJSON Polygon
     ↓
FastAPI
     ↓
Shapely validation
     ↓
PostGIS
     ↓
GeoJSON
     ↓
Mapbox


Analytics
Site analytics are stored by year and include:

Carbon value
Biodiversity index

Chart.js displays the site's performance over time after selecting a site.

Environment Variables
Never commit real credentials.


Required backend:
DATABASE_URL=

Required frontend:
VITE_API_URL=
VITE_MAPBOX_TOKEN=

Project Structure

Darukaa-Earth/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsChart.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── MapView.jsx
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── project_routes.py
│   │   ├── site_routes.py
│   │   └── analytics_routes.py
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── main.py
│   └── requirements.txt
│
├── .gitignore
└── README.md


Demo Workflow
Register an account.
Login.
Open the project dashboard.
View project sites on the Mapbox map.
Draw a new geographic site polygon.
Save the site.
Select a site.
View its analytics and performance over time.
Security Notes
Database credentials are stored in environment variables.
JWT authentication protects private API endpoints.
Frontend environment files are excluded from Git.
Passwords are stored as bcrypt hashes rather than plaintext.
Future Improvements
Dynamic project/site creation UI
Advanced spatial analytics
Real environmental datasets
Role-based access control
Production database migrations with Alembic
Automated deployment
More detailed biodiversity and carbon metrics



## 23.2 — Create `requirements.txt`

This is important because the README tells another developer to run `pip install -r requirements.txt`.

Open:

```text
D:\Projects\Darukaa-Earth\backend


Create:
requirements.txt

Put:
fastapi
uvicorn[standard]
sqlalchemy
psycopg2-binary
python-dotenv
python-jose[cryptography]
passlib[bcrypt]
bcrypt==4.0.1
python-multipart
email-validator
geoalchemy2
shapely