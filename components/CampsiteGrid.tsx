import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CampsiteGridProps = {
  /** Max number of campsites to render (default 6) */
  limit?: number;
  /** Optional heading shown above the grid */
  title?: string;
  /** Optional description below the title */
  subtitle?: string;
  /** Optional wrapper className */
  className?: string;
  /** Optional prefetched data (for search pages) */
  initialData?: any[];
};

export default async function CampsiteGrid({
  limit = 6,
  title,
  subtitle,
  className = "",
  initialData,
}: CampsiteGridProps) {
  const supabase = await createSupabaseServerClient();

  const { data: campsites, error } =
    initialData
      ? { data: initialData, error: null }
      : await supabase
          .from("campsites")
          .select(
            "id, name, description, base_price_cents, is_active, campsite_photos(url)"
          )
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(Math.max(1, limit));

  if (error) {
    return (
      <section className={className}>
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
        <p className="mt-6 text-sm text-red-600">
          Failed to load campsites: {error.message}
        </p>
      </section>
    );
  }

  if (!campsites?.length) {
    return (
      <section className={className}>
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
        <p className="mt-6 text-sm text-slate-500">
          No campsites available yet.
        </p>
      </section>
    );
  }

  const formatPrice = (cents?: number | null) =>
    typeof cents === "number" ? `$${(cents / 100).toFixed(0)}` : "$—";

  const getImage = (site: any) =>
    site?.campsite_photos?.[0]?.url ??
    `https://placehold.co/800x600?text=${encodeURIComponent(site.name)}`;

  return (
    <section className={className}>
      {title && (
        <div className="mb-2">
          <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase">
            Featured Campsites
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            {title}
          </h2>
        </div>
      )}
      {subtitle && <p className="text-slate-600">{subtitle}</p>}

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {campsites.map((site) => (
          <article
            key={site.id}
            className="group rounded-3xl bg-white border border-slate-200 p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-indigo-200"
          >
            <Link
              href={`/campsites/${site.id}`}
              className="block overflow-hidden rounded-2xl"
            >
              <img
                src={getImage(site)}
                alt={site.name}
                className="h-[240px] w-full object-cover rounded-2xl transition duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            <div className="px-2 pb-3 pt-4">
              <Link
                href={`/campsites/${site.id}`}
                className="block text-lg font-semibold leading-snug text-slate-900 hover:text-indigo-600"
              >
                {site.name}
              </Link>

              <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                {site.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-sm">
                {/* “Details” link */}
                <Link
                  href={`/campsites/${site.id}`}
                  className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M5 12l5-5 5 5" />
                  </svg>
                  <span>View details</span>
                </Link>

                {/* price display */}
                <span className="font-bold text-indigo-600">
                  {formatPrice(site.base_price_cents)}
                  <span className="ml-1 text-xs font-normal text-gray-500">
                    /night
                  </span>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
