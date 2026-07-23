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
    <section className="seed-entry">
      <header className="seed-header">
        <p className="season-label">2025 postseason</p>
        <button type="button" onClick={handleLoad2025Seeds} className="button button--secondary">
          Use 2025 seeds
        </button>
      </header>
      
      <div className="seed-conferences">
        {/* AFC Column */}
        <div className="seed-conference seed-conference--afc">
          <h2><span>AFC</span> seeds</h2>
          {SEEDS.map((seed) => {
            const selected = getSelectedTeam("AFC", seed);
            const available = getAvailableTeams("AFC", seed);
            return (
              <label key={seed} className="seed-row">
                <span className="seed-number">{seed}</span>
                <span className="seed-select-wrap">
                  <span className="seed-team-logo" aria-hidden="true">
                    {selected && (
                      <img
                        src={selected.logoUrl}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    )}
                  </span>
                  <select
                    aria-label={`AFC seed ${seed}`}
                    value={afcTeams[seed]}
                    onChange={(e) => handleTeamChange("AFC", seed, e.target.value)}
                    className={afcTeams[seed] ? "has-logo" : ""}
                  >
                    <option value="">Select a team</option>
                    {available.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                    {selected && (
                      <option value={selected.id}>{selected.name}</option>
                    )}
                  </select>
                </span>
              </label>
            );
          })}
        </div>

        {/* NFC Column */}
        <div className="seed-conference seed-conference--nfc">
          <h2><span>NFC</span> seeds</h2>
          {SEEDS.map((seed) => {
            const selected = getSelectedTeam("NFC", seed);
            const available = getAvailableTeams("NFC", seed);
            return (
              <label key={seed} className="seed-row">
                <span className="seed-number">{seed}</span>
                <span className="seed-select-wrap">
                  <span className="seed-team-logo" aria-hidden="true">
                    {selected && (
                      <img
                        src={selected.logoUrl}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    )}
                  </span>
                  <select
                    aria-label={`NFC seed ${seed}`}
                    value={nfcTeams[seed]}
                    onChange={(e) => handleTeamChange("NFC", seed, e.target.value)}
                    className={nfcTeams[seed] ? "has-logo" : ""}
                  >
                    <option value="">Select a team</option>
                    {available.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                    {selected && (
                      <option value={selected.id}>{selected.name}</option>
                    )}
                  </select>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="seed-footer">
        <p>All 14 seeds are required. Teams can only appear once per conference.</p>
        <button type="button" onClick={handleGenerate} className="button button--primary">Create bracket</button>
      </div>
    </section>
  );
}
