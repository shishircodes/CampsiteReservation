// app/bookings/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Campsite = {
  id: string;
  name: string;
};

type Booking = {
  id: string;
  check_in: string;
  check_out: string;
  status: string;
  occupants: number;
  vehicles: number;
  total_price_cents: number | null;
  campsites: Campsite | null; // 👈 single object, not array
};

export default async function ManageBookingsPage() {
  const supabase = await createSupabaseServerClient();

  // get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <p className="mt-4 text-slate-600">Please log in to view your bookings.</p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-500"
        >
          Sign In
        </Link>
      </main>
    );
  }

  // fetch bookings for current user
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      check_in,
      check_out,
      status,
      occupants,
      vehicles,
      total_price_cents,
      campsites (id, name)
    `
    )
    .eq("user_id", user.id)
    .order("check_in", { ascending: false })
    .returns<Booking[]>(); // 👈 cast response properly

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <p className="mt-4 text-red-600">Failed to load bookings: {error.message}</p>
      </main>
    );
  }

  if (!bookings?.length) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <p className="mt-4 text-slate-600">You haven’t made any bookings yet.</p>
        <Link
          href="/campsites"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-500"
        >
          Browse Campsites
        </Link>
      </main>
    );
  }

  const money = (cents?: number | null) =>
    typeof cents === "number" ? `$${(cents / 100).toFixed(0)}` : "—";

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">Your Bookings</h1>

      <ul className="space-y-4">
        {bookings.map((b) => (
          <li key={b.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">
                  {b.campsites?.name ?? "Unknown Campsite"}
                </h2>
                <p className="text-sm text-slate-500">
                  {b.check_in} → {b.check_out} ({b.occupants} people, {b.vehicles} vehicles)
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-medium">Status:</span> {b.status}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-indigo-600">{money(b.total_price_cents)}</p>
                <form
                  action={async () => {
                    "use server";
                    const supabase = await createSupabaseServerClient();
                    await supabase.from("bookings").delete().eq("id", b.id);
                  }}
                >
                  <button
                    type="submit"
                    className="mt-2 rounded-md border border-red-500 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
