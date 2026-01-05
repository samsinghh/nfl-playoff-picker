import { Team, Game, BracketState, Conference, Round } from "@/types";

/**
 * Generate Wild Card games for a conference
 * Matchups: 2v7, 3v6, 4v5 (higher seed is home)
 * Seed 1 gets a bye
 */
export function makeWildCardGames(teams: Team[], conf: Conference): Game[] {
  const conferenceTeams = teams
    .filter((t) => t.conference === conf)
    .sort((a, b) => a.seed - b.seed);

  if (conferenceTeams.length !== 7) {
    throw new Error(`Expected 7 teams for ${conf}, got ${conferenceTeams.length}`);
  }

  const matchups: [number, number][] = [
    [2, 7],
    [3, 6],
    [4, 5],
  ];

  return matchups.map(([homeSeed, awaySeed], index) => {
    const homeTeam = conferenceTeams.find((t) => t.seed === homeSeed)!;
    const awayTeam = conferenceTeams.find((t) => t.seed === awaySeed)!;

    return {
      id: `wc-${conf}-${index + 1}`,
      round: "WC" as Round,
      conference: conf,
      home: homeTeam,
      away: awayTeam,
    };
  });
}

/**
 * Get winners from a specific round for a conference
 */
function getWinnersFromRound(
  state: BracketState,
  conf: Conference,
  round: Round
): Team[] {
  const roundGames = state.games.filter(
    (g) => g.conference === conf && g.round === round && g.winnerId
  );

  return roundGames
    .map((g) => {
      const winner = g.winnerId === g.home.id ? g.home : g.away;
      return state.teams.find((t) => t.id === winner.id)!;
    })
    .filter(Boolean);
}

/**
 * Get the seed 1 team for a conference (gets bye in Wild Card)
 */
function getSeed1Team(teams: Team[], conf: Conference): Team | null {
  return (
    teams.find((t) => t.conference === conf && t.seed === 1) || null
  );
}

/**
 * Compute Divisional round games for a conference
 * Seed 1 plays lowest remaining seed
 * Other two remaining teams play each other
 */
export function computeDivisionalGames(
  state: BracketState,
  conf: Conference
): Game[] {
  const wcWinners = getWinnersFromRound(state, conf, "WC");
  const seed1 = getSeed1Team(state.teams, conf);

  if (!seed1) {
    throw new Error(`No seed 1 team found for ${conf}`);
  }

  // All remaining teams (seed 1 + WC winners)
  const remaining = [seed1, ...wcWinners];

  if (remaining.length !== 4) {
    throw new Error(
      `Expected 4 teams for Divisional round (1 seed 1 + 3 WC winners), got ${remaining.length}`
    );
  }

  // Sort by seed (ascending - lower seed number is better)
  remaining.sort((a, b) => a.seed - b.seed);

  // Seed 1 plays lowest remaining seed (highest seed number)
  const seed1Team = remaining[0];
  const lowestSeed = remaining[remaining.length - 1];
  const otherTeams = remaining.slice(1, -1);

  const games: Game[] = [];

  // Game 1: Seed 1 vs lowest remaining seed
  games.push({
    id: `div-${conf}-1`,
    round: "DIV",
    conference: conf,
    home: seed1Team.seed < lowestSeed.seed ? seed1Team : lowestSeed,
    away: seed1Team.seed < lowestSeed.seed ? lowestSeed : seed1Team,
  });

  // Game 2: Other two teams play each other
  if (otherTeams.length === 2) {
    games.push({
      id: `div-${conf}-2`,
      round: "DIV",
      conference: conf,
      home: otherTeams[0].seed < otherTeams[1].seed ? otherTeams[0] : otherTeams[1],
      away: otherTeams[0].seed < otherTeams[1].seed ? otherTeams[1] : otherTeams[0],
    });
  }

  return games;
}

/**
 * Compute Conference Championship game
 * Remaining two teams play (higher seed hosts)
 */
export function computeConferenceChampionship(
  state: BracketState,
  conf: Conference
): Game | null {
  const divWinners = getWinnersFromRound(state, conf, "DIV");

  if (divWinners.length !== 2) {
    return null;
  }

  // Sort by seed (lower seed number is better)
  divWinners.sort((a, b) => a.seed - b.seed);

  return {
    id: `conf-${conf}`,
    round: "CONF",
    conference: conf,
    home: divWinners[0],
    away: divWinners[1],
  };
}

/**
 * Compute Super Bowl game
 * AFC champ vs NFC champ
 */
