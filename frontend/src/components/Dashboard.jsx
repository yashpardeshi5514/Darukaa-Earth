import { useEffect, useState } from "react";

import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CircleCheck,
  Cloud,
  Droplets,
  Leaf,
  MapPinned,
  TreePine
} from "lucide-react";

import MapView from "./MapView";
import AnalyticsChart from "./AnalyticsChart";


function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [sites, setSites] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(1);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDrawing, setStartDrawing] = useState(0);


  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token");


      const projectsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/projects/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const projectsData = await projectsResponse.json();

      const projectList = projectsData.projects || [];
      setProjects(projectList);

      if (
        projectList.length > 0 &&
        !projectList.some((project) => project.id === selectedProjectId)
      ) {
        setSelectedProjectId(projectList[0].id);
      }


      const sitesResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/sites/project/${selectedProjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const sitesData = await sitesResponse.json();

      setSites(sitesData.sites || []);

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDashboardData();
  }, [selectedProjectId]);


  const handleSiteSelect = (siteId) => {
    setSelectedSiteId(siteId);
  };

  const handleSiteCreated = () => {
    fetchDashboardData();
  };


  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-82px)] items-center justify-center bg-[#07110d]">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-400" />
          Loading workspace...
        </div>
      </div>
    );
  }


  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );


  return (
    <div className="min-h-[calc(100vh-82px)] bg-[#07110d]">

      {/* Dashboard header */}
      <section className="border-b border-white/[0.06] px-5 py-8 sm:px-8 lg:px-10">

        <div className="mx-auto max-w-[1600px]">

          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                  <TreePine
                    size={15}
                    className="text-emerald-400"
                  />
                </span>

                <span className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400">
                  Environmental Intelligence
                </span>

              </div>


                <h1
                id="dashboard"
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                >
                Project Dashboard
                </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Monitor carbon performance, biodiversity indicators and
                geographic project activity from one workspace.
              </p>

            </div>


            {/* Project selector */}
            <div className="relative min-w-[260px]">

              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Active Project
              </label>


              <div className="relative">

                <select
                  value={selectedProjectId}
                  onChange={(event) =>
                    setSelectedProjectId(
                      Number(event.target.value)
                    )
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#101d17] px-4 py-3 pr-10 text-sm font-medium text-white outline-none transition hover:border-emerald-500/30 focus:border-emerald-500/50"
                >

                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.name}
                    </option>
                  ))}

                </select>


                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Main dashboard */}
      <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10">


        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


          {/* Projects */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101b18] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-500/20">

            <div className="flex items-start justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Leaf
                  size={19}
                  className="text-emerald-400"
                />
              </div>


              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400">
                <ArrowUpRight size={11} />
                Active
              </span>

            </div>


            <div className="mt-5">

              <p className="text-xs font-medium text-slate-500">
                Active Project
              </p>

              <p className="mt-1 truncate text-lg font-semibold text-white">
                {selectedProject?.name || "—"}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Environmental monitoring
              </p>

            </div>

          </div>


          {/* Sites */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101b18] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-sky-500/20">

            <div className="flex items-start justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10">
                <MapPinned
                  size={19}
                  className="text-sky-400"
                />
              </div>


              <span className="text-xs text-slate-500">
                Geographic
              </span>

            </div>


            <div className="mt-5">

              <p className="text-xs font-medium text-slate-500">
                Monitoring Sites
              </p>

              <p className="mt-1 text-2xl font-semibold text-white">
                {sites.length}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Mapped project locations
              </p>

            </div>

          </div>


          {/* Carbon */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101b18] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-lime-500/20">

            <div className="flex items-start justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-500/10">
                <Activity
                  size={19}
                  className="text-lime-400"
                />
              </div>


              <span className="flex items-center gap-1 text-xs text-emerald-400">
                <ArrowUpRight size={13} />
                Trending
              </span>

            </div>


            <div className="mt-5">

              <p className="text-xs font-medium text-slate-500">
                Latest Carbon Value
              </p>

              <p className="mt-1 text-2xl font-semibold text-white">
                198
                <span className="ml-1 text-sm font-normal text-slate-500">
                  tCO₂e
                </span>
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Latest available observation
              </p>

            </div>

          </div>


          {/* Biodiversity */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101b18] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-violet-500/20">

            <div className="flex items-start justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <TreePine
                  size={19}
                  className="text-violet-400"
                />
              </div>


              <span className="text-xs text-slate-500">
                Index
              </span>

            </div>


            <div className="mt-5">

              <p className="text-xs font-medium text-slate-500">
                Biodiversity Index
              </p>

              <p className="mt-1 text-2xl font-semibold text-white">
                72
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Latest available observation
              </p>

            </div>

          </div>

        </div>


        {/* Project summary */}
        {selectedProject && (
          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-[#101b18] p-5">

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

              <div>

                <div className="flex items-center gap-2">

                  <CircleCheck
                    size={17}
                    className="text-emerald-400"
                  />

                  <span className="text-xs font-medium text-emerald-400">
                    Project status
                  </span>

                </div>


                <h2 className="mt-2 text-lg font-semibold text-white">
                  {selectedProject.name}
                </h2>


                <p className="mt-1 text-sm text-slate-500">
                  {selectedProject.description ||
                    "No project description available."}
                </p>

              </div>


              <div className="flex flex-wrap gap-3">

                <div className="rounded-xl bg-white/[0.03] px-4 py-3">

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays size={14} />
                    Status
                  </div>

                  <p className="mt-1 text-sm font-medium text-white">
                    {selectedProject.status}
                  </p>

                </div>


                <div className="rounded-xl bg-white/[0.03] px-4 py-3">

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Droplets size={14} />
                    Coverage
                  </div>

                  <p className="mt-1 text-sm font-medium text-white">
                    {sites.length} sites
                  </p>

                </div>

              </div>

            </div>

          </div>
        )}


        {/* Map + sites */}
        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">


          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101b18]">

            <div className="flex flex-col gap-4 border-b border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

                <h2 className="text-sm font-semibold text-white">
                Geographic Overview
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                Project sites and monitoring boundaries
                </p>

            </div>


            <div className="flex items-center gap-2">

                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-2.5 py-2 text-[10px] font-medium text-emerald-400">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                LIVE MAP

                </div>


                <button
                onClick={() => {
                    setStartDrawing((current) => current + 1);
                }}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-[#04110a] transition hover:bg-emerald-400"
                >
                <MapPinned size={14} />

                Add Site
                </button>

            </div>

            </div>


            <div className="h-[500px]">

              <MapView
                projectId={selectedProjectId}
                onSiteSelect={handleSiteSelect}
                startDrawing={startDrawing}
                onSiteCreated={handleSiteCreated}
              />

            </div>

          </div>


          {/* Sites */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#101b18] p-5">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-sm font-semibold text-white">
                  Project Sites
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Select a site to inspect
                </p>

              </div>


              <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-emerald-500/10 px-2 text-xs font-semibold text-emerald-400">
                {sites.length}
              </div>

            </div>


            <div className="mt-5 space-y-3">

              {sites.length === 0 ? (

                <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">

                  <MapPinned
                    size={22}
                    className="mx-auto text-slate-600"
                  />

                  <p className="mt-3 text-sm text-slate-400">
                    No sites available
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Draw a polygon on the map to create one.
                  </p>

                </div>

              ) : (

                sites.map((site) => (

                  <button
                    key={site.id}
                    onClick={() => handleSiteSelect(site.id)}
                    className={`
                      w-full
                      rounded-xl
                      border
                      p-4
                      text-left
                      transition
                      duration-200
                      ${
                        selectedSiteId === site.id
                          ? "border-emerald-500/30 bg-emerald-500/[0.08]"
                          : "border-white/[0.06] bg-[#0b1511] hover:border-white/10 hover:bg-white/[0.03]"
                      }
                    `}
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-start gap-3">

                        <div
                          className={`
                            mt-0.5
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            ${
                              selectedSiteId === site.id
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-white/[0.05] text-slate-500"
                            }
                          `}
                        >
                          <MapPinned size={16} />
                        </div>


                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-white">
                            {site.name}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {site.description ||
                              "No description available."}
                          </p>

                        </div>

                      </div>


                      <ArrowUpRight
                        size={15}
                        className={
                          selectedSiteId === site.id
                            ? "text-emerald-400"
                            : "text-slate-700"
                        }
                      />

                    </div>


                    <div className="mt-3 flex items-center justify-between">

                      <span className="text-[10px] uppercase tracking-wider text-slate-600">
                        Site ID
                      </span>

                      <span className="text-xs font-medium text-slate-400">
                        #{site.id}
                      </span>

                    </div>

                  </button>

                ))

              )}

            </div>

          </div>

        </div>


        {/* Analytics */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#101b18]">

          <div className="flex flex-col justify-between gap-3 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center">

            <div>

              <div className="flex items-center gap-2">

                <BarChart3Icon />

                <h2
                id="analytics"
                className="text-sm font-semibold text-white"
                >
                Site Performance
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Historical carbon and biodiversity observations
              </p>

            </div>


            <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2 text-xs text-slate-400">

              <Activity size={14} />

              {selectedSiteId
                ? `Site #${selectedSiteId}`
                : "Select a site"}

            </div>

          </div>


          <div className="p-5">

            <AnalyticsChart
              siteId={selectedSiteId}
            />

          </div>

        </div>


        {/* Footer status */}
        <div className="flex flex-col justify-between gap-2 py-6 text-[11px] text-slate-600 sm:flex-row sm:items-center">

          <p>
            Darukaa.Earth · Environmental Intelligence Platform
          </p>

          <div className="flex items-center gap-2">
            <Cloud size={13} />
            Data connected
          </div>

        </div>

      </div>

    </div>
  );
}


function BarChart3Icon() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
      <Activity
        size={16}
        className="text-emerald-400"
      />
    </div>
  );
}


export default Dashboard;