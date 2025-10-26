import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TournamentWinner } from "../components/tournament/TournamentWinner";

export const Route = createFileRoute("/match")({
  component: Match,
});

function Match() {
  const [matchId, setMatchId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectToMatch = () => {
    if (!playerName.trim()) {
      setError("Player name is required");
      return;
    }

    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      setError(null);
      const ws = new WebSocket(
        `ws://localhost:3000/match?playerName=${encodeURIComponent(playerName.trim())}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received data:", data);

          if (data.matchId) {
            setMatchId(data.matchId);
            console.log("Match ID:", data.matchId);
          } else if (data.error) {
            setError(data.error);
          } else if (data.winner) {
            setWinner(data.winner);
            console.log("Winner:", data.winner);
          }
        } catch (err) {
          console.error("Error parsing message:", err);
          setError("Failed to parse server response");
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("Failed to connect to server");
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        wsRef.current = null;
      };
    } catch (err) {
      console.error("Error connecting to WebSocket:", err);
      setError("Failed to establish connection");
    }
  };

  if (winner) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">
          <TournamentWinner winner={winner} />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Match</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Welcome to the match page! This is where your gaming matches will be displayed.
        </p>

        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          {/* Connection Input */}
          <div className="mb-8">
            <div className="flex gap-4 justify-center">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your player name"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={connectToMatch}
                disabled={isConnected}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                {isConnected ? "Connected" : "Find Match"}
              </button>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>

          {/* Connection Status */}
          <div className="mb-6">
            <p className={`text-lg ${isConnected ? "text-green-600" : "text-gray-600"}`}>
              Status: {isConnected ? "🟢 Connected" : "⚪ Disconnected"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-blue-600 text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Match</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                {matchId ? (
                  <div>
                    <p className="text-green-600 font-semibold mb-2">Match ID:</p>
                    <p className="text-gray-900 break-all">{matchId}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">No active match</p>
                )}
              </div>
            </div>

            <div className="text-center">
              <div className="text-green-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Match History</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600">No matches played yet</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={connectToMatch}
              disabled={isConnected}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors mr-4"
            >
              Find Match
            </button>
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              View Statistics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
