"use client";

import { toPng } from "html-to-image";
import { useBracket } from "@/context/BracketContext";

export function Controls() {
  const { state, setState, resetPicks, randomizePicks } = useBracket();

  const handleShare = async () => {
    try {
      const bracketField = document.querySelector<HTMLElement>(".reference-bracket-field");
      if (!bracketField) {
        alert("Could not find bracket to share");
        return;
      }

      // Capture the live field so its container-query dimensions are preserved.
      const dataUrl = await toPng(bracketField, {
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

    </section>
  );
}
