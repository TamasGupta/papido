"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Polls the server every 5s so the admin live view reflects fresh rider
// locations without a manual reload.
export default function LiveRefresher() {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(t);
  }, [router]);
  return null;
}
