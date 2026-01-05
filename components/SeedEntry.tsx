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
    <div className="w-full max-w-5xl mx-auto p-6 bg-[#1a1a1a] border border-gray-800 shadow-2xl rounded-sm mt-8">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-gray-800 pb-2">
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">SEED ENTRY</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* AFC Column */}
        <div className="space-y-4 border-t-4 border-red-600 pt-4">
          <h3 className="text-sm font-black text-red-500 italic tracking-wider mb-4">AFC SEEDS</h3>
          {SEEDS.map((seed) => {
            const selected = getSelectedTeam("AFC", seed);
            const available = getAvailableTeams("AFC", seed);
            return (
              <div key={seed} className="flex items-center gap-3 group">
                <div className="w-8 h-8 flex items-center justify-center bg-[#2a2a2a] text-gray-400 font-black italic rounded-sm text-xs group-hover:bg-red-600 group-hover:text-white transition-colors">
                  #{seed}
                </div>
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none">
                    {selected && (
                      <img
                        src={selected.logoUrl}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <select
                    value={afcTeams[seed]}
                    onChange={(e) => handleTeamChange("AFC", seed, e.target.value)}
                    className={`w-full ${afcTeams[seed] ? 'pl-11' : 'pl-3'} pr-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-sm font-bold uppercase italic text-xs tracking-tight text-white focus:outline-none focus:border-red-600 transition-all`}
                  >
                    <option value="" className="bg-[#1a1a1a]">Select AFC Team...</option>
                    {available.map((team) => (
                      <option key={team.id} value={team.id} className="bg-[#1a1a1a]">
                        {team.name}
                      </option>
                    ))}
                    {selected && (
                      <option value={selected.id} className="bg-[#1a1a1a]">{selected.name}</option>
                    )}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* NFC Column */}
        <div className="space-y-4 border-t-4 border-blue-700 pt-4">
          <h3 className="text-sm font-black text-blue-500 italic tracking-wider mb-4">NFC SEEDS</h3>
          {SEEDS.map((seed) => {
            const selected = getSelectedTeam("NFC", seed);
            const available = getAvailableTeams("NFC", seed);
            return (
              <div key={seed} className="flex items-center gap-3 group">
                <div className="w-8 h-8 flex items-center justify-center bg-[#2a2a2a] text-gray-400 font-black italic rounded-sm text-xs group-hover:bg-blue-700 group-hover:text-white transition-colors">
                  #{seed}
                </div>
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none">
                    {selected && (
                      <img
                        src={selected.logoUrl}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <select
                    value={nfcTeams[seed]}
                    onChange={(e) => handleTeamChange("NFC", seed, e.target.value)}
                    className={`w-full ${nfcTeams[seed] ? 'pl-11' : 'pl-3'} pr-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-sm font-bold uppercase italic text-xs tracking-tight text-white focus:outline-none focus:border-blue-700 transition-all`}
                  >
                    <option value="" className="bg-[#1a1a1a]">Select NFC Team...</option>
                    {available.map((team) => (
                      <option key={team.id} value={team.id} className="bg-[#1a1a1a]">
                        {team.name}
                      </option>
                    ))}
                    {selected && (
                      <option value={selected.id} className="bg-[#1a1a1a]">{selected.name}</option>
                    )}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <button
          onClick={handleLoad2025Seeds}
          className="w-full max-w-xs px-6 py-3 bg-[#2a2a2a] text-white border-2 border-gray-700 font-black uppercase italic tracking-widest text-xs hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] active:shadow-none active:translate-y-0"
        >
          Use 2025 NFL Seeds
        </button>
        <button
          onClick={handleGenerate}
          className="w-full max-w-xs px-6 py-4 bg-red-600 text-white font-black uppercase italic tracking-[0.2em] text-sm hover:bg-red-700 transition-all transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(153,0,0,1)] active:shadow-none active:translate-y-0"
        >
          Generate Bracket
        </button>
      </div>
    </div>
  );
}

