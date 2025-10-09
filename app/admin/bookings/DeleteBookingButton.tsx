// app/admin/bookings/DeleteBookingButton.tsx
"use client";

import { useTransition } from "react";
import { deleteBooking } from "@/app/actions/booking";

export default function DeleteBookingButton({
  id,
  label = "Delete",
}: {
  id: string;
  label?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    startTransition(async () => {
      try {
        await deleteBooking(id);
      } catch (e) {
        alert((e as Error).message || "Failed to delete booking.");
      }
    });
  };

  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className="rounded-md border border-red-300 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
    >
      {isPending ? "Deleting…" : label}
    </button>
  );
}
