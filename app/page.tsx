"use client";

import { SeedEntry } from "@/components/SeedEntry";
import { BracketView } from "@/components/BracketView";
import { Controls } from "@/components/Controls";
import { useBracket } from "@/context/BracketContext";

export default function Home() {
  const { state } = useBracket();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        {!state ? (
          <SeedEntry />
        ) : (
          <>
            <BracketView />
            <div className="mt-8">
              <Controls />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
