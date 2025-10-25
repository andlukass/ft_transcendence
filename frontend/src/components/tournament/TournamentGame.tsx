import { Button } from "../ui/button";

interface TournamentGameProps {
  player1: string;
  player2: string;
  onWinnerSelect: (winner: string) => void;
}

export function TournamentGame({ player1, player2, onWinnerSelect }: TournamentGameProps) {
  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gray-800 rounded-lg">
      <div className="flex gap-4">
        <Button onClick={() => onWinnerSelect(player1)} className="min-w-[120px]">
          {player1}
        </Button>

        <Button onClick={() => onWinnerSelect(player2)} className="min-w-[120px]">
          {player2}
        </Button>
      </div>
    </div>
  );
}
