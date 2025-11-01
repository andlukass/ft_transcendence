import readline from "node:readline";
import type { RawData } from "ws";
import WebSocket from "ws";

// Types for game state and messages
interface GameState {
  leftPaddle: { y: number };
  rightPaddle: { y: number };
  ball: { x: number; y: number };
  score: { left: number; right: number };
}

interface WebSocketMessage {
  matchId?: string;
  playerName?: string;
  error?: string;
  type?: "gameState" | "winner" | "movePlayer";
  gameState?: GameState;
  winner?: string;
  move?: "up" | "down";
}

// Get playerName from command line arguments
const playerName = process.argv[2];

if (!playerName) {
  console.error("Usage: node index.js <playerName>");
  process.exit(1);
}

const WS_URL = "ws://localhost:3000/match";
const ws = new WebSocket(`${WS_URL}?playerName=${playerName}`);

let matchId: string | null = null;
let isConnected = false;

// Setup readline interface for keyboard input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Handle keyboard input
process.stdin.on("data", (key: Buffer): void => {
  if (!isConnected || !matchId) return;

  const keyStr = key.toString();
  let move: "up" | "down" | null = null;

  // Handle arrow keys and WASD
  if (keyStr === "\u001b[A" || keyStr === "w" || keyStr === "W") {
    // Arrow Up or W
    move = "up";
  } else if (keyStr === "\u001b[B" || keyStr === "s" || keyStr === "S") {
    // Arrow Down or S
    move = "down";
  } else if (keyStr === "\u0003") {
    // Ctrl+C
    console.log("\n\nDisconnecting...");
    ws.close();
    rl.close();
    process.exit(0);
  }

  if (move && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "movePlayer", move }));
  }
});

// WebSocket event handlers
ws.on("open", (): void => {
  console.log(`\n🟢 Connected as ${playerName}`);
  console.log("Waiting for match to start...\n");
});

ws.on("message", (data: RawData): void => {
  try {
    const message: WebSocketMessage = JSON.parse(data.toString());

    if (message.matchId) {
      matchId = message.matchId;
      console.log(`✅ Match ID: ${matchId}`);
      console.log(`Player: ${message.playerName || playerName}\n`);
      isConnected = true;
    }

    if (message.error) {
      console.error(`\n❌ Error: ${message.error}`);
      rl.close();
      ws.close();
      process.exit(1);
    }

    if (message.type === "gameState" && message.gameState) {
      displayGameState(message.gameState);
    }

    if (message.type === "winner" && message.winner) {
      console.log(`\n\n🏆 Winner: ${message.winner}`);
      console.log(`\nGame Over!`);
      rl.close();
      ws.close();
      process.exit(0);
    }
  } catch (err) {
    console.error("Error parsing message:", err);
  }
});

ws.on("error", (error: Error): void => {
  console.error(`\n❌ WebSocket error:`, error.message);
  ws.close();
  rl.close();
  process.exit(1);
});

ws.on("close", (): void => {
  console.log("\n\n🔴 Disconnected from server");
  rl.close();
  process.exit(0);
});

// Display game state
function displayGameState(state: GameState): void {
  // Validate state structure
  if (!state || !state.leftPaddle || !state.rightPaddle || !state.ball || !state.score) {
    console.log("Waiting for game state...");
    return;
  }

  console.clear();
  console.log(`\n=== Match: ${matchId} ===`);
  console.log(`Player: ${playerName}\n`);

  // Score
  console.log(`Score: ${state.score.left} - ${state.score.right}\n`);

  // Game dimensions from backend
  const GAME_WIDTH = 1000;
  const GAME_HEIGHT = 500;
  const PADDLE_HEIGHT = 100;

  // Draw game board
  const canvasWidth = 80;
  const canvasHeight = 20;

  // Create canvas
  const canvas: string[][] = Array(canvasHeight)
    .fill(null)
    .map(() => Array(canvasWidth).fill(" "));

  // Normalize paddle positions (coords are in pixels, 0-500 for height)
  const leftPaddleY = Math.floor((state.leftPaddle.y / GAME_HEIGHT) * canvasHeight);
  const rightPaddleY = Math.floor((state.rightPaddle.y / GAME_HEIGHT) * canvasHeight);
  const paddleDisplayHeightNormalized = Math.floor((PADDLE_HEIGHT / GAME_HEIGHT) * canvasHeight);

  // Draw paddles
  for (let i = 0; i < paddleDisplayHeightNormalized; i++) {
    const y = Math.max(0, Math.min(canvasHeight - 1, leftPaddleY + i));
    if (y >= 0 && y < canvasHeight) {
      canvas[y][0] = "|";
    }

    const y2 = Math.max(0, Math.min(canvasHeight - 1, rightPaddleY + i));
    if (y2 >= 0 && y2 < canvasHeight) {
      canvas[y2][canvasWidth - 1] = "|";
    }
  }

  // Draw ball (normalize coordinates)
  const ballX = Math.floor((state.ball.x / GAME_WIDTH) * canvasWidth);
  const ballY = Math.floor((state.ball.y / GAME_HEIGHT) * canvasHeight);
  if (ballX >= 0 && ballX < canvasWidth && ballY >= 0 && ballY < canvasHeight) {
    canvas[ballY][ballX] = "o";
  }

  // Draw center line
  for (let y = 0; y < canvasHeight; y++) {
    canvas[y][Math.floor(canvasWidth / 2)] = "|";
  }

  // Print canvas
  console.log(`┌${"─".repeat(canvasWidth)}┐`);
  for (const row of canvas) {
    console.log(`│${row.join("")}│`);
  }
  console.log(`└${"─".repeat(canvasWidth)}┘`);

  console.log("\nControls:");
  console.log("  W / ↑ - Move up");
  console.log("  S / ↓ - Move down");
  console.log("  Ctrl+C - Exit\n");
}

// Handle process termination
process.on("SIGINT", (): void => {
  console.log("\n\nDisconnecting...");
  ws.close();
  rl.close();
  process.exit(0);
});
