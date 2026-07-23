"use client";

import { SeedEntry } from "@/components/SeedEntry";
import { BracketView } from "@/components/BracketView";
import { Controls } from "@/components/Controls";
import { useBracket } from "@/context/BracketContext";

export default function Home() {
  const { state } = useBracket();

  return (
    <main className="app-shell">
      <div className={`app-content${state ? " app-content--bracket" : ""}`}>
        {!state ? (
          <SeedEntry />
        ) : (
          <>
            <BracketView />
            <Controls />
          </>
        )}
      </div>
    </main>
  );
}
