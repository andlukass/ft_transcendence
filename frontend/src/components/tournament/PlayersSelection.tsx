import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface PlayersSelectionProps {
  onStartTournament: (players: string[]) => void;
}

export function PlayersSelection({ onStartTournament }: PlayersSelectionProps) {
  const [players, setPlayers] = useState(["", "", "", ""]);

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleStartTournament = () => {
    const validPlayers = players.filter((player) => player.trim() !== "");

    if (validPlayers.length !== 4) {
      alert("Please fill in all 4 player names");
      return;
    }

    // Check for duplicate names
    const trimmedPlayers = validPlayers.map((player) => player.trim());
    const uniquePlayers = new Set(trimmedPlayers);

    if (uniquePlayers.size !== trimmedPlayers.length) {
      alert("Player names must be unique. Please check for duplicates.");
      return;
    }

    onStartTournament(trimmedPlayers);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="text-blue-600 text-4xl mb-6">🏆</div>

      <div className="space-y-4">
        {players.map((player, index) => (
          <Input
            key={index}
            label={`Player ${index + 1}`}
            type="text"
            value={player}
            onChange={(e) => handlePlayerChange(index, e.target.value)}
            placeholder={`Enter Player ${index + 1} name`}
            maxLength={20}
          />
        ))}
      </div>

      <div className="mt-8">
        <Button onClick={handleStartTournament}>Start Tournament</Button>
      </div>
    </div>
  );
}
