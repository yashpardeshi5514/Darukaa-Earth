import { useState } from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
  CheckCircle2
} from "lucide-react";


function Signup({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }


    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }


    setLoading(true);


    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
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
          detail || "Unable to create your account."
        );
      }


      setSuccess(
        "Account created successfully. You can now sign in."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (err) {
      console.error("Signup error:", err);

      setError(
        err.message ||
        "Unable to create your account. Please try again."
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


      {/* Background grid */}
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


          {/* Left branding panel */}
          <div className="relative hidden min-h-[720px] overflow-hidden border-r border-white/[0.07] lg:block">


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
                    Build a better view of Earth
                  </span>

                </div>


                <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight text-white xl:text-5xl">

                  Turn environmental
                  <span className="block text-emerald-400">
                    data into insight.
                  </span>

                </h1>


                <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400">

                  Create your workspace and bring project
                  boundaries, carbon observations and
                  biodiversity indicators together in one
                  geospatial platform.

                </p>


                {/* Benefits */}
                <div className="mt-9 space-y-4">


                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">

                      <CheckCircle2
                        size={17}
                        className="text-emerald-400"
                      />

                    </div>


                    <div>

                      <p className="text-sm font-medium text-slate-200">
                        Create and manage projects
                      </p>

                      <p className="text-xs text-slate-600">
                        Organize environmental initiatives
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">

                      <CheckCircle2
                        size={17}
                        className="text-emerald-400"
                      />

                    </div>


                    <div>

                      <p className="text-sm font-medium text-slate-200">
                        Map geographic sites
                      </p>

                      <p className="text-xs text-slate-600">
                        Draw and explore project boundaries
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">

                      <CheckCircle2
                        size={17}
                        className="text-emerald-400"
                      />

                    </div>


                    <div>

                      <p className="text-sm font-medium text-slate-200">
                        Explore environmental analytics
                      </p>

                      <p className="text-xs text-slate-600">
                        Follow carbon and biodiversity trends
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


          {/* Signup panel */}
          <div className="flex min-h-[720px] items-center justify-center p-6 sm:p-10 lg:p-12">

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


              {/* Heading */}
              <div className="mb-7">

                <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-emerald-400">
                  Get started
                </p>


                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  Create your workspace
                </h2>


                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Set up your account to start managing
                  environmental projects and monitoring sites.
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


              {/* Success */}
              {success && (

                <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">

                  <p className="text-xs leading-5 text-emerald-400">
                    {success}
                  </p>

                </div>

              )}


              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >


                {/* Name */}
                <div>

                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Full name
                  </label>


                  <div className="relative">

                    <UserRound
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />


                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Your name"
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07110d] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-700 transition focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/[0.06]"
                    />

                  </div>

                </div>


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

                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Password
                  </label>


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
                      placeholder="Create a password"
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


                {/* Confirm password */}
                <div>

                  <label className="mb-2 block text-xs font-medium text-slate-400">
                    Confirm password
                  </label>


                  <div className="relative">

                    <LockKeyhole
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                    />


                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Repeat your password"
                      required
                      className="w-full rounded-xl border border-white/[0.08] bg-[#07110d] py-3.5 pl-11 pr-12 text-sm text-white outline-none placeholder:text-slate-700 transition focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/[0.06]"
                    />


                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-600 transition hover:text-slate-300"
                    >

                      {showConfirmPassword ? (
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
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 text-sm font-semibold text-[#04110a] shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#04110a]/30 border-t-[#04110a]" />

                      Creating account...
                    </>
                  ) : (
                    <>
                      Create account

                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />

                    </>
                  )}

                </button>

              </form>


              {/* Login link */}
              <div className="mt-7 text-center">

                <span className="text-xs text-slate-600">
                  Already have an account?
                </span>


                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="ml-2 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300"
                >
                  Sign in
                </button>

              </div>


              {/* Security */}
              <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">

                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-500/70"
                />


                <p className="text-[11px] leading-5 text-slate-600">
                  Your account is protected using authenticated
                  access. Keep your login credentials private.
                </p>

              </div>


              <p className="mt-7 text-center text-[10px] text-slate-700">
                Darukaa.Earth · Environmental Intelligence
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


export default Signup;