export const dynamic = "force-dynamic"; // avoid stale cache for SSR
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import AddCampSiteForm from "@/components/AddCampSiteForm";

export default async function EditCampsitePage({ params }: { params: Promise<{ id: string }> }) {
  
  const supabase = await createSupabaseServerClient()

  const { id } = await params;
 

  // Fetch campsite (no nesting to keep it bulletproof)
  const { data: campsite, error } = await supabase
    .from("campsites")
    .select("id, name, description, base_price_cents, max_occupants, has_power, has_water, is_active")
    .eq("id", id)
    .maybeSingle();

  if (!campsite) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-red-600">Campsite not found.</p>
          {error?.message && <p className="text-sm text-gray-500">{error.message}</p>}
          <Link href="/admin/campsites" className="mt-4 inline-block rounded-lg border px-3 py-2 text-sm">
            ← Back
          </Link>
        </div>
      </main>
    );
  }

  // Fetch photos separately (works even if relation nesting fails)
  const { data: photos } = await supabase
    .from("campsite_photos")
    .select("id, url")
    .eq("campsite_id", id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Edit: {campsite.name}</h1>
          <p className="text-sm text-gray-500">Update details, photos, and availability.</p>
        </div>
        <Link href="/admin/campsites" className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
          ← Back to Campsites
        </Link>
      </div>

      <AddCampSiteForm campsite={{ ...campsite, campsite_photos: photos ?? [] }} />

    </main>
  );
}
