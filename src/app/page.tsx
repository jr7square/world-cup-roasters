"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Header from "@/components/Header";
import CountrySelector from "@/components/CountrySelector";
import RosterTable from "@/components/RosterTable";
import ContinentChart from "@/components/ContinentChart";
import LeagueChart from "@/components/LeagueChart";
import PlayerOverlapTable from "@/components/PlayerOverlapTable";

import {
  data,
  getCountryRosters,
  getContinentDistribution,
  getLeagueDistribution,
  getPlayerOverlap,
} from "@/lib/data";

function AppContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selected, setSelected] = useState<string>(
    () => searchParams.get("country") ?? ""
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (selected) params.set("country", selected);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selected, router]);

  const rosters = selected ? getCountryRosters(selected) : {};
  const years = Object.keys(rosters).map(Number).sort();
  const continentData = selected ? getContinentDistribution(selected) : [];
  const { data: leagueData, leagues } = selected
    ? getLeagueDistribution(selected)
    : { data: [], leagues: [] };
  const overlapPlayers = selected ? getPlayerOverlap(selected) : [];

  return (
    <div className="min-h-screen bg-ef-bg text-ef-fg">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pb-16 space-y-10">

        {/* Country selector */}
        <CountrySelector
          countries={data.countries}
          selected={selected}
          onChange={setSelected}
        />

        {selected && years.length > 0 ? (
          <>
            {/* Country + meta */}
            <div className="border-b border-ef-bg2 pb-4">
              <h2 className="text-xl font-semibold text-ef-fg">{selected}</h2>
              <p className="text-ef-dim text-sm mt-0.5">
                {years.join(" · ")} &nbsp;&mdash;&nbsp; {years.length} tournament{years.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Charts */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ContinentChart data={continentData} />
              <LeagueChart data={leagueData} leagues={leagues} />
            </section>

            {/* Multi-tournament players */}
            {overlapPlayers.length > 0 && (
              <section>
                <PlayerOverlapTable players={overlapPlayers} />
              </section>
            )}

            {/* Roster tables */}
            <section className="space-y-3">
              <p className="text-xs font-medium tracking-widest uppercase text-ef-dim">
                Squads
              </p>
              <div
                className={`grid gap-5 ${
                  years.length === 1
                    ? "grid-cols-1 max-w-xl"
                    : years.length === 2
                    ? "grid-cols-1 lg:grid-cols-2"
                    : "grid-cols-1 lg:grid-cols-3"
                }`}
              >
                {years.map((year) => (
                  <RosterTable key={year} year={year} roster={rosters[year]} />
                ))}
              </div>
            </section>
          </>
        ) : (
          !selected && (
            <div className="py-24 text-center">
              <p className="text-4xl mb-4">⚽</p>
              <p className="text-ef-dim text-sm">
                47 countries &nbsp;·&nbsp; 3 tournaments &nbsp;·&nbsp; 1994 – 2002
              </p>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <AppContent />
    </Suspense>
  );
}
