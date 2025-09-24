import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CampsitesAdminPage() {
  const cookieStore = await cookies();
 
  const supabase = await createSupabaseServerClient()

  const { data: campsites } = await supabase
  .from("campsites")
  .select("*, campsite_photos(url)")
  .order("created_at", { ascending: false });

  return (
    <main className="p-6">
      {/* Header with Add button */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Camp Sites Management</h1>
        <Link
          href="/admin/campsites/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          + Add Campsite
        </Link>
      </div>

      {/* Campsite cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {campsites?.map((site) => (
    <div
      key={site.id}
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
    >
      <img
        src={
          site.campsite_photos?.[0]?.url ||
          `https://placehold.co/600x400?text=${encodeURIComponent(site.name)}`
        }
        alt={site.name}
        className="h-40 w-full object-cover"
      />
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">{site.name}</h2>
          {site.is_active ? (
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
              Active
            </span>
          ) : (
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
              Inactive
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-gray-600">
          {site.description}
        </p>
        <div className="text-sm text-gray-500">
          Max {site.max_occupants} guests
        </div>
        <div className="font-medium">
          ${site.base_price_cents / 100}/night
        </div>
        <Link
  href={`/admin/campsites/${site.id}/edit`}
  className="mt-2 block w-full rounded-lg bg-indigo-600 py-2 text-center text-sm text-white"
>
  Edit
</Link>
      </div>
    </div>
  ))}
</div>

    </main>
  );
}
