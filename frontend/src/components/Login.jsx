import { useState } from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  TreePine
} from "lucide-react";


function Login({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);


    try {
        const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            email,
            password
            })
        }
        );


      const data = await response.json();


        if (!response.ok) {
        const detail = Array.isArray(data.detail)
            ? data.detail
                .map((item) => item.msg)
                .join(", ")
            : data.detail;

        throw new Error(
            detail || "Invalid email or password"
        );
        }

      localStorage.setItem(
        "access_token",
        data.access_token
      );


      const userResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        {
          headers: {
            Authorization:
              `Bearer ${data.access_token}`
          }
        }
      );


      const userData = await userResponse.json();


      if (!userResponse.ok) {
        throw new Error("Unable to load user profile");
      }


      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );


      onLogin(userData);

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message ||
        "Unable to sign in. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07110d] text-white">


      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.07] blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-green-500/[0.05] blur-3xl" />


      {/* Decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }}
      />


      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 py-10 sm:px-8">


        <div className="grid w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b1712]/80 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">


          {/* Left panel */}
          <div className="relative hidden min-h-[650px] overflow-hidden border-r border-white/[0.07] lg:block">


            {/* Decorative circles */}
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-emerald-400/[0.08]" />

            <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border border-emerald-400/[0.06]" />


            <div className="relative flex h-full flex-col justify-between p-12">


              {/* Brand */}
              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Leaf
                    size={23}
                    className="text-emerald-400"
                  />
                </div>


                <div>

                  <p className="text-base font-semibold tracking-wide">
                    DARUKAA
                    <span className="text-emerald-400">
                      .EARTH
                    </span>
                  </p>

                  <p className="text-[9px] uppercase tracking-[0.22em] text-slate-600">
                    Earth Intelligence
                  </p>

                </div>

              </div>


              {/* Main message */}
              <div className="max-w-xl">

                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-1.5">

                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                    Environmental Intelligence
                  </span>

                </div>


                <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-white xl:text-5xl">
                  Understand your
                  <span className="block text-emerald-400">
                    impact on Earth.
                  </span>
                </h1>


                <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400">
                  Explore project sites, monitor geographic
                  boundaries and understand carbon and
                  biodiversity performance through one
                  connected workspace.
                </p>


                {/* Feature list */}
                <div className="mt-9 space-y-4">


                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                      <TreePine
                        size={17}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>

                      <p className="text-sm font-medium text-slate-200">
                        Biodiversity monitoring
                      </p>

                      <p className="text-xs text-slate-600">
                        Track ecological indicators over time
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                      <Leaf
                        size={17}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>

                      <p className="text-sm font-medium text-slate-200">
                        Carbon intelligence
                      </p>

                      <p className="text-xs text-slate-600">
                        Visualize historical carbon observations
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                      <ShieldCheck
                        size={17}
                        className="text-emerald-400"
                      />
                    </div>

                    <div>

                      <p className="text-sm font-medium text-slate-200">
                        Secure workspace
                      </p>

                      <p className="text-xs text-slate-600">
                        Protected project and site access
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* Footer */}
              <div className="flex items-center gap-2 text-[10px] text-slate-600">

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/70" />

                Geospatial project intelligence platform

              </div>

            </div>

          </div>


          {/* Login panel */}
          <div className="flex min-h-[650px] items-center justify-center p-6 sm:p-10 lg:p-12">

            <div className="w-full max-w-md">


              {/* Mobile brand */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">

                  <Leaf
                    size={21}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <p className="font-semibold">
                    DARUKAA
                    <span className="text-emerald-400">
                      .EARTH
                    </span>
                  </p>

                  <p className="text-[9px] uppercase tracking-[0.18em] text-slate-600">
                    Earth Intelligence
                  </p>

                </div>

              </div>


              <div className="mb-8">

                <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-emerald-400">
                  Welcome back
                </p>

                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  Sign in to your workspace
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Access your projects, monitoring sites and
                  environmental analytics.
                </p>

              </div>


              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">

                  <p className="text-xs leading-5 text-red-400">
                    {error}
                  </p>

                </div>
              )}


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >


                {/* Email */}
                <div>

                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Email address
                  </label>


                  <div className="relative">

                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />


                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07110d] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-700 transition focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/[0.06]"
                    />

                  </div>

                </div>


                {/* Password */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label className="text-xs font-medium text-slate-400">
                      Password
                    </label>

                  </div>


                  <div className="relative">

                    <LockKeyhole
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />


                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07110d] py-3.5 pl-11 pr-12 text-sm text-white outline-none placeholder:text-slate-700 transition focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/[0.06]"
                    />


                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-600 transition hover:text-slate-300"
                    >

                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}

                    </button>

                  </div>

                </div>


                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-semibold text-[#04110a] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#04110a]/30 border-t-[#04110a]" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}

                </button>

              </form>

<div className="mt-6 text-center">
  <span className="text-xs text-slate-600">
    Don't have an account?
  </span>

  <button
    type="button"
    onClick={onSwitchToSignup}
    className="ml-2 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300"
  >
    Create account
  </button>
</div>


              {/* Security note */}
              <div className="mt-8 flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">

                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-500/70"
                />

                <p className="text-[11px] leading-5 text-slate-600">
                  Your workspace is protected using authenticated
                  access. Keep your credentials private.
                </p>

              </div>


              <p className="mt-8 text-center text-[10px] text-slate-700">
                Darukaa.Earth · Environmental Intelligence
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Login;