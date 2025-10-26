import { randomUUID } from "node:crypto";
import type * as WebSocket from 'ws';

interface Player {
	name: string;
	matchId: string;
	conn: WebSocket.WebSocket;
}

interface Match {
	players: Player[];
	init: Date;
    winner?: string;
}

class MatchesService {
	private ongoingMatches: Map<string, Match> = new Map();

	addPlayer(playerName: string, conn: WebSocket.WebSocket): string | null {
		// Search for a match with 0 or 1 player
		let availableMatchId: string | null = null;

		for (const [matchId, match] of this.ongoingMatches.entries()) {
			if (match.players.length < 2) {
				availableMatchId = matchId;
				break;
			}
		}

		// If no available match found, create a new one
		if (availableMatchId === null) {
			availableMatchId = randomUUID();
			this.ongoingMatches.set(availableMatchId, {
				players: [],
				init: new Date(),
			});
		}

		// Add player to the match
		const match = this.ongoingMatches.get(availableMatchId);
		if (!match) {
			console.error("Failed to get match");
			return null;
		}
		match.players.push({ name: playerName, matchId: availableMatchId, conn });

		// If match has 2 players, initialize it
		if (match.players.length === 2) {
			this.initMatch(availableMatchId);
		}

		return availableMatchId;
	}

	private initMatch(matchId: string): void {
		const match = this.ongoingMatches.get(matchId);
		if (!match) {
			console.error(`Match ${matchId} not found`);
			return;
		}

		match.init = new Date();
		console.log(`Match ${matchId} initialized with 2 players`);
	}

	getMatch(matchId: string): Match | undefined {
		return this.ongoingMatches.get(matchId);
	}

	getAllMatches(): Map<string, Match> {
		return this.ongoingMatches;
	}

	removePlayer(matchId: string, playerName: string): boolean {
		const match = this.ongoingMatches.get(matchId);
		if (!match) {
			console.error(`Match ${matchId} not found`);
			return false;
		}

		// Find and remove the player
		const playerIndex = match.players.findIndex(
			(player) => player.name === playerName
		);
		if (playerIndex === -1) {
			console.error(`Player ${playerName} not found in match ${matchId}`);
			return false;
		}

		// Remove the player
		match.players.splice(playerIndex, 1);

		// If no players left, delete the match
		if (match.players.length === 0) {
			this.ongoingMatches.delete(matchId);
			console.log(`Match ${matchId} deleted because no players remain`);
			return true;
		}

        this.endMatch(matchId, match.players[0].name);
        return true;
	}

	private endMatch(matchId: string, winnerName: string): void {
		const match = this.ongoingMatches.get(matchId);
		if (!match) {
			console.error(`Match ${matchId} not found`);
			return;
		}

		// Send winner to all players of the match
		for (const player of match.players) {
			player.conn.send(JSON.stringify({ type: 'winner', winner: winnerName }));
		}

		match.winner = winnerName;
		console.log(`Match ${matchId} ended. Winner: ${winnerName}`);
	}
}

export const matchesService = new MatchesService();
export type { Match, Player };

