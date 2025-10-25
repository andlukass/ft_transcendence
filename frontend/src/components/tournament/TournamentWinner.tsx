import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { Button } from "../ui/button";

interface TournamentWinnerProps {
  winner: string;
}

export function TournamentWinner({ winner }: TournamentWinnerProps) {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center">
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <div className="bg-linear-to-r from-yellow-400 to-orange-500 rounded-lg p-8 shadow-lg max-w-md mx-auto">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
        <p className="text-xl text-white font-semibold">{winner}</p>
        <p className="text-lg text-yellow-100 mt-2">is the tournament winner!</p>
      </div>
      <Button onClick={() => window.location.reload()} className="mt-4" size="lg">
        Jogar Novamente
      </Button>
    </div>
  );
}
