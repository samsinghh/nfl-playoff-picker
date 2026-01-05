export type Conference = "AFC" | "NFC";

export type Round = "WC" | "DIV" | "CONF" | "SB";

export type Seed = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Team {
  id: string;
  name: string;
  seed: Seed;
  conference: Conference;
  logoUrl?: string;
  abbreviation?: string;
}

export interface Game {
  id: string;
  round: Round;
  conference?: Conference;
  home: Team;
  away: Team;
  winnerId?: string;
}

export interface BracketState {
  teams: Team[];
  games: Game[];
}

