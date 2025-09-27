// app/campsites/[id]/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }>; searchParams?: Promise<Record<string, string | string[]>> };

export default async function CampsitePage({ params, searchParams }: PageProps) {
  const supabase = await createSupabaseServerClient();

    const [{ id }, sp] = await Promise.all([params, searchParams]);

  // current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // campsite (+ photos + available_slots)
  const { data: campsite, error } = await supabase
    .from("campsites")
    .select(
      "id, name, description, base_price_cents, max_occupants, has_power, has_water, is_active, available_slots, campsite_photos(url)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !campsite) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-red-600">Campsite not found.</p>
        {error && <p className="text-sm text-slate-500">{error.message}</p>}
        <Link href="/campsites" className="mt-4 inline-block text-indigo-600 hover:underline">
          ← Back to all campsites
        </Link>
      </main>
    );
  }

  // --- Compute "slots left today" ---
  const today = new Date().toISOString().slice(0, 10);
  const { count: todaysCount } = await supabase
    .from("bookings")
    .select("*", { head: true, count: "exact" })
    .eq("campsite_id", campsite.id)
    .in("status", ["pending", "confirmed"])
    .lte("check_in", today)
    .gt("check_out", today);

  const dailyCapacity = Math.max(1, campsite.available_slots ?? 1);
  const slotsLeftToday = Math.max(0, dailyCapacity - (todaysCount ?? 0));

  const photos = campsite.campsite_photos ?? [];
  const money = (cents?: number | null) =>
    typeof cents === "number" ? `$${(cents / 100).toFixed(0)}` : "$—";

  const success = sp?.success === "1";
  const err = typeof sp?.error === "string" ? sp?.error : "";

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-6">
        <Link href="/campsites" className="text-sm text-slate-600 hover:text-slate-900">
          ← Back to Campsites
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left: gallery + description */}
        <div>
          {photos.length > 0 ? (
            <img
              src={photos[0].url}
              alt={campsite.name}
              className="h-80 w-full rounded-xl object-cover shadow"
            />
          ) : (
            <div className="flex h-80 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              No photo available
            </div>
          )}

          <section className="mt-8">
            <h1 className="text-3xl font-bold text-slate-900">{campsite.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                👥 Max {campsite.max_occupants} guests
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                🔌 Power: {campsite.has_power ? "Yes" : "No"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                🚰 Water: {campsite.has_water ? "Yes" : "No"}
              </span>
            </div>

            <h2 className="mt-8 mb-2 text-xl font-semibold text-slate-900">About this campsite</h2>
            <p className="whitespace-pre-wrap text-slate-700">{campsite.description}</p>

            {/* Capacity summary */}
            <div className="mt-6 rounded-xl border bg-white p-4 text-sm text-slate-700">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-medium">Daily capacity:</span>{" "}
                  {dailyCapacity} slot{dailyCapacity > 1 ? "s" : ""}
                </div>
                <div>
                  <span className="font-medium">Slots left today:</span>{" "}
                  {slotsLeftToday}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right: booking panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {money(campsite.base_price_cents)}/night
                </div>
                <div className="text-xs text-slate-500">AUD · taxes may apply</div>
              </div>
            </div>

            {/* Messages */}
            {success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                Booking submitted! We’ll email you once it’s confirmed.
              </div>
            )}
            {err && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMessage(err)}
              </div>
            )}

            {!user ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Please sign in to proceed with booking.</p>
                <Link
                  href={`/login?redirect=/campsites/${campsite.id}`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Sign in to Book
                </Link>
              </div>
            ) : slotsLeftToday === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Fully booked for today. Choose different dates.
              </div>
            ) : (
              <form action={createBooking} className="space-y-4">
                <input type="hidden" name="campsite_id" value={campsite.id} />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Check-in
                    </label>
                    <input
                      name="check_in"
                      type="date"
                      required
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Check-out
                    </label>
                    <input
                      name="check_out"
                      type="date"
                      required
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Occupants
                    </label>
                    <input
                      name="occupants"
                      type="number"
                      min={1}
                      max={Math.max(1, campsite.max_occupants ?? 1)}
                      defaultValue={2}
                      required
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Vehicles
                    </label>
                    <input
                      name="vehicles"
                      type="number"
                      min={1}
                      defaultValue={1}
                      required
                      className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Anything we should know?"
                    className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Book Now
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

/* Friendly error text */
function errorMessage(code: string) {
  switch (code) {
    case "no_capacity":
      return "Selected dates are fully booked for this campsite.";
    case "overlap":
      return "Those dates are not available.";
    default:
      return "Something went wrong.";
  }
}

/* ------------ Server Action ------------ */
async function createBooking(formData: FormData) {
  "use server";
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const campsiteId = String(formData.get("campsite_id") ?? "");
  const checkInStr = String(formData.get("check_in") ?? "");
  const checkOutStr = String(formData.get("check_out") ?? "");
  const occupants = Number(formData.get("occupants") ?? "1");
  const vehicles = Number(formData.get("vehicles") ?? "1");
  const notes = (formData.get("notes") ?? "") as string;

  // Insert booking (DB trigger enforces capacity)
  const { error: insErr } = await supabase.from("bookings").insert({
    campsite_id: campsiteId,
    check_in: checkInStr,
    check_out: checkOutStr,
    occupants,
    vehicles,
    notes: notes || null,
  });

  if (insErr) {
    const msg = insErr.message?.toLowerCase() || "";
    if (msg.includes("capacity")) {
      redirect(`/campsites/${campsiteId}?error=no_capacity`);
    }
    if (msg.includes("overlap") || msg.includes("conflict")) {
      redirect(`/campsites/${campsiteId}?error=overlap`);
    }
    redirect(`/campsites/${campsiteId}?error=booking_failed`);
  }

  redirect(`/campsites/${campsiteId}?success=1`);
}
