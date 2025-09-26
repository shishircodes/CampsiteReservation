import { signUp } from "@/app/actions/auth";

export const metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Left / Marketing (reuse copy) */}
        <section className="mx-auto max-w-2xl text-center lg:text-left">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-indigo-600">
              <path
                fill="currentColor"
                d="M12 2c.4 0 .77.21.97.56l7.5 12.98A1.12 1.12 0 0 1 19.5 17h-15a1.12 1.12 0 0 1-.97-1.46l7.5-12.98A1.12 1.12 0 0 1 12 2Z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Join <span className="text-indigo-600">CampSite</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-slate-600">
            Create your account to book spots, manage reservations, and explore
            the best camping locations.
          </p>
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* <img
              src="/images/camp-hero.png"
              alt="Camp illustration"
              className="h-64 w-full object-cover"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
            /> */}
            <div className="h-64 w-full bg-gradient-to-br from-indigo-100 to-sky-100 lg:absolute lg:inset-0 lg:-z-10" />
          </div>
        </section>

        {/* Right / Auth Card */}
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border bg-white p-6 shadow-xl ring-1 ring-black/5">
            <h2 className="mb-1 text-center text-2xl font-semibold">Create account</h2>
            <p className="mb-6 text-center text-sm text-slate-500">
              Start your camping journey
            </p>

            <form action={signUp} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">✉️</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-300 px-10 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">🔒</span>
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Create a password"
                    className="w-full rounded-lg border border-slate-300 px-10 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span>Sign Up</span>
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                 Google
              </button>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                 Facebook
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 hover:underline">
                Sign in
              </a>
            </p>

            <p className="mt-2 text-center text-xs text-slate-500">
              Verify your email to complete Sign Up
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
