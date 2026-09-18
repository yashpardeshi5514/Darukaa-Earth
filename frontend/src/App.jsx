import { useState } from "react";

import {
  BarChart3,
  Bell,
  ChevronDown,
  FolderKanban,
  Leaf,
  LogOut,
  Map,
  Menu,
  Settings,
  ShieldCheck,
  TreePine,
  X
} from "lucide-react";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";


function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });


  const [authMode, setAuthMode] = useState("login");

  const [sidebarOpen, setSidebarOpen] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setUser(null);
    setAuthMode("login");
  };


  if (!user) {

    if (authMode === "signup") {
      return (
        <Signup
          onSwitchToLogin={() =>
            setAuthMode("login")
          }
        />
      );
    }


    return (
      <Login
        onLogin={setUser}
        onSwitchToSignup={() =>
          setAuthMode("signup")
        }
      />
    );
  }


  return (
    <div className="min-h-screen bg-[#07110d] text-white">


      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* Sidebar */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[260px]
          flex-col
          border-r
          border-white/10
          bg-[#0b1712]
          transition-transform
          duration-300
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* Brand */}
        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">

              <Leaf
                size={22}
                className="text-emerald-400"
              />

            </div>


            <div>

              <h1 className="text-[17px] font-semibold tracking-wide">

                DARUKAA

                <span className="text-emerald-400">
                  .EARTH
                </span>

              </h1>


              <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Earth Intelligence
              </p>

            </div>

          </div>


          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={19} />
          </button>

        </div>


        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>


          <div className="space-y-1">

            <button
              onClick={() =>
                document
                  .getElementById("dashboard")
                  ?.scrollIntoView({
                    behavior: "smooth"
                  })
              }
              className="flex w-full items-center gap-3 rounded-xl bg-emerald-500/10 px-3 py-3 text-sm font-medium text-emerald-400"
            >
              <BarChart3 size={18} />
              Dashboard
            </button>


            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <FolderKanban size={18} />
              Projects
            </button>


              <button
                onClick={() =>
                  document
                    .getElementById("sites")
                    ?.scrollIntoView({
                      behavior: "smooth"
                    })
                }
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <Map size={18} />
                Sites
              </button>


              <button
                onClick={() =>
                  document
                    .getElementById("analytics")
                    ?.scrollIntoView({
                      behavior: "smooth"
                    })
                }
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <BarChart3 size={18} />
                Analytics
              </button>

          </div>


          <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            System
          </p>


          <div className="space-y-1">

            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <ShieldCheck size={18} />
              Security
            </button>


            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">
              <Settings size={18} />
              Settings
            </button>

          </div>

        </nav>


        {/* User section */}
        <div className="border-t border-white/10 p-4">

          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-semibold text-emerald-400">

              {user.name?.charAt(0)?.toUpperCase() || "U"}

            </div>


            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-medium text-white">
                {user.name}
              </p>


              <p className="truncate text-xs text-slate-500">
                {user.email}
              </p>

            </div>

          </div>


          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >

            <LogOut size={17} />

            Sign out

          </button>

        </div>

      </aside>


      {/* Main */}
      <div className="lg:pl-[260px]">


        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-white/10 bg-[#07110d]/90 px-5 backdrop-blur-xl sm:px-8">


          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-slate-300 hover:bg-white/[0.06] lg:hidden"
            >
              <Menu size={20} />
            </button>


            <div>

              <p className="text-xs font-medium text-slate-500">
                Workspace
              </p>


              <h2 className="text-lg font-semibold text-white">
                Project Intelligence
              </h2>

            </div>

          </div>


          <div className="flex items-center gap-3">


            <button className="relative rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-slate-400 transition hover:bg-white/[0.06] hover:text-white">

              <Bell size={18} />

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />

            </button>


            <div className="hidden h-7 w-px bg-white/10 sm:block" />


            <button className="hidden items-center gap-2 rounded-xl px-2 py-1.5 sm:flex">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">

                {user.name?.charAt(0)?.toUpperCase() || "U"}

              </div>


              <span className="max-w-[120px] truncate text-sm text-slate-300">
                {user.name}
              </span>


              <ChevronDown
                size={15}
                className="text-slate-500"
              />

            </button>

          </div>

        </header>


        <main className="min-h-[calc(100vh-82px)]">

          <Dashboard />

        </main>

      </div>

    </div>
  );
}


export default App;