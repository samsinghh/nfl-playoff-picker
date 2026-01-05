"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { useBracket } from "@/context/BracketContext";

export function Controls() {
  const { state, setState, resetPicks, exportBracket, importBracket } =
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

  const handleShare = async () => {
    try {
      const bracketElement = document.getElementById("bracket-container");
      if (!bracketElement) {
        alert("Could not find bracket to share");
        return;
      }

      // Use html-to-image which handles modern CSS better
      const dataUrl = await toPng(bracketElement, {
        backgroundColor: "#0a0a0a",
        pixelRatio: 2,
        quality: 1,
      });

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      try {
        // Copy to clipboard
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        alert("Bracket image copied to clipboard! You can paste it anywhere.");
      } catch (err) {
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "nfl-bracket.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert("Bracket image downloaded! Clipboard access not available in this browser.");
      }
    } catch (error) {
      console.error("Error sharing bracket:", error);
      alert("Failed to share bracket. Please try again.");
    }
  };

  if (!state) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-wrap gap-4 justify-center bg-[#1a1a1a] border border-gray-800 rounded-sm p-4 shadow-2xl">
        <button
          onClick={resetPicks}
          className="px-4 py-2 bg-[#2a2a2a] text-white border border-gray-700 font-bold uppercase italic text-xs tracking-wider hover:bg-[#333333] transition-colors"
        >
          Reset Picks
        </button>

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#2a2a2a] text-white border border-gray-700 font-bold uppercase italic text-xs tracking-wider hover:bg-[#333333] transition-colors"
        >
          Export JSON
        </button>

        <button
          onClick={() => setShowImport(!showImport)}
          className="px-4 py-2 bg-[#2a2a2a] text-white border border-gray-700 font-bold uppercase italic text-xs tracking-wider hover:bg-[#333333] transition-colors"
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
          className="px-4 py-2 bg-gray-800 text-white font-bold uppercase italic text-xs tracking-wider hover:bg-black transition-colors border border-gray-700"
        >
          Reset Bracket
        </button>

        <button
          onClick={handleShare}
          className="px-4 py-2 bg-red-600 text-white font-bold uppercase italic text-xs tracking-wider hover:bg-red-700 shadow-lg transition-colors border border-red-700"
        >
          Share Bracket
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

