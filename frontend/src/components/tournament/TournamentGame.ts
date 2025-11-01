import { Button } from "../ui/button";

export interface TournamentGameProps {
  player1: string;
  player2: string;
  onWinnerSelect: (winner: string) => void;
}

export function TournamentGame({
  player1,
  player2,
  onWinnerSelect,
}: TournamentGameProps): HTMLElement {
  const container = document.createElement("div");
  container.className = "flex flex-col items-center gap-6 p-6 bg-gray-800 rounded-lg";

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "flex gap-4";

  const btn1 = Button({
    text: player1,
    onClick: () => onWinnerSelect(player1),
    className: "min-w-[120px]",
  });

  const btn2 = Button({
    text: player2,
    onClick: () => onWinnerSelect(player2),
    className: "min-w-[120px]",
  });

  buttonsDiv.appendChild(btn1);
  buttonsDiv.appendChild(btn2);
  container.appendChild(buttonsDiv);

  return container;
}
