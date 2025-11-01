import type * as WebSocket from "ws";

type GameState = {};

export interface Player {
  name: string;
  matchId: string;
  conn: WebSocket.WebSocket;
}

export class MatchService {
  readonly matchId: string;
  private players: Player[] = [];
  private init: Date | null = null;
  private winner?: string;

  constructor(matchId: string) {
    this.matchId = matchId;
  }

  addPlayer(player: Player): void {
    this.players.push(player);
  }

  getInit(): Date | null {
    return this.init;
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

  initMatch(): void {
    this.init = new Date();
    console.log(`Match ${this.matchId} initialized with 2 players`);
  }

  endMatch(winnerName: string): void {
    // Send winner to all players of the match
    for (const player of this.players) {
      player.conn.send(JSON.stringify({ type: "winner", winner: winnerName }));
    }

    this.winner = winnerName;
    console.log(`Match ${this.matchId} ended. Winner: ${winnerName}`);
  }
}
