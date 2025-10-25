import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

interface Matchup {
  id: string;
  player1: string;
  player2: string;
  winner?: string;
}

interface MatchupsProps {
  matchups: Matchup[];
  onStartMatch: (matchup: Matchup) => void;
}

export function Matchups({ matchups, onStartMatch }: MatchupsProps) {
  const hasFinalMatchup = matchups.some((matchup) => matchup.id === "final");
  return (
    <div className="max-w-4xl mx-auto">
      <div
        className={cn(
          "sm:grid gap-6 sm:grid-cols-2 flex flex-col",
          hasFinalMatchup && "flex-col-reverse"
        )}
      >
        {matchups.map((matchup, index) => (
          <div
            key={matchup.id}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {matchup.id === "final" ? "Final" : `Match ${index + 1}`}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{matchup.player1}</span>
                  <span className="text-gray-400">vs</span>
                  <span className="font-medium text-gray-700">{matchup.player2}</span>
                </div>

                {matchup.winner ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">Winner: {matchup.winner}</p>
                  </div>
                ) : (
                  <Button onClick={() => onStartMatch(matchup)} className="w-full">
                    Start Match
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
