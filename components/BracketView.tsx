"use client";

import { Game, Round, Conference, Team } from "@/types";
import { useBracket } from "@/context/BracketContext";

const roundLabels: Record<Round, string> = {
  WC: "Wild Card",
  DIV: "Divisional",
  CONF: "Conference Championship",
  SB: "Super Bowl",
};

interface TeamSlotProps {
  team: Team;
  isWinner: boolean;
  onClick: () => void;
}

function TeamSlot({ team, isWinner, onClick }: TeamSlotProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-2 lg:px-3 py-1.5 lg:py-2 rounded transition-colors flex items-center gap-1.5 lg:gap-2 ${
        isWinner
          ? "bg-green-100 border-2 border-green-500 font-semibold"
          : "bg-white border-2 border-gray-300 hover:bg-gray-50"
      }`}
    >
      {team.logoUrl && (
        <img
          src={team.logoUrl}
          alt={team.name}
          className="w-6 h-6 lg:w-8 lg:h-8 object-contain flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-1 lg:gap-2">
          <span className="text-xs lg:text-sm font-medium text-black flex-shrink-0">#{team.seed}</span>
          <span className="text-xs lg:text-sm text-black font-semibold">{team.abbreviation || team.name}</span>
        </div>
      </div>
      {isWinner && (
        <span className="text-green-600 font-bold flex-shrink-0 ml-1">✓</span>
      )}
    </button>
  );
}

interface BracketGameProps {
  game: Game;
  onPickWinner: (gameId: string, winnerId: string) => void;
}

function BracketGame({ game, onPickWinner }: BracketGameProps) {
  const homeWinner = game.winnerId === game.home.id;
  const awayWinner = game.winnerId === game.away.id;

  return (
    <div className="flex flex-col gap-1">
      <TeamSlot
        team={game.home}
        isWinner={homeWinner}
        onClick={() => onPickWinner(game.id, game.home.id)}
      />
      <div className="text-center text-xs text-black py-1">vs</div>
      <TeamSlot
        team={game.away}
        isWinner={awayWinner}
        onClick={() => onPickWinner(game.id, game.away.id)}
      />
    </div>
  );
}

interface ConferenceBracketSideProps {
  conference: Conference;
  games: Game[];
  seed1Team?: Team;
  onPickWinner: (gameId: string, winnerId: string) => void;
  isLeftSide: boolean;
}

function ConferenceBracketSide({
  conference,
  games,
  seed1Team,
  onPickWinner,
  isLeftSide,
}: ConferenceBracketSideProps) {
  const wcGames = games
    .filter((g) => g.round === "WC")
    .sort((a, b) => {
      const order = [2, 3, 4];
      return order.indexOf(a.home.seed) - order.indexOf(b.home.seed);
    });
  const divGames = games.filter((g) => g.round === "DIV");
  const confGames = games.filter((g) => g.round === "CONF");

  const confColor = conference === "AFC" ? "text-red-600" : "text-blue-600";
  const confBgColor = conference === "AFC" ? "bg-red-50" : "bg-blue-50";

  // For NFC (right side), we want CONF on right, DIV in middle, WC on left
  // So we use CSS order to position them correctly
  const rounds: Array<{
    label: string;
    games: Game[];
    seed1?: Team;
    order: number;
  }> = [
    { label: roundLabels.WC, games: wcGames, seed1: seed1Team, order: isLeftSide ? 1 : 3 },
    { label: roundLabels.DIV, games: divGames, order: isLeftSide ? 2 : 2 },
    { label: roundLabels.CONF, games: confGames, order: isLeftSide ? 3 : 1 },
  ];

  return (
    <div className={`${confBgColor} p-3 lg:p-4 rounded-lg relative w-full`}>
      <h3 className={`text-xl lg:text-2xl font-bold ${confColor} mb-4 lg:mb-6 text-center`}>{conference}</h3>
      
      <div className="flex flex-row gap-1 lg:gap-2 items-start relative">
        {rounds.map((round, idx) => (
          <div
            key={idx}
            className="flex-1 space-y-3 lg:space-y-4 px-1 lg:px-2 relative min-w-0"
            style={{ order: round.order }}
          >
            <h4 className="text-xs lg:text-sm font-semibold text-black mb-2 lg:mb-3 text-center">
              {round.label}
            </h4>
            {round.seed1 && (
              <div className="mb-4 p-2 bg-yellow-100 border-2 border-yellow-300 rounded text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {round.seed1.logoUrl && (
                    <img src={round.seed1.logoUrl} alt={round.seed1.name} className="w-6 h-6 object-contain" />
                  )}
                  <span className="text-xs font-semibold text-black">
                    #{round.seed1.seed} {round.seed1.name}
                  </span>
                </div>
                <span className="text-xs text-black">BYE</span>
              </div>
            )}
            <div
              className={
                round.label === roundLabels.DIV
                  ? "space-y-6 lg:space-y-8"
                  : "space-y-2 lg:space-y-3"
              }
            >
              {round.games.map((game) => (
                <BracketGame key={game.id} game={game} onPickWinner={onPickWinner} />
              ))}
            </div>
            {round.games.length === 0 && (
              <p className="text-black text-sm text-center">
                {round.label === roundLabels.WC && "No games yet"}
                {round.label === roundLabels.DIV && "Complete Wild Card first"}
                {round.label === roundLabels.CONF && "Complete Divisional first"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BracketView() {
  const { state, pickWinner } = useBracket();

  if (!state) {
    return null;
  }

  const afcGames = state.games.filter((g) => g.conference === "AFC");
  const nfcGames = state.games.filter((g) => g.conference === "NFC");
  const sbGames = state.games.filter((g) => g.round === "SB");
  
  const afcSeed1 = state.teams.find((t) => t.conference === "AFC" && t.seed === 1);
  const nfcSeed1 = state.teams.find((t) => t.conference === "NFC" && t.seed === 1);

  return (
    <div id="bracket-container" className="w-full overflow-x-auto">
      <div className="min-w-full max-w-full mx-auto p-4 lg:p-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6 lg:mb-8 text-black">NFL Playoff Bracket</h2>

        <div className="flex flex-col xl:flex-row gap-4 items-start justify-center relative min-w-0">
          {/* AFC Bracket - flows left to right */}
          <div className="flex-1 min-w-0 max-w-full xl:max-w-[600px] relative">
            <ConferenceBracketSide
              conference="AFC"
              games={afcGames}
              seed1Team={afcSeed1}
              onPickWinner={pickWinner}
              isLeftSide={true}
            />
          </div>

          {/* Super Bowl - Center */}
          {sbGames.length > 0 && (
            <div className="flex-shrink-0 px-2 lg:px-4 xl:px-8 w-full xl:w-auto">
              <div className="bg-purple-50 p-4 lg:p-6 rounded-lg border-4 border-purple-300 w-full xl:w-[280px] mx-auto">
                <h3 className="text-lg lg:text-xl font-bold text-center mb-4 text-purple-600">
                  {roundLabels.SB}
                </h3>
                {sbGames.map((game) => (
                  <BracketGame key={game.id} game={game} onPickWinner={pickWinner} />
                ))}
              </div>
            </div>
          )}

          {/* NFC Bracket - flows right to left */}
          <div className="flex-1 min-w-0 max-w-full xl:max-w-[600px]">
            <ConferenceBracketSide
              conference="NFC"
              games={nfcGames}
              seed1Team={nfcSeed1}
              onPickWinner={pickWinner}
              isLeftSide={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
