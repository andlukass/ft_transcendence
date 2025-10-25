import { useState } from "react";
import { Matchups } from "./Matchups";
import { PlayersSelection } from "./PlayersSelection";
import { TournamentGame } from "./TournamentGame";
import { TournamentWinner } from "./TournamentWinner";

interface Matchup {
  id: string;
  player1: string;
  player2: string;
  winner?: string;
}

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

export function Tournament() {
  const [step, setStep] = useState<"selection" | "result" | "matchups" | "tournament">("selection");
  const [winner, setWinner] = useState<string | null>(null);
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [currentMatchup, setCurrentMatchup] = useState<Matchup | null>(null);

  const handleStartTournament = (players: string[]) => {
    // Criar os matchups para o torneio
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

    setMatchups(tournamentMatchups);
    setStep("matchups");
  };

  const handleStartMatch = (matchup: Matchup) => {
    setCurrentMatchup(matchup);
    setStep("tournament");
  };

  const handleMatchWinner = (winner: string) => {
    if (!currentMatchup) return;

    // Atualizar o matchup com o vencedor
    const updatedMatchups = matchups.map((matchup) =>
      matchup.id === currentMatchup.id ? { ...matchup, winner } : matchup
    );

    setMatchups(updatedMatchups);
    setCurrentMatchup(null);
    setStep("matchups");

    // Verificar se todos os matchups foram concluídos
    const allMatchupsCompleted = updatedMatchups.every((matchup) => matchup.winner);
    if (allMatchupsCompleted) {
      // Criar matchup final entre os vencedores
      const finalMatchup: Matchup = {
        id: "final",
        player1: updatedMatchups[0].winner || "",
        player2: updatedMatchups[1].winner || "",
      };
      setMatchups([...updatedMatchups, finalMatchup]);
    }
  };

  const handleWinner = (winner: string) => {
    setStep("result");
    setWinner(winner);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{TITLES[step]}</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{DESCRIPTIONS[step]}</p>

        {step === "selection" && <PlayersSelection onStartTournament={handleStartTournament} />}
        {step === "tournament" && currentMatchup && (
          <TournamentGame
            player1={currentMatchup.player1}
            player2={currentMatchup.player2}
            onWinnerSelect={currentMatchup.id === "final" ? handleWinner : handleMatchWinner}
          />
        )}
        {step === "matchups" && <Matchups matchups={matchups} onStartMatch={handleStartMatch} />}
        {step === "result" && winner && <TournamentWinner winner={winner} />}
      </div>
    </div>
  );
}
