// app/campsites/page.tsx
import CampsiteGrid from "@/components/CampsiteGrid";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CampsitesPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q?.trim().toLowerCase() || "";
  const supabase = await createSupabaseServerClient();

  // Fetch campsites
  let dbQuery = supabase
    .from("campsites")
    .select("id, name, description, base_price_cents, is_active, campsite_photos(url), location")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (query) {
    // Match name or location (you can add description too if needed)
    dbQuery = dbQuery.or(`name.ilike.%${query}%,location.ilike.%${query}%`);
  }

  const { data: campsites, error } = await dbQuery;

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-red-600">Error loading campsites: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">
        {query ? `Search Results for “${query}”` : "All Campsites"}
      </h1>

      <CampsiteGrid
        limit={9999} // show all matching campsites
        title={undefined}
        subtitle={undefined}
        className="pt-0"
        initialData={campsites}
      />
    </main>
  );
}
