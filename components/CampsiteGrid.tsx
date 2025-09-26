import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CampsiteGridProps = {
  limit?: number;
  title?: string;
  subtitle?: string;
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

  const money = (cents?: number | null) =>
    typeof cents === "number"
      ? `$${(cents / 100).toFixed(0)}`
      : "$—";

  const thumb = (site: any) =>
    site?.campsite_photos?.[0]?.url ??
    `https://placehold.co/800x600?text=${encodeURIComponent(site.name)}`;

  return (
    <section className={className}>
      {title && (
        <div className="mb-2">
          <p className="text-xs font-semibold tracking-wider text-indigo-600">
            TOP SELLING
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
            className="group rounded-3xl bg-white p-3 transition hover:shadow-lg hover:ring-2 hover:ring-indigo-200"
          >
            <Link
              href={`/campsites/${site.id}`}
              className="block overflow-hidden rounded-2xl"
            >
              <img
                src={thumb(site)}
                alt={site.name}
                className="h-[260px] w-full rounded-2xl object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            <div className="px-2 pb-2 pt-4">
              <Link
                href={`/campsites/${site.id}`}
                className="block text-lg font-semibold leading-snug text-slate-900"
              >
                {site.name}
              </Link>

              {/* short description */}
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                {site.description}
              </p>

              {/* meta row */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  {/* “location-style” link — we don't have location field, so use Details */}
                  <Link
                    href={`/campsites/${site.id}`}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    <span>View details</span>
                  </Link>

                  {/* simple “rating-style” badge (no rating field, keep generic) */}
                  <span className="inline-flex items-center gap-1 text-amber-500">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      className="fill-current"
                    >
                      <path d="M10 15.27 4.82 18.3l1.64-5.64L1 8.63l5.9-.51L10 3l3.1 5.12 5.9.51-5.46 4.03 1.64 5.64Z" />
                    </svg>
                    <span className="text-xs text-slate-600">
                      Popular choice
                    </span>
                  </span>
                </div>

                {/* price */}
                <div className="text-right">
                  <span className="text-base font-bold text-indigo-600">
                    {money(site.base_price_cents)}<span className="text-xs font-normal text-gray-500">/night</span>
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
