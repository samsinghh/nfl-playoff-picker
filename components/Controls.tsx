"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
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
    } catch {
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
      } catch {
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
    <section className="controls" aria-label="Bracket actions">
      <div className="controls-bar">
        <button
          type="button"
          onClick={resetPicks}
          className="control-button"
        >
          Reset Picks
        </button>

        <button type="button" onClick={randomizePicks} className="control-button">
          Quick Pick
        </button>

        <button
          type="button"
          onClick={handleExport}
          className="control-button"
        >
          Export JSON
        </button>

        <button
          type="button"
          onClick={() => setShowImport(!showImport)}
          className="control-button"
          aria-expanded={showImport}
        >
          Import JSON
        </button>

        <button
          type="button"
          onClick={() => {
            const confirmed = confirm(
              "Are you sure you want to reset the entire bracket? This will clear all teams and games."
            );
            if (confirmed) {
              setState(null);
            }
          }}
          className="control-button control-button--danger"
        >
          Reset Bracket
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="button button--primary controls-share"
        >
          Share Bracket
        </button>
      </div>

      {showImport && (
        <div className="import-panel">
          <label htmlFor="bracket-json">Paste bracket JSON</label>
          <textarea
            id="bracket-json"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste exported bracket data here"
          />
          <div className="import-actions">
            <button
              type="button"
              onClick={handleImport}
              className="button button--primary"
            >
              Import
            </button>
            <button
              type="button"
              onClick={() => {
                setShowImport(false);
                setImportText("");
              }}
              className="button button--secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
