/**
 * Check availability for each night in the requested range
 */
async function hasAvailability(
  supabase: any,
  campsiteId: string,
  checkIn: string,
  checkOut: string,
  capacity: number
): Promise<{ ok: boolean; soldOutDates: string[] }> {
  const soldOutDates: string[] = [];

  // Loop through each date in the requested range
  let cur = new Date(checkIn);
  const end = new Date(checkOut);

  while (cur < end) {
    const dateStr = cur.toISOString().slice(0, 10);

    const { count, error } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("campsite_id", campsiteId)
      .in("status", ["pending", "confirmed"])
      .lte("check_in", dateStr)
      .gt("check_out", dateStr);

    if (error) throw error;

    if ((count ?? 0) >= capacity) {
      soldOutDates.push(dateStr);
    }

    // advance one day
    cur.setDate(cur.getDate() + 1);
  }

  return {
    ok: soldOutDates.length === 0,
    soldOutDates,
  };
}
