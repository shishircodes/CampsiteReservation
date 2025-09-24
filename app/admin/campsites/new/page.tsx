import Link from "next/link";
import AddNewCampsite from "@/components/AddCampSiteForm";

export default function NewCampsitePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add New Campsite</h1>
          <p className="text-sm text-gray-500">
            Create a new campsite listing with all necessary details
          </p>
        </div>
        <Link
          href="/admin/campsites"
          className="rounded-lg border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          ← Back to Campsites
        </Link>
      </div>

      <AddNewCampsite />
    </main>
  );
}
