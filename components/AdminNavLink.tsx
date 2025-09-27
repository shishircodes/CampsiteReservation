// app/admin/nav-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import clsx from "clsx";

export default function AdminNavLink({
  href,
  children,
}: PropsWithChildren<{ href: string }>) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (href !== "/admin" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={clsx(
        "block rounded-md px-3 py-2 text-sm",
        isActive
          ? "bg-indigo-50 text-indigo-700 font-medium"
          : "text-slate-700 hover:bg-slate-100"
      )}
    >
      {children}
    </Link>
  );
}
