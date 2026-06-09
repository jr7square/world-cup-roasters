"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Rosters" },
  { href: "/matches", label: "Matches" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="px-6 pt-8 pb-6 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-1 h-10 rounded-full bg-ef-green mt-0.5 shrink-0" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ef-fg">
              World Cup Roster Visualizer
            </h1>
            <p className="text-ef-dim text-sm mt-1">
              Compare national team squads across 1994 – 2026 FIFA World Cups
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-ef-bg2 text-ef-fg font-medium"
                    : "text-ef-dim hover:text-ef-fg hover:bg-ef-bg1"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
