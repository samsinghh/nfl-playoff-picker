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
