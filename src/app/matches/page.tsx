"use client";

import { useState } from "react";
import Header from "@/components/Header";
import GroupStageView from "@/components/GroupStageView";
import BracketView from "@/components/BracketView";
import { getGroupMatches, getKnockoutMatches } from "@/lib/matches";

const groupMatches = getGroupMatches();
const knockoutMatches = getKnockoutMatches();

type Tab = "groups" | "bracket";

export default function MatchesPage() {
  const [tab, setTab] = useState<Tab>("groups");

  return (
    <div className="min-h-screen bg-ef-bg text-ef-fg">
      <Header />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 pb-16">
        {/* Page header */}
        <div className="border-b border-ef-bg2 pb-4 mb-6">
          <h2 className="text-xl font-semibold text-ef-fg">2026 World Cup Matches</h2>
          <p className="text-ef-dim text-sm mt-0.5">
            48 teams · 104 matches · June 11 – July 26, 2026
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 mb-6">
          {(["groups", "bracket"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                tab === t
                  ? "bg-ef-bg2 text-ef-fg font-medium"
                  : "text-ef-dim hover:text-ef-fg hover:bg-ef-bg1"
              }`}
            >
              {t === "groups" ? "Groups" : "Bracket"}
            </button>
          ))}
        </div>

        {tab === "groups" ? (
          <GroupStageView groupMatches={groupMatches} />
        ) : (
          <BracketView knockoutMatches={knockoutMatches} />
        )}
      </main>
    </div>
  );
}
