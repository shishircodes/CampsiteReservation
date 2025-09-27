"use client";

import { useState, useCallback, useActionState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createCampsiteAction, type CampsiteFormState } from "@/app/actions/campsites";

type LocalFile = { file: File; preview: string };
type Photo = { id: string; url: string };
type CampsiteForForm = {
  id?: string;
  name?: string;
  description?: string | null;
  base_price_cents?: number | null;
  available_slots?: number | null;
  max_occupants?: number | null;
  has_power?: boolean | null;
  has_water?: boolean | null;
  campsite_photos?: Photo[];
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-2xl border bg-white p-5">
      <h2 className="mb-4 text-base font-semibold text-gray-800">{title}</h2>
      {children}
    </section>
  );
}

function SubmitBar({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="mt-8 flex justify-end">
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : label}
      </button>
    </div>
  );
}

/** Reusable form for both Create and Edit */
export default function AddCampSiteForm({ campsite }: { campsite?: CampsiteForForm}) {
  const isEdit = Boolean(campsite?.id);
  const [files, setFiles] = useState<LocalFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [state, formAction] = useActionState<CampsiteFormState, FormData>(
    createCampsiteAction,
    { ok: false, error: null }
  );

  const onFiles = useCallback((list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list);
    const tooMany = arr.length + files.length > 10;
    const tooBig = arr.some((f) => f.size > 5 * 1024 * 1024);
    if (tooMany) return setError("Maximum 10 images.");
    if (tooBig) return setError("Each file must be under 5MB.");
    const mapped = arr.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
    setFiles((prev) => [...prev, ...mapped]);
    setError(null);
  }, [files.length]);

  return (
    <form
      action={async (fd) => {
        if (isEdit && campsite?.id) {
            fd.append("id", campsite.id)
        }; // <-- key for update
        
        files.forEach((lf) => fd.append("images", lf.file));   // optional new images
        await formAction(fd);
      }}
    >
      <Section title="Basic Information">
        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Campsite Name</label>
            <input
              name="name"
              defaultValue={campsite?.name ?? ""}
              required
              placeholder="Enter campsite name"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={campsite?.description ?? ""}
              placeholder="Describe the campsite…"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </Section>

      <Section title="Images">
        {/* Upload input */}
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
          <div className="mb-3 text-sm font-medium">Upload Images</div>
          <label className="inline-block cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
            Choose Files
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
          </label>
          <p className="mt-3 text-xs text-gray-400">Max 10 files, 5MB each</p>
        </div>

        {/* Existing images from DB */}
        {campsite?.campsite_photos?.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {campsite.campsite_photos.map((p) => (
              <div key={p.id} className="relative overflow-hidden rounded-xl border">
                <img src={p.url} className="h-28 w-full object-cover" alt="" />
                {/* Optional delete button */}
                {/* <button …>Delete</button> */}
              </div>
            ))}
          </div>
        ) : null}

        {/* New files selected locally */}
        {!!files.length && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {files.map((f, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl border">
                <img src={f.preview} className="h-28 w-full object-cover" alt="" />
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, x) => x !== i))}
                  className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </Section>

      <Section title="Pricing & Capacity">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Nightly Rate ($)</label>
            <input
              name="nightly_rate"
              type="number"
              step="0.01"
              defaultValue={campsite ? (campsite.base_price_cents || 0) / 100 : ""}
              placeholder="0.00"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
  <label className="mb-1 block text-sm font-medium text-slate-700">
    Available Slots (per night)
  </label>
  <input
    type="number"
    name="available_slots"
    min={1}
    defaultValue={campsite?.available_slots ?? "Not found"}
    required
    className="w-full rounded-lg border px-3 py-2 text-sm outline-none 
               focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
  />
  <p className="mt-1 text-xs text-slate-500">
    How many bookings are allowed per day for this campsite.
  </p>
</div>

          <div>
            <label className="mb-1 block text-sm font-medium">Max Occupancy (per slot)</label>
            <input
              name="max_occupants"
              type="number"
              min={1}
              defaultValue={campsite?.max_occupants ?? 4}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="has_power" defaultChecked={!!campsite?.has_power} /> Power
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="has_water" defaultChecked={!!campsite?.has_water} /> Water
          </label>
        </div>
      </Section>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitBar label={isEdit ? "Save Changes" : "Save Campsite"} />
    </form>
  );
}