export function computeSuperBowl(state: BracketState): Game | null {
  const afcChamp = getWinnersFromRound(state, "AFC", "CONF")[0];
  const nfcChamp = getWinnersFromRound(state, "NFC", "CONF")[0];

  if (!afcChamp || !nfcChamp) {
    return null;
  }

  // Super Bowl is neutral site, but we'll use AFC as home for consistency
  return {
    id: "sb-1",
    round: "SB",
    home: afcChamp,
    away: nfcChamp,
  };
}

/**
 * Compute next round games for a conference
 */
export function computeNextRoundGames(
  state: BracketState,
  conf: Conference,
  round: Round
): Game[] {
  switch (round) {
    case "WC":
      return makeWildCardGames(state.teams, conf);
    case "DIV":
      return computeDivisionalGames(state, conf);
    case "CONF": {
      const game = computeConferenceChampionship(state, conf);
      return game ? [game] : [];
    }
    case "SB": {
      const game = computeSuperBowl(state);
      return game ? [game] : [];
    }
    default:
      return [];
  }
}

/**
 * Set winner for a game and recompute downstream games
 */
export function setGameWinner(
  state: BracketState,
  gameId: string,
  winnerId: string
): BracketState {
  const game = state.games.find((g) => g.id === gameId);
  if (!game) {
    throw new Error(`Game ${gameId} not found`);
  }

  // Validate winnerId is either home or away
  if (winnerId !== game.home.id && winnerId !== game.away.id) {
    throw new Error(`Winner ${winnerId} is not a participant in game ${gameId}`);
  }

  // Update the game with winner
  const updatedGames = state.games.map((g) =>
    g.id === gameId ? { ...g, winnerId } : g
  );

  // Determine which rounds need to be recomputed
  const gameRound = game.round;
  const gameConf = game.conference;

  // Determine which rounds need to be recomputed
  const roundsToRemove: Round[] = [];
  const removeSuperBowl = gameRound !== "SB";

  if (gameRound === "WC" && gameConf) {
    roundsToRemove.push("DIV", "CONF");
  } else if (gameRound === "DIV" && gameConf) {
    roundsToRemove.push("CONF");
  }

  // Remove games in later rounds
  let filteredGames = updatedGames.filter((g) => {
    // Remove Super Bowl if any conference game changed
    if (g.round === "SB" && removeSuperBowl) {
      return false;
    }
    // Remove later rounds for this conference
    if (g.conference === gameConf && roundsToRemove.includes(g.round)) {
      return false;
    }
    return true;
  });

  // Recompute next round games
  const newState: BracketState = {
    ...state,
    games: filteredGames,
  };

  // Generate next round if current round is complete
  if (gameRound === "WC" && gameConf) {
    // Check if all WC games for this conference are complete
    const wcGames = filteredGames.filter(
      (g) => g.conference === gameConf && g.round === "WC"
    );
    if (wcGames.every((g) => g.winnerId)) {
      const divGames = computeDivisionalGames(newState, gameConf);
      filteredGames = [...filteredGames, ...divGames];
    }
  } else if (gameRound === "DIV" && gameConf) {
    // Check if all DIV games for this conference are complete
    const divGames = filteredGames.filter(
      (g) => g.conference === gameConf && g.round === "DIV"
    );
    if (divGames.every((g) => g.winnerId)) {
      const confGame = computeConferenceChampionship(newState, gameConf);
      if (confGame) {
        filteredGames = [...filteredGames, confGame];
      }
    }
  } else if (gameRound === "CONF" && gameConf) {
    // Check if both conference championships are complete
    const afcConf = filteredGames.find(
      (g) => g.conference === "AFC" && g.round === "CONF" && g.winnerId
    );
    const nfcConf = filteredGames.find(
      (g) => g.conference === "NFC" && g.round === "CONF" && g.winnerId
    );
    if (afcConf && nfcConf) {
      const sbGame = computeSuperBowl({
        ...newState,
        games: filteredGames,
      });
      if (sbGame) {
        filteredGames = [...filteredGames, sbGame];
      }
    }
  }

  return {
    ...state,
    games: filteredGames,
  };
}

/**
 * Generate initial bracket state from teams
 */
export function generateBracket(teams: Team[]): BracketState {
  if (teams.length !== 14) {
    throw new Error(`Expected 14 teams (7 per conference), got ${teams.length}`);
  }

  const afcTeams = teams.filter((t) => t.conference === "AFC");
  const nfcTeams = teams.filter((t) => t.conference === "NFC");

  if (afcTeams.length !== 7 || nfcTeams.length !== 7) {
    throw new Error("Each conference must have exactly 7 teams");
  }

  const afcWC = makeWildCardGames(teams, "AFC");
  const nfcWC = makeWildCardGames(teams, "NFC");

  return {
    teams,
    games: [...afcWC, ...nfcWC],
  };
}

