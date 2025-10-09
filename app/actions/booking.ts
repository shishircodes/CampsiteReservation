// app/actions/bookings.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function deleteBooking(id: string) {
  const supabase = await createSupabaseServerClient();

  // RLS already restricts who can delete. This will succeed only for staff/admin.
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    // Surface a friendly error to the UI if you like
    throw new Error(error.message);
  }

  // Refresh the admin bookings table
  revalidatePath("/admin/bookings");
}
