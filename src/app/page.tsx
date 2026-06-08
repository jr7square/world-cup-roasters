"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import Header from "@/components/Header";
import CountrySelector from "@/components/CountrySelector";
import RosterTable from "@/components/RosterTable";
import ContinentChart from "@/components/ContinentChart";
import LeagueChart from "@/components/LeagueChart";
import PlayerOverlapTable from "@/components/PlayerOverlapTable";
import TournamentFilter from "@/components/TournamentFilter";

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
  const [selectedYears, setSelectedYears] = useState<number[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selected) params.set("country", selected);
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selected, router]);

  // Default to 2026 (or most recent available) when country changes
  useEffect(() => {
    if (!selected) { setSelectedYears([]); return; }
    const allYears = data.tournaments
      .filter((t) => t.teams[selected])
      .map((t) => t.year)
      .sort((a, b) => a - b);
    const defaultYear = allYears.includes(2026) ? 2026 : allYears[allYears.length - 1];
    setSelectedYears([defaultYear]);
  }, [selected]);

  const allRosters = selected ? getCountryRosters(selected) : {};
  const allYears = Object.keys(allRosters).map(Number).sort();

  const rosters = selected ? getCountryRosters(selected, selectedYears) : {};
  const years = Object.keys(rosters).map(Number).sort();
  const continentData = selected && selectedYears.length > 0
    ? getContinentDistribution(selected, selectedYears) : [];
  const { data: leagueData, leagues, leagueCountry } = selected && selectedYears.length > 0
    ? getLeagueDistribution(selected, 7, selectedYears)
    : { data: [], leagues: [], leagueCountry: {} };
  const overlapPlayers = selected && selectedYears.length > 0
    ? getPlayerOverlap(selected, selectedYears) : [];

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

        {selected && allYears.length > 0 ? (
          <>
            {/* Country + meta */}
            <div className="border-b border-ef-bg2 pb-4">
              <h2 className="text-xl font-semibold text-ef-fg">{selected}</h2>
              <p className="text-ef-dim text-sm mt-0.5">
                {allYears.join(" · ")} &nbsp;&mdash;&nbsp; {allYears.length} tournament{allYears.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Tournament filter */}
            <TournamentFilter
              years={allYears}
              selected={selectedYears}
              onChange={setSelectedYears}
            />

            {/* Charts */}
            {selectedYears.length > 0 ? (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ContinentChart data={continentData} />
                <LeagueChart data={leagueData} leagues={leagues} leagueCountry={leagueCountry} />
              </section>
            ) : (
              <p className="text-ef-dim text-sm">Select at least one tournament to see charts.</p>
            )}

            {/* Multi-tournament players */}
            {overlapPlayers.length > 0 && (
              <section>
                <PlayerOverlapTable players={overlapPlayers} />
              </section>
            )}

            {/* Roster tables */}
            {years.length > 0 && (
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
            )}
          </>
        ) : (
          !selected && (
            <div className="py-24 text-center">
              <p className="text-4xl mb-4">⚽</p>
              <p className="text-ef-dim text-sm">
                73 countries &nbsp;·&nbsp; 9 tournaments &nbsp;·&nbsp; 1994 – 2026
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
