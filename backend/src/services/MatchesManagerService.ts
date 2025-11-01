import { randomUUID } from "node:crypto";
import type * as WebSocket from "ws";
import { MatchService } from "./MatchService";

class MatchesManagerService {
  private ongoingMatches: Map<string, MatchService> = new Map();

  addPlayer(
    playerName: string,
    conn: WebSocket.WebSocket,
    isSinglePlayer?: boolean
  ): string | null {
    // Search for a match with 0 or 1 player
    let availableMatchId: string | null = null;

    if (isSinglePlayer) {
      availableMatchId = randomUUID();
      const match = new MatchService(availableMatchId);
      match.addPlayer({ name: playerName, matchId: availableMatchId, conn });
      match.initMatch(isSinglePlayer);
      this.ongoingMatches.set(availableMatchId, match);
      return availableMatchId;
    }

    for (const [matchId, match] of this.ongoingMatches.entries()) {
      if (!match.getIsStarted()) {
        availableMatchId = matchId;
        break;
      }
    }

    // If no available match found, create a new one
    if (availableMatchId === null) {
      availableMatchId = randomUUID();
      this.ongoingMatches.set(availableMatchId, new MatchService(availableMatchId));
    }

    // Add player to the match
    const match = this.ongoingMatches.get(availableMatchId);
    if (!match) {
      console.error("Failed to get match");
      return null;
    }
    match.addPlayer({ name: playerName, matchId: availableMatchId, conn });

    // If match has 2 players, initialize it
    if (match.getPlayersLength() === 2) {
      match.initMatch();
    }

    return availableMatchId;
  }

  getMatch(matchId: string): MatchService | undefined {
    return this.ongoingMatches.get(matchId);
  }

  getAllMatches(): Map<string, MatchService> {
    return this.ongoingMatches;
  }

  removePlayer(matchId: string, playerName: string): boolean {
    const match = this.ongoingMatches.get(matchId);
    if (!match) {
      console.error(`Match ${matchId} not found`);
      return false;
    }

    // Find and remove the player
    if (!match.removePlayer(playerName)) {
      console.error(`Player ${playerName} not found in match ${matchId}`);
      return false;
    }

    // If no players left, delete the match
    if (match.getPlayersLength() === 0) {
      this.ongoingMatches.delete(matchId);
      console.log(`Match ${matchId} deleted because no players remain`);
      return true;
    }

    match.endMatch(match.getPlayers()[0].name);
    return true;
  }
}

export const matchesService = new MatchesManagerService();
