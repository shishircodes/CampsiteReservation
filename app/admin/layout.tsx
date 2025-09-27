// app/admin/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";

import AdminNavLink from "@/components/AdminNavLink";

export const metadata: Metadata = {
  title: "Admin - Campsite Reservation",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 md:grid md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r bg-white md:sticky md:top-0 md:h-screen">
        <div className="px-5 py-4 border-b">
          <Link href="/admin" className="block text-lg font-semibold">
            Admin Dashboard
          </Link>
          <p className="mt-1 text-xs text-slate-500">Manage your campsite platform</p>
        </div>

        <nav className="p-3 space-y-1">
          <AdminNavLink href="/admin">Overview</AdminNavLink>
          <AdminNavLink href="/admin/campsites">Manage Campsites</AdminNavLink>
          <AdminNavLink href="/admin/bookings">Manage Bookings</AdminNavLink>
          {/* Add more sections later, e.g. Users, Reports, Settings */}
        </nav>

        <div className="mt-auto p-3 text-xs text-slate-500 hidden md:block">
          <p className="px-2">© {new Date().getFullYear()} Campsite Reservation</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-h-screen">
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </main>
    </div>
  );
}
