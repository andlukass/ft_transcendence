import type * as WebSocket from "ws";
import { GameService, GameState } from "./GameService";

export interface Player {
  name: string;
  matchId: string;
  conn: WebSocket.WebSocket;
}

export class MatchService {
  readonly matchId: string;
  private players: Player[] = [];
  private winner?: string;
  private game: GameService | null = null;

  constructor(matchId: string) {
    this.matchId = matchId;
  }

  addPlayer(player: Player): void {
    this.players.push(player);
  }

  getWinner(): string | undefined {
    return this.winner;
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getPlayersLength(): number {
    return this.players.length;
  }

  removePlayer(name: string): boolean {
    const player = this.players.find((player) => player.name === name);
    if (!player) return false;
    this.players = this.players.filter((player) => player.name !== name);
    return true;
  }

  movePlayer(name: string, move: "up" | "down"): void {
    if (!this.game) return;
    const playerIndex = this.players.findIndex((player) => player.name === name);
    if (playerIndex === -1) return;
    const side = playerIndex === 0 ? "left" : "right";
    this.game.updatePaddle(side, move);
  }

  getGameState(): GameState | null {
    if (!this.game) return null;
    return this.game.getGameState();
  }

  async initMatch(): Promise<void> {
    this.game = new GameService();
    console.log(`Match ${this.matchId} initialized with 2 players`);

    while (!this.game.getGameState().isEnded) {
      for (const player of this.players) {
        player.conn.send(
          JSON.stringify({ type: "gameState", gameState: this.game.getGameState() })
        );
      }
      this.game.updateBall();
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }

  endMatch(winnerName: string): void {
    // Send winner to all players of the match
    for (const player of this.players) {
      player.conn.send(JSON.stringify({ type: "winner", winner: winnerName }));
    }
    if (this.game) {
      this.game.endGame();
    }
    this.winner = winnerName;
    console.log(`Match ${this.matchId} ended. Winner: ${winnerName}`);
  }
}
