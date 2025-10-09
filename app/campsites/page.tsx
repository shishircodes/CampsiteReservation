// app/campsites/page.tsx
import CampsiteGrid from "@/components/CampsiteGrid";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SearchObj = Record<string, string | string[] | undefined>;

export default async function CampsitesPage({
  searchParams,
}: {
  // On Vercel, searchParams is a Promise (dynamic APIs as Promises)
  searchParams: Promise<SearchObj>;
}) {
  const sp = await searchParams;
  const rawQ = sp?.q;
  const q = Array.isArray(rawQ) ? rawQ[0] : rawQ || "";
  const query = q.trim().toLowerCase();

  const supabase = await createSupabaseServerClient();

  // Base query
  let db = supabase
    .from("campsites")
    .select(
      "id, name, description, base_price_cents, is_active, campsite_photos(url)"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Filter by name/description (add `location` here too if you have that column)
  if (query) {
    db = db.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    // If you added a `location` column:
    // db = db.or(`name.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`);
  }

  const { data, error } = await db;

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-2xl font-semibold mb-6">All Campsites</h1>
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
        limit={9999}
        className="pt-0"
        initialData={data ?? []}
      />
    </main>
  );
}
