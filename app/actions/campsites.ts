"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type CampsiteFormState = { ok: boolean; error?: string | null };


/**
 * Upsert action:
 * - If `id` is present → UPDATE + (optional) upload new images.
 * - If no `id` → CREATE + upload images.
 */
export async function createCampsiteAction(
  _prev: CampsiteFormState,
  formData: FormData
): Promise<CampsiteFormState> {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in." };

  // shared fields
  const id = String(formData.get("id") || "");               // <-- hidden when editing
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const nightly_rate = Number(formData.get("nightly_rate") || 0);
  const available_slots = Number(formData.get("available_slots") ?? "1");
  const max_occupants = Number(formData.get("max_occupants") || 4);
  const has_power = formData.get("has_power") === "on";
  const has_water = formData.get("has_water") === "on";
  const images = formData.getAll("images") as File[];

  if (!name) return { ok: false, error: "Campsite name is required." };

  let campsiteId = id || "";

  if (id) {
    // ----- UPDATE -----
    const { error: updErr } = await supabase
      .from("campsites")
      .update({
        name,
        description,
        base_price_cents: Math.round(nightly_rate * 100),
        available_slots,
        max_occupants,
        has_power,
        has_water,
        is_active: true,
      })
      .eq("id", id);

    if (updErr) return { ok: false, error: updErr.message };
    campsiteId = id;
  } else {
    // ----- CREATE -----
    const { data: created, error: insErr } = await supabase
      .from("campsites")
      .insert({
        name,
        description,
        base_price_cents: Math.round(nightly_rate * 100),
        available_slots,
        max_occupants,
        has_power,
        has_water,
        is_active: true,
      })
      .select("id")
      .single();

    if (insErr || !created) {
      return { ok: false, error: insErr?.message || "Failed to create campsite." };
    }
    campsiteId = created.id;
  }

  // ----- OPTIONAL: upload any newly selected images -----
  for (const file of images) {
    if (!(file instanceof File)) continue;
    const ext = file.name?.split(".").pop() || "jpg";
    const path = `${campsiteId}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("campsite-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg",
      });

    if (upErr) {
      // If a single file fails, skip it but continue others
      console.error("Upload error:", upErr.message);
      continue;
    }

    const { data: pub } = supabase.storage.from("campsite-images").getPublicUrl(path);
    if (pub?.publicUrl) {
      const { error: dbErr } = await supabase
        .from("campsite_photos")
        .insert({ campsite_id: campsiteId, url: pub.publicUrl });
      if (dbErr) {
        console.error("DB insert error:", dbErr.message);
      }
    }
  }

  // After create/update, go back to the list
  redirect("/admin/campsites");
}
