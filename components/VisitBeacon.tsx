"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Tells the site a page was opened, for the admins' visit count. */
export default function VisitBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    const body = JSON.stringify({ path: pathname });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/visit", body);
    else fetch("/api/visit", { method: "POST", body, keepalive: true }).catch(() => {});
  }, [pathname]);
  return null;
}
