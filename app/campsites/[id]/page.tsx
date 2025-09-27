// app/campsites/[id]/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// ✅ availability helper
async function hasAvailability(
  supabase: any,
  campsiteId: string,
  checkIn: string,
  checkOut: string,
  capacity: number
): Promise<{ ok: boolean; soldOutDates: string[] }> {
  const soldOutDates: string[] = [];
  let cur = new Date(checkIn);
  const end = new Date(checkOut);

  while (cur < end) {
    const dateStr = cur.toISOString().slice(0, 10);

    const { count } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("campsite_id", campsiteId)
      .in("status", ["pending", "confirmed"])
      .lte("check_in", dateStr)
      .gt("check_out", dateStr);

    if ((count ?? 0) >= capacity) {
      soldOutDates.push(dateStr);
    }
    cur.setDate(cur.getDate() + 1);
  }

  return { ok: soldOutDates.length === 0, soldOutDates };
}

export default async function CampsitePage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const [{ id }, sp] = await Promise.all([props.params, props.searchParams]);
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campsite, error } = await supabase
    .from("campsites")
    .select(
      "id, name, description, base_price_cents, max_occupants, has_power, has_water, available_slots, campsite_photos(url)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !campsite) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">Campsite not found</h1>
          {error && <p className="mt-2 text-sm text-slate-500">{error.message}</p>}
          <Link
            href="/campsites"
            className="mt-6 inline-block rounded-md bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-500"
          >
            ← Back to Campsites
          </Link>
        </div>
      </main>
    );
  }

  const getSP = (k: string) => {
    const v = sp?.[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const success = getSP("success") === "1";
  const err = getSP("error") ?? "";

  const money = (cents?: number | null) =>
    typeof cents === "number" ? `$${(cents / 100).toFixed(0)}/night` : "$—/night";

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* LEFT: Details */}
        <section>
          <div className="overflow-hidden rounded-xl shadow-md">
            <img
              src={
                campsite.campsite_photos?.[0]?.url ??
                `https://placehold.co/800x500?text=${encodeURIComponent(campsite.name)}`
              }
              alt={campsite.name}
              className="h-72 w-full object-cover"
            />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">{campsite.name}</h1>
          <p className="mt-3 text-slate-600 leading-relaxed">{campsite.description}</p>

          <div className="mt-6 flex items-center gap-6 text-slate-700">
            <span className="text-lg font-semibold text-indigo-600">
              {money(campsite.base_price_cents)}
            </span>
            <span>👥 Max {campsite.max_occupants} occupants</span>
            <span>🎟 {campsite.available_slots} slots per night</span>
          </div>

          <ul className="mt-4 flex gap-6 text-slate-600 text-sm">
            <li>{campsite.has_power ? "⚡ Power available" : "⚡ No power"}</li>
            <li>{campsite.has_water ? "💧 Water available" : "💧 No water"}</li>
          </ul>
        </section>

        {/* RIGHT: Booking */}
        <section>
          {!user ? (
            <div className="rounded-xl border bg-white p-8 shadow-sm text-center">
              <h2 className="text-xl font-semibold">Want to book?</h2>
              <p className="mt-2 text-slate-600">Log in to make a reservation for this campsite.</p>
              <Link
                href="/login"
                className="mt-6 inline-block rounded-md bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-500"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold">Book this campsite</h2>
              <p className="mt-1 text-sm text-slate-500">
                Select your dates and confirm instantly.
              </p>

              {success && (
                <p className="mt-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-700">
                  ✅ Booking confirmed!
                </p>
              )}
              {err && (
                <p className="mt-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
                  ❌ {err}
                </p>
              )}

              <form
                action={async (formData: FormData) => {
                  "use server";
                  const supabase = await createSupabaseServerClient();

                  const checkIn = String(formData.get("check_in"));
                  const checkOut = String(formData.get("check_out"));
                  const occupants = Number(formData.get("occupants") ?? 1);
                  const vehicles = Number(formData.get("vehicles") ?? 1);

                  const capacity = campsite.available_slots ?? 1;
                  const { ok, soldOutDates } = await hasAvailability(
                    supabase,
                    campsite.id,
                    checkIn,
                    checkOut,
                    capacity
                  );

                  if (!ok) {
                    redirect(
                      `/campsites/${campsite.id}?error=${encodeURIComponent(
                        `No availability on: ${soldOutDates.join(", ")}`
                      )}`
                    );
                  }

                  const total_price_cents =
                    (campsite.base_price_cents ?? 0) *
                    Math.max(
                      1,
                      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                  const { error: insertErr } = await supabase.from("bookings").insert({
                    campsite_id: campsite.id,
                    check_in: checkIn,
                    check_out: checkOut,
                    occupants,
                    vehicles,
                    total_price_cents,
                    status: "confirmed",
                  });

                  if (insertErr) {
                    redirect(
                      `/campsites/${campsite.id}?error=${encodeURIComponent(insertErr.message)}`
                    );
                  }

                  redirect(`/campsites/${campsite.id}?success=1`);
                }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700">Check-in</label>
                  <input
                    type="date"
                    name="check_in"
                    required
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Check-out</label>
                  <input
                    type="date"
                    name="check_out"
                    required
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Occupants</label>
                    <input
                      type="number"
                      name="occupants"
                      min="1"
                      defaultValue="1"
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Vehicles</label>
                    <input
                      type="number"
                      name="vehicles"
                      min="1"
                      defaultValue="1"
                      className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
