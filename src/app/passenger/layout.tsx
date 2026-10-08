import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function PassengerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-on-surface-variant font-medium">
          Loading Papido…
        </div>
      }
    >
      <PassengerLayoutContent>{children}</PassengerLayoutContent>
    </Suspense>
  );
}

async function PassengerLayoutContent({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return <>{children}</>;
}
