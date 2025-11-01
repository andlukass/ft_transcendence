// Constants matching GameService
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 500;
const BALL_RADIUS = 10;

export type Paddle = {
  x: number;
  y: number;
};

export type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export type Score = {
  left: number;
  right: number;
};

export type GameState = {
  leftPaddle: Paddle;
  rightPaddle: Paddle;
  ball: Ball;
  score: Score;
  isEnded: boolean;
};

export interface GameProps {
  gameState: GameState;
}

export function Game({ gameState }: GameProps): HTMLElement {
  const container = document.createElement("div");
  container.className = "flex flex-col items-center justify-center p-6";

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  canvas.className = "bg-gray-900 border-2 border-gray-700 rounded-lg shadow-xl";
  canvas.style.display = "block";

  // Create score display
  const scoreContainer = document.createElement("div");
  scoreContainer.className =
    "flex justify-between w-full max-w-[1000px] mb-4 text-white text-4xl font-bold";

  const leftScore = document.createElement("div");
  leftScore.className = "bg-gray-800 px-8 py-4 rounded-lg";
  leftScore.textContent = gameState.score.left.toString();

  const rightScore = document.createElement("div");
  rightScore.className = "bg-gray-800 px-8 py-4 rounded-lg";
  rightScore.textContent = gameState.score.right.toString();

  scoreContainer.appendChild(leftScore);
  scoreContainer.appendChild(rightScore);

  // Game ended message
  let gameEndedMessage: HTMLElement | null = null;
  if (gameState.isEnded) {
    gameEndedMessage = document.createElement("div");
    gameEndedMessage.className = "mt-4 text-red-500 text-2xl font-bold";
    gameEndedMessage.textContent = "Game Ended";
  }

  // Render function
  const render = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#111827"; // gray-900
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw center line
    ctx.strokeStyle = "#374151"; // gray-700
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(GAME_WIDTH / 2, 0);
    ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw left paddle
    ctx.fillStyle = "#FFFFFF"; // white
    ctx.fillRect(gameState.leftPaddle.x, gameState.leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw right paddle
    ctx.fillRect(gameState.rightPaddle.x, gameState.rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF"; // white
    ctx.fill();

    // Update score display
    leftScore.textContent = gameState.score.left.toString();
    rightScore.textContent = gameState.score.right.toString();
  };

  // Initial render
  render();

  // Set up update function that can be called externally
  const update = (newGameState: GameState) => {
    Object.assign(gameState, newGameState);
    render();

    // Update game ended message
    if (gameState.isEnded && !gameEndedMessage) {
      gameEndedMessage = document.createElement("div");
      gameEndedMessage.className = "mt-4 text-red-500 text-2xl font-bold";
      gameEndedMessage.textContent = "Game Ended";
      container.appendChild(gameEndedMessage);
    } else if (!gameState.isEnded && gameEndedMessage) {
      gameEndedMessage.remove();
      gameEndedMessage = null;
    }
  };

  // Store update function on container for external access
  (container as HTMLElement & { update?: (state: GameState) => void }).update = update;

  // Assemble container
  container.appendChild(scoreContainer);
  container.appendChild(canvas);
  if (gameEndedMessage) {
    container.appendChild(gameEndedMessage);
  }

  return container;
}
