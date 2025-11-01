import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface PlayersSelectionProps {
  onStartTournament: (players: string[]) => void;
}

export function PlayersSelection({ onStartTournament }: PlayersSelectionProps): HTMLElement {
  const container = document.createElement("div");
  container.className = "bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto";

  const icon = document.createElement("div");
  icon.className = "text-blue-600 text-4xl mb-6";
  icon.textContent = "🏆";
  container.appendChild(icon);

  const formDiv = document.createElement("div");
  formDiv.className = "space-y-4";

  const players: string[] = ["", "", "", ""];

  for (let i = 0; i < 4; i++) {
    const inputEl = Input({
      label: `Player ${i + 1}`,
      type: "text",
      value: players[i],
      placeholder: `Enter Player ${i + 1} name`,
      maxLength: 20,
      onChange: (value) => {
        players[i] = value;
      },
    });
    formDiv.appendChild(inputEl);
  }

  const buttonDiv = document.createElement("div");
  buttonDiv.className = "mt-8";

  const button = Button({
    text: "Start Tournament",
    onClick: () => {
      const validPlayers = players.filter((player) => player.trim() !== "");

      if (validPlayers.length !== 4) {
        alert("Please fill in all 4 player names");
        return;
      }

      const trimmedPlayers = validPlayers.map((player) => player.trim());
      const uniquePlayers = new Set(trimmedPlayers);

      if (uniquePlayers.size !== trimmedPlayers.length) {
        alert("Player names must be unique. Please check for duplicates.");
        return;
      }

      onStartTournament(trimmedPlayers);
    },
  });

  buttonDiv.appendChild(button);

  container.appendChild(formDiv);
  container.appendChild(buttonDiv);

  return container;
}
