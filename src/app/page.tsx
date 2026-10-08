import Link from "next/link";
import { MapPin, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-600">
          Papido
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Bike rides, exactly when you need them.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Book a nearby rider in seconds. Transparent fares, live tracking, and
          cashless or cash payments.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/register/passenger"
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Ride with Papido
          </Link>
          <Link
            href="/register/rider"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-100"
          >
            Become a Rider
          </Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 md:grid-cols-3">
        {[
          { icon: Zap, title: "Fast pickup", body: "Average rider arrival in under 5 minutes." },
          { icon: MapPin, title: "Live tracking", body: "Follow your rider in real time on the map." },
          { icon: Shield, title: "Safe by design", body: "Verified riders, PIN start, and emergency tools." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-white p-6">
            <Icon className="mb-3 h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
