import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export interface Matchup {
  id: string;
  player1: string;
  player2: string;
  winner?: string;
}

export interface MatchupsProps {
  matchups: Matchup[];
  onStartMatch: (matchup: Matchup) => void;
}

export function Matchups({ matchups, onStartMatch }: MatchupsProps): HTMLElement {
  const hasFinalMatchup = matchups.some((matchup) => matchup.id === "final");

  const container = document.createElement("div");
  container.className = "max-w-4xl mx-auto";

  const grid = document.createElement("div");
  grid.className = cn(
    "sm:grid gap-6 sm:grid-cols-2 flex flex-col",
    hasFinalMatchup && "flex-col-reverse"
  );

  matchups.forEach((matchup, index) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow";

    const title = document.createElement("h3");
    title.className = "text-xl font-semibold text-gray-800 mb-4 text-center";
    title.textContent = matchup.id === "final" ? "Final" : `Match ${index + 1}`;

    const playersDiv = document.createElement("div");
    playersDiv.className = "space-y-3";

    const playersInfo = document.createElement("div");
    playersInfo.className = "flex items-center justify-between p-3 bg-gray-50 rounded-lg";

    const span1 = document.createElement("span");
    span1.className = "font-medium text-gray-700";
    span1.textContent = matchup.player1;

    const vs = document.createElement("span");
    vs.className = "text-gray-400";
    vs.textContent = "vs";

    const span2 = document.createElement("span");
    span2.className = "font-medium text-gray-700";
    span2.textContent = matchup.player2;

    playersInfo.appendChild(span1);
    playersInfo.appendChild(vs);
    playersInfo.appendChild(span2);

    playersDiv.appendChild(playersInfo);

    if (matchup.winner) {
      const winnerDiv = document.createElement("div");
      winnerDiv.className = "p-3 bg-green-50 border border-green-200 rounded-lg";

      const winnerText = document.createElement("p");
      winnerText.className = "text-green-800 font-medium";
      winnerText.textContent = `Winner: ${matchup.winner}`;

      winnerDiv.appendChild(winnerText);
      playersDiv.appendChild(winnerDiv);
    } else {
      const button = Button({
        text: "Start Match",
        onClick: () => onStartMatch(matchup),
        className: "w-full",
      });
      playersDiv.appendChild(button);
    }

    card.appendChild(title);
    card.appendChild(playersDiv);

    const innerCard = document.createElement("div");
    innerCard.className = "text-center";
    innerCard.appendChild(title);
    innerCard.appendChild(playersDiv);

    card.appendChild(innerCard);
    grid.appendChild(card);
  });

  container.appendChild(grid);
  return container;
}
