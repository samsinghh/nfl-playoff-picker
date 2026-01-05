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

  // Build rounds array
  // AFC (left): WC -> DIV -> CONF (WC at left edge, CONF near center/Super Bowl)
  // NFC (right): CONF -> DIV -> WC (CONF near center/Super Bowl, WC at right edge)
  const rounds = [
    { label: roundLabels.WC, games: wcGames, seed1: seed1Team },
    { label: roundLabels.DIV, games: divGames },
    { label: roundLabels.CONF, games: confGames },
  ];
  
  // For NFC, reverse so CONF is closest to center (left side of NFC bracket)
  const displayRounds = isLeftSide ? rounds : [...rounds].reverse();

  return (
    <div className={`${confBgColor} p-3 lg:p-4 rounded-lg w-full`}>
      <h3 className={`text-xl lg:text-2xl font-bold ${confColor} mb-4 lg:mb-6 text-center`}>{conference}</h3>
      
      <div className="flex flex-row gap-4 lg:gap-6 items-start justify-center">
        {displayRounds.map((round, idx) => {
          const isWC = round.label === roundLabels.WC;
          const isDIV = round.label === roundLabels.DIV;
          const isCONF = round.label === roundLabels.CONF;
          
          return (
            <div 
              key={idx} 
              className="flex flex-col items-center flex-1 max-w-[180px]"
            >
              <h4 className={`text-xs lg:text-sm font-semibold text-black mb-4 text-center ${isCONF ? 'whitespace-pre-line' : ''}`}>
                {isCONF ? 'Conference\nChampionship' : round.label}
              </h4>
              {round.games.length === 0 ? (
                <p className="text-black text-sm text-center">
                  {isWC && "No games yet"}
                  {isDIV && "Complete Wild Card first"}
                  {isCONF && "Complete Divisional first"}
                </p>
              ) : (
                <div className={`flex flex-col items-center w-full ${isWC ? 'gap-12 lg:gap-16' : isDIV ? 'gap-20 lg:gap-24 mt-12 lg:mt-16' : 'mt-32 lg:mt-40'}`}>
                  {isWC && round.seed1 && (
                    <div className="p-2 bg-yellow-100 border-2 border-yellow-300 rounded text-center w-full">
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
                  {round.games.map((game) => (
                    <BracketGame key={game.id} game={game} onPickWinner={onPickWinner} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
  
  // Get Super Bowl winner if there is one
  const sbWinner = sbGames.length > 0 && sbGames[0].winnerId
    ? state.teams.find((t) => t.id === sbGames[0].winnerId)
    : null;

  return (
    <div id="bracket-container" className="w-full overflow-x-auto">
      <div className="w-full mx-auto p-4 lg:p-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-6 lg:mb-8 text-black">NFL Playoff Bracket</h2>

        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-start xl:items-center justify-center">
          {/* AFC Bracket */}
          <div className="w-full xl:w-[550px] xl:flex-shrink-0">
            <ConferenceBracketSide
              conference="AFC"
              games={afcGames}
              seed1Team={afcSeed1}
              onPickWinner={pickWinner}
              isLeftSide={true}
            />
          </div>

          {/* Super Bowl - Center */}
          {sbGames.length > 0 ? (
            <div className="w-full xl:w-[280px] xl:flex-shrink-0 flex items-center justify-center xl:self-center xl:-mt-12">
              <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 p-4 lg:p-6 rounded-lg border-4 border-amber-400 shadow-xl w-full">
                <h3 className="text-lg lg:text-xl font-bold text-center mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  {roundLabels.SB}
                </h3>
                {sbGames.map((game) => (
                  <BracketGame key={game.id} game={game} onPickWinner={pickWinner} />
                ))}
                {sbWinner && (
                  <div className="mt-4 pt-4 border-t-2 border-amber-300">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Champion</span>
                      <div className="flex items-center gap-2">
                        {sbWinner.logoUrl && (
                          <img
                            src={sbWinner.logoUrl}
                            alt={sbWinner.name}
                            className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
                          />
                        )}
                        <span className="text-base lg:text-lg font-bold text-black">
                          {sbWinner.name}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full xl:w-[280px] xl:flex-shrink-0 hidden xl:block" />
          )}

          {/* NFC Bracket */}
          <div className="w-full xl:w-[550px] xl:flex-shrink-0">
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
