export interface NFLTeam {
  id: string;
  name: string;
  abbreviation: string;
  conference: "AFC" | "NFC";
  division: string;
  logoUrl: string;
}

export const NFL_TEAMS: NFLTeam[] = [
  // AFC East
  {
    id: "buffalo-bills",
    name: "Buffalo Bills",
    abbreviation: "BUF",
    conference: "AFC",
    division: "East",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png",
  },
  {
    id: "miami-dolphins",
    name: "Miami Dolphins",
    abbreviation: "MIA",
    conference: "AFC",
    division: "East",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png",
  },
  {
    id: "new-england-patriots",
    name: "New England Patriots",
    abbreviation: "NE",
    conference: "AFC",
    division: "East",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/ne.png",
  },
  {
    id: "new-york-jets",
    name: "New York Jets",
    abbreviation: "NYJ",
    conference: "AFC",
    division: "East",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png",
  },
  // AFC North
  {
    id: "baltimore-ravens",
    name: "Baltimore Ravens",
    abbreviation: "BAL",
    conference: "AFC",
    division: "North",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png",
  },
  {
    id: "cincinnati-bengals",
    name: "Cincinnati Bengals",
    abbreviation: "CIN",
    conference: "AFC",
    division: "North",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png",
  },
  {
    id: "cleveland-browns",
    name: "Cleveland Browns",
    abbreviation: "CLE",
    conference: "AFC",
    division: "North",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png",
  },
  {
    id: "pittsburgh-steelers",
    name: "Pittsburgh Steelers",
    abbreviation: "PIT",
    conference: "AFC",
    division: "North",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png",
  },
  // AFC South
  {
    id: "houston-texans",
    name: "Houston Texans",
    abbreviation: "HOU",
    conference: "AFC",
    division: "South",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png",
  },
  {
    id: "indianapolis-colts",
    name: "Indianapolis Colts",
    abbreviation: "IND",
    conference: "AFC",
    division: "South",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/ind.png",
  },
  {
    id: "jacksonville-jaguars",
    name: "Jacksonville Jaguars",
    abbreviation: "JAX",
    conference: "AFC",
    division: "South",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/jax.png",
  },
  {
    id: "tennessee-titans",
    name: "Tennessee Titans",
    abbreviation: "TEN",
    conference: "AFC",
    division: "South",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/ten.png",
  },
  // AFC West
  {
    id: "denver-broncos",
    name: "Denver Broncos",
    abbreviation: "DEN",
    conference: "AFC",
    division: "West",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/den.png",
  },
  {
    id: "kansas-city-chiefs",
    name: "Kansas City Chiefs",
    abbreviation: "KC",
    conference: "AFC",
    division: "West",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png",
  },
  {
    id: "las-vegas-raiders",
    name: "Las Vegas Raiders",
    abbreviation: "LV",
    conference: "AFC",
    division: "West",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/lv.png",
  },
  {
    id: "los-angeles-chargers",
    name: "Los Angeles Chargers",
    abbreviation: "LAC",
    conference: "AFC",
    division: "West",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/lac.png",
  },
  // NFC East
  {
    id: "dallas-cowboys",
    name: "Dallas Cowboys",
    abbreviation: "DAL",
    conference: "NFC",
    division: "East",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png",
  },
  {
    id: "new-york-giants",
    name: "New York Giants",
    abbreviation: "NYG",
    conference: "NFC",
    division: "East",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png",
  },
  {
    id: "philadelphia-eagles",
    name: "Philadelphia Eagles",
    abbreviation: "PHI",
    conference: "NFC",
    division: "East",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png",
  },
  {
    id: "washington-commanders",
    name: "Washington Commanders",
    abbreviation: "WAS",
    conference: "NFC",
    division: "East",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/wsh.png",
  },
  // NFC North
  {
    id: "chicago-bears",
    name: "Chicago Bears",
    abbreviation: "CHI",
    conference: "NFC",
    division: "North",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png",
  },
  {
    id: "detroit-lions",
    name: "Detroit Lions",
    abbreviation: "DET",
    conference: "NFC",
    division: "North",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png",
  },
  {
    id: "green-bay-packers",
    name: "Green Bay Packers",
    abbreviation: "GB",
    conference: "NFC",
    division: "North",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png",
  },
  {
    id: "minnesota-vikings",
    name: "Minnesota Vikings",
    abbreviation: "MIN",
    conference: "NFC",
    division: "North",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/min.png",
  },
  // NFC South
  {
    id: "atlanta-falcons",
    name: "Atlanta Falcons",
    abbreviation: "ATL",
    conference: "NFC",
    division: "South",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/atl.png",
  },
  {
    id: "carolina-panthers",
    name: "Carolina Panthers",
    abbreviation: "CAR",
    conference: "NFC",
    division: "South",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/car.png",
  },
  {
    id: "new-orleans-saints",
    name: "New Orleans Saints",
    abbreviation: "NO",
    conference: "NFC",
    division: "South",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/no.png",
  },
  {
    id: "tampa-bay-buccaneers",
    name: "Tampa Bay Buccaneers",
    abbreviation: "TB",
    conference: "NFC",
    division: "South",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/tb.png",
  },
  // NFC West
  {
    id: "arizona-cardinals",
    name: "Arizona Cardinals",
    abbreviation: "ARI",
    conference: "NFC",
    division: "West",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/ari.png",
  },
  {
    id: "los-angeles-rams",
    name: "Los Angeles Rams",
    abbreviation: "LAR",
    conference: "NFC",
    division: "West",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png",
  },
  {
    id: "san-francisco-49ers",
    name: "San Francisco 49ers",
    abbreviation: "SF",
    conference: "NFC",
    division: "West",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png",
  },
  {
    id: "seattle-seahawks",
    name: "Seattle Seahawks",
    abbreviation: "SEA",
    conference: "NFC",
    division: "West",
    logoUrl: "https://a.espncdn.com/i/teamlogos/nfl/500/sea.png",
  },
];

export function getTeamsByConference(conference: "AFC" | "NFC"): NFLTeam[] {
  return NFL_TEAMS.filter((team) => team.conference === conference);
}

