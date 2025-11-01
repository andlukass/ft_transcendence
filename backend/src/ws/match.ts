import type { FastifyInstance } from "fastify";
import { matchesService } from "../services/MatchesManagerService";

interface MatchResponse {
  matchId?: string;
  playerName?: string;
  error?: string;
}

export default async function (fastify: FastifyInstance) {
  fastify.get("/match", { websocket: true }, (conn, req) => {
    const { playerName, isSinglePlayer } = req.query as {
      playerName?: string;
      isSinglePlayer?: boolean;
    };
    if (!playerName) {
      conn.close(1008, "Player name is required");
      return;
    }
    const formattedPlayerName = playerName.trim();
    const matchId = matchesService.addPlayer(formattedPlayerName, conn, isSinglePlayer);
    if (!matchId) {
      conn.close(1011, "Failed to create or join match");
      return;
    }
    console.log(
      `Player ${formattedPlayerName} joined match ${matchId}, singleplayer1: ${isSinglePlayer}`
    );

    conn.send(JSON.stringify({ matchId, playerName } as MatchResponse));

    conn.on("message", (_raw: Buffer) => {
      const match = matchesService.getMatch(matchId);
      if (!match) {
        conn.close(1011, "Match not found");
        return;
      }

      const message = JSON.parse(_raw.toString());
      if (message.type === "movePlayer") {
        if (message.move !== "up" && message.move !== "down") {
          conn.close(1011, "Invalid move");
          return;
        }
        match.movePlayer(formattedPlayerName, message.move);
      }
    });

    conn.on("close", () => {
      matchesService.removePlayer(matchId, formattedPlayerName);
    });

    conn.on("error", (err: Error) => {
      console.error(err);
      matchesService.removePlayer(matchId, formattedPlayerName);
      conn.close(1011, "Socket error");
    });
  });
}
