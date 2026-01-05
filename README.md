# NFL Playoffs Bracket

A web application for creating and managing NFL playoffs brackets with automatic reseeding and bracket generation.

<img width="2544" height="1558" alt="image" src="https://github.com/user-attachments/assets/43451ed3-f714-4673-905d-2487b7d4f5c6" />

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
