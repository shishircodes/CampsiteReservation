// app/admin/bookings/page.tsx
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DeleteBookingButton from "./DeleteBookingButton";

export const dynamic = "force-dynamic";

type BookingRow = {
  id: string;
  user_id: string;
  campsite_id: string;        // 👈 select this explicitly
  check_in: string;
  check_out: string;
  status: string;
  occupants: number;
  vehicles: number;
  total_price_cents: number | null;
  created_at: string;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type CampsiteRow = {
  id: string;
  name: string;
};

export default async function AdminBookingsPage() {
  const supabase = await createSupabaseServerClient();

  // 1) Bookings (no nested join)
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select(`
      id,
      user_id,
      campsite_id,
      check_in,
      check_out,
      status,
      occupants,
      vehicles,
      total_price_cents,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        Failed to load bookings: {error.message}
      </div>
    );
  }

  if (!bookings?.length) {
    return (
      <div>
        <Header />
        <div className="rounded-md border bg-white p-6 text-center text-slate-600">
          No bookings found.
        </div>
      </div>
    );
  }

  // 2) Profiles (manual join)
  const userIds = Array.from(new Set(bookings.map((b) => b.user_id)));
  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  const profileMap = new Map<string, ProfileRow>((profiles ?? []).map((p) => [p.id, p]));

  // 3) Campsites (manual join) 👇
  const campsiteIds = Array.from(new Set(bookings.map((b) => b.campsite_id)));
  const { data: campsites, error: cErr } = await supabase
    .from("campsites")
    .select("id, name")
    .in("id", campsiteIds);

  const campsiteMap = new Map<string, CampsiteRow>((campsites ?? []).map((c) => [c.id, c]));

  return (
    <div>
      <Header />

      {(pErr || cErr) && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800">
          {pErr ? <>Profiles load warning: {pErr.message}. </> : null}
          {cErr ? <>Campsites load warning: {cErr.message}.</> : null}
        </div>
      )}

      <div className="overflow-auto rounded-xl border bg-white">
        <table className="min-w-[960px] w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <Th>Created</Th>
              <Th>Campsite</Th>
              <Th>User</Th>
              <Th>Dates</Th>
              <Th>Guests</Th>
              <Th>Vehicles</Th>
              <Th>Status</Th>
              <Th>Total</Th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b: BookingRow) => {
              const user = profileMap.get(b.user_id);
              const site = campsiteMap.get(b.campsite_id);

              return (
                <tr key={b.id} className="border-t last:border-b">
                  <Td>{new Date(b.created_at).toLocaleString()}</Td>

                  <Td>
                    {site ? (
                      <Link
                        href={`/campsites/${site.id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {site.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </Td>

                  <Td>
                    <div className="flex flex-col">
                      <span>{user?.full_name ?? b.user_id}</span>
                      {user?.email ? (
                        <span className="text-xs text-slate-500">{user.email}</span>
                      ) : null}
                    </div>
                  </Td>

                  <Td>
                    {b.check_in} → {b.check_out}
                  </Td>

                  <Td>{b.occupants}</Td>
                  <Td>{b.vehicles}</Td>

                  <Td>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize">
                      {b.status}
                    </span>
                  </Td>

                  <Td>{formatMoney(b.total_price_cents)}</Td>
                  <Td>
  <DeleteBookingButton id={b.id} />
</Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">All Bookings</h1>
        <p className="text-sm text-slate-500">Review and manage every booking made by users.</p>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left font-medium first:pl-5 last:pr-5">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 first:pl-5 last:pr-5 align-top">{children}</td>;
}
function formatMoney(cents: number | null | undefined) {
  if (typeof cents !== "number") return "—";
  return `$${(cents / 100).toFixed(0)}`;
}
