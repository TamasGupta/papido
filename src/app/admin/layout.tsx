import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "speed" },
  { label: "Live Ops & Dispatch", href: "/admin/live", icon: "radar" },
  { label: "Trips & Live Rides", href: "/admin/rides", icon: "route" },
  { label: "Passengers", href: "/admin/passengers", icon: "group" },
  { label: "Fleet & Rider Partners", href: "/admin/riders", icon: "badge" },
  { label: "Verification", href: "/admin/verification", icon: "verified_user" },
  { label: "Payments", href: "/admin/payments", icon: "payments" },
  { label: "Payouts", href: "/admin/payouts", icon: "account_balance" },
  { label: "Coupons", href: "/admin/coupons", icon: "local_offer" },
  { label: "Disputes", href: "/admin/disputes", icon: "gavel" },
  { label: "Surge & Fare Engine", href: "/admin/fare", icon: "trending_up" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center p-6 text-on-surface-variant font-medium">
          Loading command center…
        </div>
      }
    >
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}

async function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface flex">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-primary-container border-r border-outline/20 z-50 flex flex-col justify-between hidden lg:flex">
        <div className="flex flex-col">
          {/* Logo Strip */}
          <div className="px-4 py-4 border-b border-outline/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-surface-container-lowest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[22px]">two_wheeler</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[18px] font-bold text-surface-container-lowest tracking-tight">PAPIDO</span>
                  <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary text-[11px] font-bold uppercase">Ops</span>
                </div>
                <div className="text-[11px] font-semibold text-on-primary-container tracking-wider uppercase">Ops Command BLR</div>
              </div>
            </div>
          </div>

          {/* Active Jurisdiction */}
          <div className="px-3 py-2 border-b border-outline/20 bg-primary-container">
            <button className="w-full flex items-center justify-between px-3 py-2 rounded bg-inverse-surface border border-outline/30 text-surface-container-lowest hover:bg-inverse-surface/80 transition-colors" type="button">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-surface-container-lowest">location_city</span>
                <div className="text-left">
                  <div className="text-[11px] text-on-primary-container font-semibold">Active Jurisdiction</div>
                  <div className="text-[13px] text-surface-container-lowest font-medium truncate max-w-[140px]">BLR South &amp; East</div>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-on-primary-container">unfold_more</span>
            </button>
          </div>

          {/* Live Telemetry Status */}
          <div className="px-4 py-2 border-b border-outline/20">
            <div className="flex items-center justify-between px-1 py-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
                <span className="text-[11px] font-semibold text-surface-container-lowest">Live Telemetry</span>
              </div>
              <span className="text-[11px] font-semibold text-on-primary-container">99.98% SLA</span>
            </div>
          </div>

          {/* Nav Items */}
          <div className="px-3 pt-3">
            <div className="px-2 pb-1 text-[11px] font-semibold text-on-primary-container uppercase tracking-wider">Operational Modules</div>
            <nav className="flex flex-col gap-0.5">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded text-on-primary-container hover:bg-inverse-surface hover:text-surface-container-lowest transition-all group text-[14px]"
                >
                  <span className="material-symbols-outlined text-[20px] text-on-primary-container group-hover:text-surface-container-lowest transition-colors">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Admin User Footer */}
        <div className="p-3 border-t border-outline/20">
          <div className="flex items-center justify-between p-2 rounded bg-inverse-surface border border-outline/30">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-surface-container-lowest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">admin_panel_settings</span>
              </div>
              <div className="text-left">
                <div className="text-[13px] text-surface-container-lowest font-medium leading-none">Ops Director</div>
                <div className="text-[11px] text-on-primary-container mt-0.5">bengaluru-hq@papido.in</div>
              </div>
            </div>
            <a href="/api/auth/signout" className="text-on-primary-container hover:text-surface-container-lowest transition-colors">
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full">
        {/* Top Operational Header */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-surface-container-lowest border-b border-outline/20 z-40 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
              <input
                className="w-full pl-9 pr-3 py-1.5 bg-surface border border-outline/30 rounded text-[13px] text-on-surface placeholder-outline focus:outline-none focus:border-primary transition-all"
                placeholder="Search Rider ID, Trip ID, KA-01-XX-0000..."
                type="text"
              />
            </div>
            <div className="hidden xl:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-error-container/30 border border-error/40 text-on-error-container text-[12px] font-semibold">
                <span className="material-symbols-outlined text-error text-[16px]">fmd_bad</span>
                <span>2 Active SOS</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-low border border-outline/30 text-secondary text-[12px] font-semibold">
                <span className="material-symbols-outlined text-secondary text-[16px]">pending_actions</span>
                <span>42 KYC Pending</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right pr-3 border-r border-outline/20">
              <div className="text-[11px] font-semibold text-on-surface">14:24:08 IST</div>
              <div className="text-[11px] text-on-surface-variant">08:54:08 UTC</div>
            </div>
            <button className="w-9 h-9 rounded border border-outline/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors" type="button">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="w-9 h-9 rounded border border-outline/30 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors" type="button">
              <span className="material-symbols-outlined text-[20px]">refresh</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </header>

        {/* Page Inner Content */}
        <div className="pt-16 min-h-screen bg-surface">
          {children}
        </div>
      </div>
    </div>
  );
}
