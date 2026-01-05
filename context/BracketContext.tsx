"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { BracketState, Team } from "@/types";
import { generateBracket, setGameWinner } from "@/lib/bracket";

interface BracketContextType {
  state: BracketState | null;
  setState: (state: BracketState | null) => void;
  initializeBracket: (teams: Team[]) => void;
  pickWinner: (gameId: string, winnerId: string) => void;
  resetPicks: () => void;
  randomizePicks: () => void;
  exportBracket: () => string;
  importBracket: (json: string) => void;
}

const BracketContext = createContext<BracketContextType | undefined>(undefined);

const STORAGE_KEY = "nfl-bracket-state-v1";

export function BracketProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BracketState | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(parsed);
      }
    } catch (error) {
      console.error("Failed to load bracket from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save bracket to localStorage:", error);
      }
    }
  }, [state]);

  const initializeBracket = useCallback((teams: Team[]) => {
    const newState = generateBracket(teams);
    setState(newState);
  }, []);

  const pickWinner = useCallback((gameId: string, winnerId: string) => {
    if (!state) return;
    try {
      const newState = setGameWinner(state, gameId, winnerId);
      setState(newState);
    } catch (error) {
      console.error("Failed to set game winner:", error);
    }
  }, [state]);

  const resetPicks = useCallback(() => {
    if (!state) return;
    // Regenerate bracket to reset all picks and remove later rounds
    const newState = generateBracket(state.teams);
    setState(newState);
  }, [state]);

  const randomizePicks = useCallback(() => {
    if (!state) return;
    let currentState = { ...state };
    
    // Randomize Wild Card
    const wcGames = currentState.games.filter((g) => g.round === "WC");
    for (const game of wcGames) {
      const winner = Math.random() < 0.5 ? game.home.id : game.away.id;
      currentState = setGameWinner(currentState, game.id, winner);
    }

    // Randomize Divisional
    const divGames = currentState.games.filter((g) => g.round === "DIV");
    for (const game of divGames) {
      const winner = Math.random() < 0.5 ? game.home.id : game.away.id;
      currentState = setGameWinner(currentState, game.id, winner);
    }

    // Randomize Conference Championship
    const confGames = currentState.games.filter((g) => g.round === "CONF");
    for (const game of confGames) {
      const winner = Math.random() < 0.5 ? game.home.id : game.away.id;
      currentState = setGameWinner(currentState, game.id, winner);
    }

    // Randomize Super Bowl
    const sbGames = currentState.games.filter((g) => g.round === "SB");
    for (const game of sbGames) {
      const winner = Math.random() < 0.5 ? game.home.id : game.away.id;
      currentState = setGameWinner(currentState, game.id, winner);
    }

    setState(currentState);
  }, [state]);

  const exportBracket = useCallback(() => {
    if (!state) return "";
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importBracket = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json);
      setState(parsed);
    } catch (error) {
      console.error("Failed to import bracket:", error);
      throw new Error("Invalid JSON format");
    }
  }, []);

  return (
    <BracketContext.Provider
      value={{
        state,
        setState,
        initializeBracket,
        pickWinner,
        resetPicks,
        randomizePicks,
        exportBracket,
        importBracket,
      }}
    >
      {children}
    </BracketContext.Provider>
  );
}

export function useBracket() {
  const context = useContext(BracketContext);
  if (context === undefined) {
    throw new Error("useBracket must be used within a BracketProvider");
  }
  return context;
}

