// app/campsites/page.tsx
import CampsiteGrid from "@/components/CampsiteGrid";

export const metadata = { title: "Browse Campsites" };

export default function CampsitesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900">All Campsites</h1>
        <p className="mt-2 text-slate-600">
          Browse all available campsites and pick your next adventure.
        </p>
      </div>

      {/* CampsiteGrid handles fetching + rendering */}
      <CampsiteGrid
        limit={1000} // big number so effectively shows all
        title=""
        subtitle=""
        className="text-left"
      />
    </main>
  );
}
