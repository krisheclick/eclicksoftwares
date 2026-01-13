"use client";

import { usePathname } from "next/navigation";

export default function useCurrentUrl() {
  const pathname = usePathname();
  const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"}${pathname}`;

  return { pathname, fullUrl };
}
