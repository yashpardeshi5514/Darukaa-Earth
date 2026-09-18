# Darukaa.Earth

> A full-stack geospatial data analytics platform for monitoring carbon and biodiversity projects.

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20PostGIS-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Mapping](https://img.shields.io/badge/Maps-Mapbox-000000?logo=mapbox&logoColor=white)](https://www.mapbox.com/)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](https://github.com/features/actions)

---

## 🌍 Overview

**Darukaa.Earth** is a full-stack geospatial analytics platform designed for carbon and biodiversity projects.

The platform allows administrators to:

- Create and manage environmental projects
- Add multiple geographic sites to projects
- Draw site boundaries directly on an interactive map
- Store geographic polygons using PostgreSQL + PostGIS
- View project sites on an interactive map
- Select individual sites and inspect their details
- View carbon and biodiversity performance over time
- Authenticate users securely using JWT

---

## ✨ Features

### 🔐 Authentication

- User registration
- JWT-based authentication
- Password hashing using bcrypt
- Protected API endpoints
- User-specific project access

### 📁 Project Management

- Create projects
- View projects
- Update projects
- Delete projects
- Associate multiple geographic sites with each project

### 🗺️ Geospatial Mapping

- Interactive Mapbox map
- Draw site boundaries using Mapbox GL Draw
- Polygon validation using Shapely
- PostGIS polygon storage
- GeoJSON API responses
- Interactive site selection

### 📊 Analytics

- Site-level analytics
- Yearly carbon values
- Yearly biodiversity index
- Interactive Chart.js visualizations
- Performance trends over time

### ⚙️ Developer Experience

- React + Vite frontend
- FastAPI backend
- PostgreSQL + PostGIS
- GitHub Actions CI
- Environment-based configuration
- Production deployment using Vercel and Render

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────┐
│             React UI                │
│                                     │
│       Mapbox GL JS + Chart.js       │
└──────────────────┬──────────────────┘
                   │
                   │ REST API / HTTPS
                   ▼
┌─────────────────────────────────────┐
│             FastAPI                 │
│                                     │
│  Authentication                     │
│  Projects                            │
│  Sites                               │
│  Analytics                           │
└──────────────────┬──────────────────┘
                   │
                   │ SQLAlchemy
                   ▼
┌─────────────────────────────────────┐
│       PostgreSQL + PostGIS          │
│                                     │
│  Users                              │
│  Projects                           │
│  Sites                              │
│  Analytics                          │
└─────────────────────────────────────┘
```

### Production Deployment

```text
                   Internet
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
     Vercel                    Render
   React Frontend           FastAPI Backend
                                  │
                                  ▼
                         PostgreSQL + PostGIS
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Mapping | Mapbox GL JS, Mapbox GL Draw |
| Charts | Chart.js, react-chartjs-2 |
| Backend | Python, FastAPI, Uvicorn |
| ORM | SQLAlchemy |
| Geospatial | GeoAlchemy2, Shapely |
| Database | PostgreSQL, PostGIS |
| Authentication | JWT, bcrypt/passlib |
| CI | GitHub Actions |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Database Hosting | Render PostgreSQL |

---

## 🗃️ Database Schema

The application uses four core entities.

### Users

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `name` | String | User name |
| `email` | String | Unique email |
| `password_hash` | String | Bcrypt password hash |
| `created_at` | DateTime | Account creation time |

### Projects

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `name` | String | Project name |
| `description` | String | Project description |
| `project_type` | String | Type of project |
| `status` | String | Project status |
| `created_by` | Foreign Key | Project owner |
| `created_at` | DateTime | Creation time |

### Sites

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `project_id` | Foreign Key | Associated project |
| `name` | String | Site name |
| `description` | String | Site description |
| `geometry` | PostGIS Polygon | Geographic boundary |
| `area_hectares` | Integer | Site area |
| `created_at` | DateTime | Creation time |

### Analytics

| Column | Type | Description |
|---|---|---|
| `id` | Integer | Primary key |
| `site_id` | Foreign Key | Associated site |
| `year` | Integer | Observation year |
| `carbon_value` | Integer | Carbon metric |
| `biodiversity_index` | Integer | Biodiversity metric |
| `created_at` | DateTime | Record creation time |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a user |
| `POST` | `/auth/login` | Authenticate and receive JWT |
| `GET` | `/auth/me` | Get authenticated user |

### Projects

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/projects/` | Create project |
| `GET` | `/projects/` | List user's projects |
| `GET` | `/projects/{project_id}` | Get project |
| `PUT` | `/projects/{project_id}` | Update project |
| `DELETE` | `/projects/{project_id}` | Delete project |

### Sites

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/sites/{project_id}` | Create geographic site |
| `GET` | `/sites/project/{project_id}` | List project sites |
| `GET` | `/sites/{site_id}` | Get site |
| `GET` | `/sites/project/{project_id}/geojson` | Get sites as GeoJSON |
| `DELETE` | `/sites/{site_id}` | Delete site |

### Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/analytics/site/{site_id}` | Get site analytics |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | API and database health check |

---

## 🗺️ Geospatial Workflow

```text
Mapbox GL Draw
       │
       ▼
GeoJSON Polygon
       │
       ▼
FastAPI API
       │
       ▼
Shapely Validation
       │
       ▼
GeoAlchemy2
       │
       ▼
PostgreSQL + PostGIS
       │
       ▼
GeoJSON FeatureCollection
       │
       ▼
Mapbox Rendering
```

### How it works

1. An administrator selects a project.
2. The administrator activates polygon drawing.
3. A geographic boundary is drawn on the Mapbox map.
4. Mapbox produces a GeoJSON polygon.
5. The polygon is sent to the FastAPI backend.
6. Shapely validates the geometry.
7. GeoAlchemy2 stores the polygon in PostGIS.
8. The backend can return the stored geometry as GeoJSON.
9. The frontend renders the saved site on the map.

---

## 📈 Analytics

Analytics are associated with individual sites and stored by year.

The current model contains:

- **Carbon value**
- **Biodiversity index**
- **Observation year**

Chart.js is used to display performance trends after selecting a site.

> **Note:** The current analytics dataset contains demonstration values for the product workflow and should not be interpreted as real-world environmental measurements.

---

## 📂 Project Structure

```text
Darukaa-Earth/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsChart.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── MapView.jsx
│   │   │
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── project_routes.py
│   │   ├── site_routes.py
│   │   └── analytics_routes.py
│   │
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── main.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites

Make sure you have installed:

- Node.js 20+
- Python 3.12+
- PostgreSQL
- PostGIS
- Git
- A Mapbox access token

### 1. Clone the repository

```bash
git clone https://github.com/yashpardeshi5514/Darukaa-Earth.git
cd Darukaa-Earth
```

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

#### Windows

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create:

```text
backend/.env
```

Add:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/darukaa_earth
SECRET_KEY=YOUR_SECRET_KEY
```

Make sure PostGIS is enabled:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

Start the backend:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd Darukaa-Earth/frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env.local
```

Add:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_MAPBOX_TOKEN=YOUR_MAPBOX_TOKEN
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend

```env
DATABASE_URL=
SECRET_KEY=
```

### Frontend

```env
VITE_API_URL=
VITE_MAPBOX_TOKEN=
```

> Never commit real credentials, database URLs, API keys, or secrets to GitHub.

Local environment files are excluded from Git using `.gitignore`.

---

## 🔑 Authentication Flow

```text
Register
   │
   ▼
Password → bcrypt hash
   │
   ▼
PostgreSQL
   │
   ▼
Login
   │
   ▼
JWT Access Token
   │
   ▼
Protected API Requests
```

The JWT is used as a bearer token for protected API requests.

---

## 🔄 Demo Workflow

1. Open the live application.
2. Register an account.
3. Log in.
4. Open the project dashboard.
5. View project sites on the Mapbox map.
6. Select a project.
7. Draw a new geographic site polygon.
8. Save the site.
9. Select the site.
10. View site analytics and performance over time.

---

## 🧪 CI / GitHub Actions

GitHub Actions runs on pushes and pull requests targeting `main`.

### Frontend CI

```text
Checkout
   ↓
Setup Node.js
   ↓
npm ci
   ↓
npm run build
```

### Backend CI

```text
Checkout
   ↓
Setup Python
   ↓
Install requirements
   ↓
python -m compileall .
```

Workflow:

```text
.github/workflows/ci.yml
```

---

## ☁️ Deployment

### Frontend

Deployed using **Vercel**.

Live application:

https://darukaa-earth-delta.vercel.app/

### Backend

Deployed using **Render**.

The backend provides:

```text
/health
/docs
```

for health verification and interactive API documentation.

### Database

Production database:

```text
PostgreSQL + PostGIS
```

Hosted using Render PostgreSQL.

---

## 🔒 Security

- Passwords are stored as bcrypt hashes.
- JWT protects authenticated API endpoints.
- Database credentials are stored in environment variables.
- JWT secrets are stored in environment variables.
- Frontend environment files are excluded from Git.
- Production CORS is configured for the deployed frontend.
- Secrets are not included in this repository.

---

## 🛣️ Future Improvements

- Alembic database migrations
- More comprehensive automated tests
- Advanced spatial analytics
- Real environmental datasets
- Role-based access control
- Richer carbon and biodiversity metrics
- Expanded project and site management
- Automated production deployment improvements
- More detailed site performance reporting

---

## 🌐 Links

| Resource | Link |
|---|---|
| Live Demo | https://darukaa-earth-delta.vercel.app/ |
| GitHub Repository | https://github.com/yashpardeshi5514/Darukaa-Earth |

---

## 📄 License

This project was developed as part of the **Darukaa.Earth Full-Stack Developer Hackathon Challenge**.
