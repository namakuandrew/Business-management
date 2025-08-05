"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DashboardFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
}
