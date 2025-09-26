import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CampsiteGridProps = {
  /** Max number of campsites to render (default 6) */
  limit?: number;
  /** Optional heading shown above the grid */
  title?: string;
  /** Optional description below the title */
  subtitle?: string;
  /** Optional className wrapper */
  className?: string;
};

export default async function CampsiteGrid({
  limit = 6,
  title,
  subtitle,
  className = "",
}: CampsiteGridProps) {
  const supabase = await createSupabaseServerClient();

  const { data: campsites, error } = await supabase
    .from("campsites")
    .select("id, name, description, base_price_cents, is_active, campsite_photos(url)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(Math.max(1, limit));

  if (error) {
    return (
      <section className={className}>
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
        <p className="mt-6 text-sm text-red-600">Failed to load campsites: {error.message}</p>
      </section>
    );
  }

  if (!campsites?.length) {
    return (
      <section className={className}>
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
        <p className="mt-6 text-sm text-slate-500">No campsites available yet.</p>
      </section>
    );
  }

  const money = (cents?: number | null) =>
    typeof cents === "number" ? `$${(cents / 100).toFixed(0)}/night` : "$—/night";

  const firstPhoto = (site: any) =>
    site?.campsite_photos?.[0]?.url ?? `https://placehold.co/600x400?text=${encodeURIComponent(site.name)}`; // add your placeholder

  return (
    <section className={className}>
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {campsites.map((site) => (
          <article
            key={site.id}
            className="overflow-hidden rounded-xl border shadow transition hover:shadow-lg text-left bg-white"
          >
            <Link href={`/campsites/${site.id}`}>
              <img
                src={firstPhoto(site)}
                alt={site.name}
                className="h-48 w-full object-cover"
              />
            </Link>

            <div className="p-5">
              <Link href={`/campsites/${site.id}`} className="block">
                <h3 className="font-semibold text-lg">{site.name}</h3>
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{site.description}</p>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-indigo-600">{money(site.base_price_cents)}</span>
                <Link
                  href={`/campsites/${site.id}`}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
