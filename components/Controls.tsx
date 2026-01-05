"use client";

import { useState } from "react";
import { useBracket } from "@/context/BracketContext";

export function Controls() {
  const { state, setState, resetPicks, randomizePicks, exportBracket, importBracket } =
    useBracket();
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");

  const handleExport = () => {
    const json = exportBracket();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nfl-bracket.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      importBracket(importText);
      setShowImport(false);
      setImportText("");
      alert("Bracket imported successfully!");
    } catch (error) {
      alert("Failed to import bracket. Please check the JSON format.");
    }
  };

  if (!state) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={resetPicks}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reset Picks
        </button>

        <button
          onClick={randomizePicks}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Randomize Picks
        </button>

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Export JSON
        </button>

        <button
          onClick={() => setShowImport(!showImport)}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Import JSON
        </button>

        <button
          onClick={() => {
            const confirmed = confirm(
              "Are you sure you want to reset the entire bracket? This will clear all teams and games."
            );
            if (confirmed) {
              setState(null);
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Reset Bracket
        </button>
      </div>

      {showImport && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste JSON bracket data here..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm text-black placeholder-gray-500"
          />
          <div className="mt-3 flex gap-3">
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Import
            </button>
            <button
              onClick={() => {
                setShowImport(false);
                setImportText("");
              }}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

