import { Button } from "../ui/button";
import { launchConfetti } from "../../lib/confetti";

export function TournamentWinner(winner: string): HTMLElement {
  const container = document.createElement("div");
  container.className = "text-center";

  container.innerHTML = `
    <div class="bg-linear-to-r from-yellow-400 to-orange-500 rounded-lg p-8 shadow-lg max-w-md mx-auto">
      <div class="text-6xl mb-4">🏆</div>
      <h2 class="text-3xl font-bold text-white mb-4">Congratulations!</h2>
      <p class="text-xl text-white font-semibold">${winner}</p>
      <p class="text-lg text-yellow-100 mt-2">is the tournament winner!</p>
    </div>
  `;

  const buttonDiv = document.createElement("div");
  buttonDiv.className = "mt-4";
  const button = Button({
    text: "Jogar Novamente",
    onClick: () => window.location.reload(),
    size: "lg",
  });
  buttonDiv.appendChild(button);
  container.appendChild(buttonDiv);

  // Launch confetti
  launchConfetti();

  return container;
}
