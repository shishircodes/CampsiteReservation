import { signIn } from "@/app/actions/auth";

export const metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto grid max-w-10xl gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Left / Marketing */}
        <section className="mx-auto max-w-2xl text-center lg:text-left">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            {/* camp icon */}
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-indigo-600">
              <path
                fill="currentColor"
                d="M12 2c.4 0 .77.21.97.56l7.5 12.98A1.12 1.12 0 0 1 19.5 17h-15a1.12 1.12 0 0 1-.97-1.46l7.5-12.98A1.12 1.12 0 0 1 12 2Zm0 3.3L6.02 15.75h11.96L12 5.3Zm-1 5.7h2v2h-2v-2Zm-6 9h14v2H5v-2Z"
              />
            </svg>
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Welcome to <span className="text-indigo-600">CampSite</span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-slate-600">
            Discover amazing camping spots and book your perfect outdoor adventure. Connect
            with nature and create unforgettable memories.
          </p>

          {/* Illustration */}
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
            {/* <img
              src="/images/camp-hero.png"
              alt="Mountains and tents"
              className="h-64 w-full object-cover"
              onError={(e) => {
                // fallback gradient block if you don't have the image yet
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            /> */}
            {/* Fallback block (visible if image missing) */}
            <div className="h-64 w-full bg-gradient-to-br from-indigo-100 to-sky-100 lg:absolute lg:inset-0 lg:-z-10" />
          </div>

          {/* Small stats row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 lg:justify-start">
            <Stat icon="📍" label="500+ Locations" />
            <Stat icon="⭐" label="4.8/5 Rating" />
            <Stat icon="⛺" label="50k+ Campers" />
          </div>
        </section>

        {/* Right / Auth Card */}
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border bg-white p-6 shadow-xl ring-1 ring-black/5">
            <h2 className="mb-1 text-center text-2xl font-semibold">Sign In</h2>
            <p className="mb-6 text-center text-sm text-slate-500">
              Access your camping reservations
            </p>

            <form action={signIn} className="space-y-4">
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
                    placeholder="Enter your email"
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
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-slate-300 px-10 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-indigo-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span>Sign In</span>
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <span>🟢</span> Google
              </button>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                <span>📘</span> Facebook
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <a href="/signup" className="text-indigo-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

/* small stat pill */
function Stat({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
