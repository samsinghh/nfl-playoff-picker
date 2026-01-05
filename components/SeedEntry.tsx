"use client";

import { useState } from "react";
import { Conference, Team, Seed } from "@/types";
import { useBracket } from "@/context/BracketContext";
import { getTeamsByConference, NFLTeam } from "@/data/teams";
import { SEEDS_2025 } from "@/data/seeds2025";

const SEEDS: Seed[] = [1, 2, 3, 4, 5, 6, 7];

export function SeedEntry() {
  const { initializeBracket } = useBracket();
  const [afcTeams, setAfcTeams] = useState<Record<Seed, string>>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
  });
  const [nfcTeams, setNfcTeams] = useState<Record<Seed, string>>({
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
  });

  const afcOptions = getTeamsByConference("AFC");
  const nfcOptions = getTeamsByConference("NFC");

  const handleTeamChange = (conference: Conference, seed: Seed, teamId: string) => {
    if (conference === "AFC") {
      setAfcTeams({ ...afcTeams, [seed]: teamId });
    } else {
      setNfcTeams({ ...nfcTeams, [seed]: teamId });
    }
  };

  const handleGenerate = () => {
    // Validate all teams are filled
    const allAfcFilled = Object.values(afcTeams).every((id) => id !== "");
    const allNfcFilled = Object.values(nfcTeams).every((id) => id !== "");

    if (!allAfcFilled || !allNfcFilled) {
      alert("Please select all teams for both conferences");
      return;
    }

    // Validate uniqueness within each conference
    const afcIds = Object.values(afcTeams);
    const nfcIds = Object.values(nfcTeams);

    if (new Set(afcIds).size !== afcIds.length) {
      alert("AFC teams must be unique");
      return;
    }

    if (new Set(nfcIds).size !== nfcIds.length) {
      alert("NFC teams must be unique");
      return;
    }

    // Create teams
    const teams: Team[] = [];

    Object.entries(afcTeams).forEach(([seed, teamId]) => {
      const nflTeam = afcOptions.find((t) => t.id === teamId);
      if (nflTeam) {
        teams.push({
          id: `afc-${seed}-${nflTeam.id}`,
          name: nflTeam.name,
          seed: parseInt(seed) as Seed,
          conference: "AFC",
          logoUrl: nflTeam.logoUrl,
          abbreviation: nflTeam.abbreviation,
        });
      }
    });

    Object.entries(nfcTeams).forEach(([seed, teamId]) => {
      const nflTeam = nfcOptions.find((t) => t.id === teamId);
      if (nflTeam) {
        teams.push({
          id: `nfc-${seed}-${nflTeam.id}`,
          name: nflTeam.name,
          seed: parseInt(seed) as Seed,
          conference: "NFC",
          logoUrl: nflTeam.logoUrl,
          abbreviation: nflTeam.abbreviation,
        });
      }
    });

    initializeBracket(teams);
  };

  const getSelectedTeam = (conference: Conference, seed: Seed): NFLTeam | null => {
    const teamId = conference === "AFC" ? afcTeams[seed] : nfcTeams[seed];
    const options = conference === "AFC" ? afcOptions : nfcOptions;
    return options.find((t) => t.id === teamId) || null;
  };

  const getAvailableTeams = (conference: Conference, currentSeed: Seed): NFLTeam[] => {
    const selectedIds = conference === "AFC" 
      ? Object.values(afcTeams).filter((id, idx) => idx + 1 !== currentSeed && id !== "")
      : Object.values(nfcTeams).filter((id, idx) => idx + 1 !== currentSeed && id !== "");
    const options = conference === "AFC" ? afcOptions : nfcOptions;
    return options.filter((t) => !selectedIds.includes(t.id));
  };

  const handleLoad2025Seeds = () => {
    const afcSeeds = SEEDS.reduce((acc, seed) => {
      acc[seed] = SEEDS_2025.AFC[seed];
      return acc;
    }, {} as Record<Seed, string>);
    
    const nfcSeeds = SEEDS.reduce((acc, seed) => {
      acc[seed] = SEEDS_2025.NFC[seed];
      return acc;
    }, {} as Record<Seed, string>);

    setAfcTeams(afcSeeds);
    setNfcTeams(nfcSeeds);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-black">Enter Playoff Seeds</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AFC Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-600 mb-4">AFC</h3>
          {SEEDS.map((seed) => {
            const selected = getSelectedTeam("AFC", seed);
            const available = getAvailableTeams("AFC", seed);
            return (
              <div key={seed} className="flex items-center gap-3">
                <label className="w-16 text-sm font-medium text-black">Seed {seed}</label>
                <select
                  value={afcTeams[seed]}
                  onChange={(e) => handleTeamChange("AFC", seed, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                >
                  <option value="">Select team...</option>
                  {available.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                  {selected && (
                    <option value={selected.id}>{selected.name}</option>
                  )}
                </select>
                {selected && (
                  <img
                    src={selected.logoUrl}
                    alt={selected.name}
                    className="w-8 h-8 object-contain"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* NFC Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">NFC</h3>
          {SEEDS.map((seed) => {
            const selected = getSelectedTeam("NFC", seed);
            const available = getAvailableTeams("NFC", seed);
            return (
              <div key={seed} className="flex items-center gap-3">
                <label className="w-16 text-sm font-medium text-black">Seed {seed}</label>
                <select
                  value={nfcTeams[seed]}
                  onChange={(e) => handleTeamChange("NFC", seed, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                >
                  <option value="">Select team...</option>
                  {available.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                  {selected && (
                    <option value={selected.id}>{selected.name}</option>
                  )}
                </select>
                {selected && (
                  <img
                    src={selected.logoUrl}
                    alt={selected.name}
                    className="w-8 h-8 object-contain"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-8 text-center space-y-4">
        <button
          onClick={handleLoad2025Seeds}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          Use 2025 NFL Playoff Seeding
        </button>
        <div>
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Bracket
          </button>
        </div>
      </div>
    </div>
  );
}

