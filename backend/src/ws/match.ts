import type { FastifyInstance } from "fastify";
import type * as WebSocket from "ws";
import { matchesService } from "../services/MatchesService";

interface MatchResponse {
	matchId?: string;
	playerName?: string;
	error?: string;
}

const connections = new Map<string, WebSocket.WebSocket>();

export default async function (fastify: FastifyInstance) {
	fastify.get("/match", { websocket: true }, (conn, req) => {
		const { playerName } = req.query as { playerName?: string };
		if (!playerName) {
			conn.close(1008, "Player name is required");
			return;
		}
		const formattedPlayerName = playerName.trim();
		if (connections.has(formattedPlayerName)) {
			conn.close(1008, "Player already connected");
			return;
		}
		const matchId = matchesService.addPlayer(formattedPlayerName, conn);
		if (!matchId) {
			conn.close(1011, "Failed to create or join match");
			return;
		}
		connections.set(formattedPlayerName, conn);
		console.log(`Player ${formattedPlayerName} joined match ${matchId}`);

		conn.send(JSON.stringify({ matchId, playerName } as MatchResponse));

		conn.on("message", (raw: Buffer) => {
			// processa comandos posteriores
		});

		conn.on("close", () => {
			matchesService.removePlayer(matchId, formattedPlayerName);
			connections.delete(formattedPlayerName);
		});

		conn.on("error", (err: Error) => {
			console.error(err);
			matchesService.removePlayer(matchId, formattedPlayerName);
			connections.delete(formattedPlayerName);
			conn.close(1011, "Socket error");
		});
	});
}
