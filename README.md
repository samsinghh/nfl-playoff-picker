# NFL Playoffs Bracket

A web application for creating and managing NFL playoffs brackets with automatic reseeding and bracket generation.

## Features

- **Seed Entry**: Enter 7 seeds for both AFC and NFC conferences
- **Automatic Bracket Generation**: Wild Card matchups are automatically generated (2v7, 3v6, 4v5)
- **Interactive Picks**: Click teams to pick winners for each game
- **Automatic Advancement**: Teams automatically advance with proper reseeding after each round
- **Full Bracket View**: See complete bracket including Wild Card, Divisional, Conference Championship, and Super Bowl
- **Local Storage**: Your picks are automatically saved and restored on page reload
- **Export/Import**: Export your bracket as JSON or import a previously saved bracket
- **Randomize Picks**: Quickly fill out the bracket with random picks for testing
- **Reset Options**: Reset picks or reset the entire bracket

## How It Works

### Playoff Structure

Each conference (AFC and NFC) has 7 seeds:

- **Wild Card Round**: Seeds 2-7 play (2v7, 3v6, 4v5). Seed 1 gets a bye.
- **Divisional Round**: Seed 1 plays the lowest remaining seed. The other two remaining teams play each other. Higher seed hosts.
- **Conference Championship**: Remaining two teams play. Higher seed hosts.
- **Super Bowl**: AFC champion vs NFC champion (neutral site).

### Reseeding

After each round, teams are reseeded based on their original seed numbers. The lowest remaining seed (highest seed number) plays the highest remaining seed (lowest seed number).

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript**
- **Tailwind CSS**
- **React Context** for state management
- **localStorage** for persistence

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Enter Seeds**: Fill in team names for seeds 1-7 in both AFC and NFC columns
2. **Generate Bracket**: Click "Generate Bracket" to create the initial bracket
3. **Make Picks**: Click on teams to pick winners for each game
4. **Advance Rounds**: As you pick winners, the next round games are automatically generated with proper reseeding
5. **Save/Export**: Your picks are automatically saved to localStorage. Use "Export JSON" to save a backup
6. **Import**: Use "Import JSON" to restore a previously saved bracket

## Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout with BracketProvider
│   ├── page.tsx         # Main page component
│   └── globals.css      # Global styles
├── components/
│   ├── SeedEntry.tsx    # Seed input form
│   ├── BracketView.tsx  # Bracket display component
│   └── Controls.tsx     # Control buttons (reset, export, etc.)
├── context/
│   └── BracketContext.tsx # State management context
├── lib/
│   └── bracket.ts       # Pure bracket logic functions
└── types.ts             # TypeScript type definitions
```

## Key Functions

- `generateBracket(teams)`: Creates initial bracket with Wild Card games
- `makeWildCardGames(teams, conf)`: Generates Wild Card matchups
- `computeDivisionalGames(state, conf)`: Computes Divisional round with reseeding
- `computeConferenceChampionship(state, conf)`: Computes Conference Championship
- `computeSuperBowl(state)`: Computes Super Bowl matchup
- `setGameWinner(state, gameId, winnerId)`: Sets winner and recomputes downstream games

## License

MIT
