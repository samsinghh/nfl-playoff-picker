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
      className={`w-full text-left px-3 py-2 rounded-sm border transition-all flex items-center gap-2 ${
        isWinner
          ? "bg-red-600 border-red-700 font-bold text-white shadow-md z-10 scale-[1.02]"
          : "bg-white border-gray-200 hover:bg-gray-50 text-gray-900"
      }`}
    >
      <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full p-1 shadow-sm shrink-0 border border-gray-100">
        {team.logoUrl && (
          <img
            src={team.logoUrl}
            alt={team.name}
            className="w-full h-full object-contain"
          />
        )}
      </div>
      <div className="flex-1 min-w-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-black ${isWinner ? "text-red-100" : "text-gray-400"}`}>
            #{team.seed}
          </span>
          <span className="text-xs font-bold truncate tracking-tight uppercase">
            {team.abbreviation || team.name}
          </span>
        </div>
        {isWinner && (
          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <span className="text-red-600 text-[10px] font-black">✓</span>
          </div>
        )}
      </div>
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
    <div className="flex flex-col gap-0 w-full shadow-sm rounded-sm overflow-hidden border border-gray-300 bg-gray-100">
      <TeamSlot
        team={game.home}
        isWinner={homeWinner}
        onClick={() => onPickWinner(game.id, game.home.id)}
      />
      <div className="h-[1px] bg-gray-200 w-full"></div>
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

  const confColor = conference === "AFC" ? "text-red-600 border-red-600" : "text-blue-700 border-blue-700";
  const confBgColor = "bg-white";

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
    <div className={`${confBgColor} rounded-sm border-t-4 ${conference === 'AFC' ? 'border-red-600' : 'border-blue-700'} shadow-sm w-full overflow-hidden pb-6`}>
      <div className="bg-gray-100 py-2 border-b border-gray-200">
        <h3 className={`text-sm font-black ${conference === 'AFC' ? 'text-red-600' : 'text-blue-700'} text-center italic tracking-wider`}>
          {conference} PLAYOFFS
        </h3>
      </div>
      
      <div className="flex flex-row gap-2 lg:gap-4 items-stretch justify-center px-2 mt-4 min-h-[450px]">
        {displayRounds.map((round, idx) => {
          const isWC = round.label === roundLabels.WC;
          const isDIV = round.label === roundLabels.DIV;
          const isCONF = round.label === roundLabels.CONF;
          
          return (
            <div 
              key={idx} 
              className="flex flex-col flex-1 min-w-0"
            >
              <div className="w-full border-b border-gray-200 pb-1 mb-4">
                <h4 className={`text-[10px] font-black text-gray-500 text-center uppercase tracking-tighter leading-none`}>
                  {round.label}
                </h4>
              </div>
              {round.games.length === 0 ? (
                <div className="flex-1 flex items-center justify-center px-2">
                  <p className="text-[10px] font-bold text-gray-300 uppercase text-center leading-tight italic">
                    Waiting for {isDIV ? "Wild Card" : isCONF ? "Divisional" : "Seeds"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center w-full gap-4 lg:gap-6 flex-1">
                  {isWC && round.seed1 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-sm p-2 w-full flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full p-1 border border-gray-100">
                        {round.seed1.logoUrl && (
                          <img src={round.seed1.logoUrl} alt={round.seed1.name} className="w-full h-full object-contain" />
                        )}
                      </div>
                      <div className="flex flex-col leading-none">
                        <span className="text-[9px] font-black text-gray-400">#1 SEED</span>
                        <span className="text-[10px] font-bold text-gray-900 uppercase">{round.seed1.abbreviation || round.seed1.name}</span>
                      </div>
                      <div className="ml-auto">
                        <span className="text-[9px] font-black bg-gray-200 px-1 rounded-sm text-gray-600 uppercase">BYE</span>
                      </div>
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
    <div id="bracket-container" className="w-full bg-gray-50 border border-gray-200">
      <div className="w-full mx-auto p-4 lg:p-6 max-w-[1920px]">
        <div className="flex items-center justify-between mb-8 border-b-2 border-gray-900 pb-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 uppercase italic tracking-tight">NFL PLAYOFFS</h2>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 items-start justify-center">
          {/* AFC Bracket */}
          <div className="w-full xl:flex-1 xl:max-w-[500px]">
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
            <div className="w-full xl:w-[260px] xl:flex-shrink-0 flex items-center justify-center xl:self-center">
              <div className="bg-white border-t-4 border-gray-900 shadow-xl w-full max-w-[280px] overflow-hidden">
                <div className="bg-gray-900 py-2">
                  <h3 className="text-sm font-black text-center text-white italic uppercase tracking-wider">
                    {roundLabels.SB}
                  </h3>
                </div>
                <div className="p-4">
                  {sbGames.map((game) => (
                    <BracketGame key={game.id} game={game} onPickWinner={pickWinner} />
                  ))}
                  {sbWinner && (
                    <div className="mt-6 p-4 bg-gray-900 rounded-sm relative overflow-hidden group transition-all duration-500">
                      {/* Diagonal accent */}
                      <div className="absolute top-0 right-0 w-16 h-full bg-red-600 transform translate-x-8 -skew-x-12 opacity-50"></div>
                      
                      <div className="relative z-10 flex flex-col items-center gap-3">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] italic">WORLD CHAMPION</span>
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 bg-white rounded-full p-2 shadow-2xl border-2 border-red-600 scale-110">
                            {sbWinner.logoUrl && (
                              <img
                                src={sbWinner.logoUrl}
                                alt={sbWinner.name}
                                className="w-full h-full object-contain"
                              />
                            )}
                          </div>
                          <span className="text-xl lg:text-2xl font-black text-white uppercase italic tracking-tighter mt-2">
                            {sbWinner.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full xl:w-[260px] xl:flex-shrink-0 hidden xl:block self-center pt-24">
              <div className="flex flex-col items-center text-gray-300">
                <div className="w-12 h-12 border-2 border-gray-200 rounded-full flex items-center justify-center opacity-50 mb-2">
                  <span className="text-xl font-black italic">SB</span>
                </div>
                <span className="text-[10px] font-black uppercase italic opacity-50">Road to Super Bowl</span>
              </div>
            </div>
          )}

          {/* NFC Bracket */}
          <div className="w-full xl:flex-1 xl:max-w-[500px]">
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
