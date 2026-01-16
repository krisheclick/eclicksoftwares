"use client";

import { usePathname } from "next/navigation";

export default function useCurrentUrl() {
  const pathname = usePathname();
  const fullUrl = `${process.env.NEXT_PUBLIC_ENV_URL || "https://eclicksoftwares.com"}${pathname}`;

  return { pathname, fullUrl };
}
