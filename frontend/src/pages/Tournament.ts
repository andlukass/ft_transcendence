import { PlayersSelection } from "../components/tournament/PlayersSelection";
import { Matchups, type Matchup } from "../components/tournament/Matchups";
import { TournamentGame } from "../components/tournament/TournamentGame";
import { TournamentWinner } from "../components/tournament/TournamentWinner";

const TITLES = {
  selection: "Tournament",
  result: "Tournament Result",
  matchups: "Tournament Matchups",
  tournament: "Tournament Game",
};

const DESCRIPTIONS = {
  selection: "Enter the names of the 4 players who will participate in the tournament.",
  result: "",
  matchups: "Here are the matchups for the tournament. Click 'Start Match' to begin each game.",
  tournament:
    "The tournament game is starting. Click on the player to select the winner of the game.",
};

export function Tournament(): HTMLElement {
  const container = document.createElement("div");
  container.className = "px-4 py-6 sm:px-0";

  let step: "selection" | "result" | "matchups" | "tournament" = "selection";
  let winner: string | null = null;
  let matchups: Matchup[] = [];
  let currentMatchup: Matchup | null = null;

  const updateView = () => {
    const title = document.createElement("h1");
    title.className = "text-4xl font-bold text-gray-900 mb-6";
    title.textContent = TITLES[step];

    const description = document.createElement("p");
    description.className = "text-xl text-gray-600 mb-8 max-w-2xl mx-auto";
    description.textContent = DESCRIPTIONS[step];

    container.innerHTML = "";
    const innerDiv = document.createElement("div");
    innerDiv.className = "text-center";
    innerDiv.appendChild(title);
    innerDiv.appendChild(description);

    if (step === "selection") {
      const playersSel = PlayersSelection({
        onStartTournament: handleStartTournament,
      });
      innerDiv.appendChild(playersSel);
    } else if (step === "tournament" && currentMatchup) {
      const game = TournamentGame({
        player1: currentMatchup.player1,
        player2: currentMatchup.player2,
        onWinnerSelect: currentMatchup.id === "final" ? handleWinner : handleMatchWinner,
      });
      innerDiv.appendChild(game);
    } else if (step === "matchups") {
      const matches = Matchups({ matchups, onStartMatch: handleStartMatch });
      innerDiv.appendChild(matches);
    } else if (step === "result" && winner) {
      const winnerComp = TournamentWinner(winner);
      innerDiv.appendChild(winnerComp);
    }

    container.appendChild(innerDiv);
  };

  const handleStartTournament = (players: string[]) => {
    const tournamentMatchups: Matchup[] = [
      {
        id: "match-1",
        player1: players[0],
        player2: players[1],
      },
      {
        id: "match-2",
        player1: players[2],
        player2: players[3],
      },
    ];

    matchups = tournamentMatchups;
    step = "matchups";
    updateView();
  };

  const handleStartMatch = (matchup: Matchup) => {
    currentMatchup = matchup;
    step = "tournament";
    updateView();
  };

  const handleMatchWinner = (winnerName: string) => {
    if (!currentMatchup) return;

    const currentId = currentMatchup.id;
    const updatedMatchups = matchups.map((matchup) =>
      matchup.id === currentId ? { ...matchup, winner: winnerName } : matchup
    );

    matchups = updatedMatchups;
    currentMatchup = null;
    step = "matchups";

    const allMatchupsCompleted = updatedMatchups.every((matchup) => matchup.winner);
    if (allMatchupsCompleted) {
      const finalMatchup: Matchup = {
        id: "final",
        player1: updatedMatchups[0].winner || "",
        player2: updatedMatchups[1].winner || "",
      };
      matchups = [...updatedMatchups, finalMatchup];
    }

    updateView();
  };

  const handleWinner = (winnerName: string) => {
    step = "result";
    winner = winnerName;
    updateView();
  };

  updateView();
  return container;
}
