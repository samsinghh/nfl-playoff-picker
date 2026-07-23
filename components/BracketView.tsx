"use client";

import type { CSSProperties } from "react";
import { Game, Team } from "@/types";
import { useBracket } from "@/context/BracketContext";

const TEAM_COLORS: Record<string, string> = {
  ARI: "#9b2746", ATL: "#050505", BAL: "#2f2080", BUF: "#0b3f99",
  CAR: "#108dcc", CHI: "#111a2c", CIN: "#050505", CLE: "#321d00",
  DAL: "#092449", DEN: "#062d4f", DET: "#0d85bd", GB: "#193c32",
  HOU: "#062b3a", IND: "#123c78", JAX: "#006778", KC: "#ed1238",
  LV: "#050505", LAC: "#0b87c9", LAR: "#ffd100", MIA: "#058f9c",
  MIN: "#4f2683", NE: "#0b2d5c", NO: "#211b12", NYG: "#0b3d91",
  NYJ: "#125740", PHI: "#07545a", PIT: "#111111", SEA: "#0b2b4a",
  SF: "#aa0000", TB: "#b31b34", TEN: "#4b92db", WAS: "#5a1414",
};

interface BracketSlotProps {
  team?: Team;
  game?: Game;
  onPickWinner?: (gameId: string, winnerId: string) => void;
}

function BracketSlot({ team, game, onPickWinner }: BracketSlotProps) {
  if (!team) return <div className="bracket-tile bracket-tile--empty" aria-hidden="true" />;

  const isWinner = game?.winnerId === team.id;
  const isEliminated = Boolean(game?.winnerId && !isWinner);
  const style = {
    "--team-color": TEAM_COLORS[team.abbreviation ?? ""] ?? "#182029",
  } as CSSProperties;
  const content = (
    <>
      <span className="tile-seed">#{team.seed}</span>
      <img src={team.logoUrl} alt="" aria-hidden="true" />
    </>
  );

  if (!game || !onPickWinner) {
    return <div className="bracket-tile bracket-tile--team" style={style} aria-label={`${team.name}, seed ${team.seed}`}>{content}</div>;
  }

  return (
    <button
      type="button"
      className={`bracket-tile bracket-tile--team${isWinner ? " bracket-tile--winner" : ""}${isEliminated ? " bracket-tile--eliminated" : ""}`}
      style={style}
      onClick={() => onPickWinner(game.id, team.id)}
      aria-pressed={isWinner}
      aria-label={`Pick ${team.name} to advance`}
    >
      {content}
    </button>
  );
}

function InteractiveGameSlots({ games, expectedGames, onPickWinner }: { games: Game[]; expectedGames: number; onPickWinner: (gameId: string, winnerId: string) => void }) {
  const slots = games.flatMap((game) => [
    <BracketSlot key={`${game.id}-home`} team={game.home} game={game} onPickWinner={onPickWinner} />,
    <BracketSlot key={`${game.id}-away`} team={game.away} game={game} onPickWinner={onPickWinner} />,
  ]);

  while (slots.length < expectedGames * 2) {
    slots.push(<BracketSlot key={`empty-${slots.length}`} />);
  }

  return <>{slots}</>;
}

export function BracketView() {
  const { state, pickWinner } = useBracket();

  if (!state) return null;

  const gamesFor = (conference: "AFC" | "NFC", round: Game["round"]) =>
    state.games.filter((game) => game.conference === conference && game.round === round);
  const afcSeed1 = state.teams.find((team) => team.conference === "AFC" && team.seed === 1);
  const nfcSeed1 = state.teams.find((team) => team.conference === "NFC" && team.seed === 1);
  const afcDivisional = gamesFor("AFC", "DIV");
  const nfcDivisional = gamesFor("NFC", "DIV");
  const superBowl = state.games.filter((game) => game.round === "SB");

  return (
    <section id="bracket-container" className="reference-bracket" aria-label="NFL playoff bracket">
      <div className="reference-bracket-scroll" tabIndex={0}>
        <div className="reference-bracket-field">
          <div className="slot-column slot-column--afc-wild-card">
            <InteractiveGameSlots games={gamesFor("AFC", "WC")} expectedGames={3} onPickWinner={pickWinner} />
          </div>

          <div className="slot-column slot-column--afc-divisional">
            {afcDivisional.length ? (
              <InteractiveGameSlots games={afcDivisional} expectedGames={2} onPickWinner={pickWinner} />
            ) : (
              <><BracketSlot team={afcSeed1} /><BracketSlot /><BracketSlot /><BracketSlot /></>
            )}
          </div>

          <div className="slot-column slot-column--afc-championship">
            <InteractiveGameSlots games={gamesFor("AFC", "CONF")} expectedGames={1} onPickWinner={pickWinner} />
          </div>

          <div className="slot-column slot-column--super-bowl">
            <InteractiveGameSlots games={superBowl} expectedGames={1} onPickWinner={pickWinner} />
          </div>

          <div className="slot-column slot-column--nfc-championship">
            <InteractiveGameSlots games={gamesFor("NFC", "CONF")} expectedGames={1} onPickWinner={pickWinner} />
          </div>

          <div className="slot-column slot-column--nfc-divisional">
            {nfcDivisional.length ? (
              <InteractiveGameSlots games={nfcDivisional} expectedGames={2} onPickWinner={pickWinner} />
            ) : (
              <><BracketSlot team={nfcSeed1} /><BracketSlot /><BracketSlot /><BracketSlot /></>
            )}
          </div>

          <div className="slot-column slot-column--nfc-wild-card">
            <InteractiveGameSlots games={gamesFor("NFC", "WC")} expectedGames={3} onPickWinner={pickWinner} />
          </div>
        </div>
      </div>
      <p className="reference-scroll-hint">Swipe horizontally to view the full bracket</p>
    </section>
  );
}
