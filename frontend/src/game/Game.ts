import { getDarkMode } from "../lib/utils";

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
  isDarkMode?: boolean;
}

export function Game({ gameState }: GameProps): HTMLElement {
  const container = document.createElement("div");
  container.className = "flex flex-col items-center justify-center p-6";

  let isDarkMode = getDarkMode();

  // Helper functions to get CSS classes based on dark mode
  const getCanvasClasses = (darkMode: boolean) =>
    darkMode
      ? "bg-gray-900 border-2 border-gray-700 rounded-lg shadow-xl"
      : "bg-white border-2 border-black rounded-lg shadow-xl";

  const getScoreContainerClasses = (darkMode: boolean) =>
    darkMode
      ? "flex justify-between w-full max-w-[1000px] mb-4 text-white text-4xl font-bold"
      : "flex justify-between w-full max-w-[1000px] mb-4 text-black text-4xl font-bold";

  const getScoreBoxClasses = (darkMode: boolean) =>
    darkMode ? "bg-gray-800 px-8 py-4 rounded-lg" : "bg-gray-200 px-8 py-4 rounded-lg";

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  canvas.className = getCanvasClasses(isDarkMode);
  canvas.style.display = "block";

  // Create score display
  const scoreContainer = document.createElement("div");
  scoreContainer.className = getScoreContainerClasses(isDarkMode);

  const leftScore = document.createElement("div");
  leftScore.className = getScoreBoxClasses(isDarkMode);
  leftScore.textContent = gameState.score.left.toString();

  const rightScore = document.createElement("div");
  rightScore.className = getScoreBoxClasses(isDarkMode);
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
    ctx.fillStyle = isDarkMode ? "#111827" : "#FFFFFF"; // gray-900 or white
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw center line
    ctx.strokeStyle = isDarkMode ? "#374151" : "#000000"; // gray-700 or black
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(GAME_WIDTH / 2, 0);
    ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles (black when light mode, white when dark mode)
    ctx.fillStyle = isDarkMode ? "#FFFFFF" : "#000000"; // white or black
    ctx.fillRect(gameState.leftPaddle.x, gameState.leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw right paddle
    ctx.fillRect(gameState.rightPaddle.x, gameState.rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball (black when light mode, white when dark mode)
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = isDarkMode ? "#FFFFFF" : "#000000"; // white or black
    ctx.fill();

    // Update score display
    leftScore.textContent = gameState.score.left.toString();
    rightScore.textContent = gameState.score.right.toString();
  };

  // Function to update dark mode styles
  const updateDarkModeStyles = (darkMode: boolean) => {
    isDarkMode = darkMode;

    // Update all element classes using helper functions
    canvas.className = getCanvasClasses(darkMode);
    scoreContainer.className = getScoreContainerClasses(darkMode);
    leftScore.className = getScoreBoxClasses(darkMode);
    rightScore.className = getScoreBoxClasses(darkMode);

    // Re-render the canvas
    render();
  };

  // Listen for dark mode changes
  const darkModeChangeHandler = ((e: CustomEvent<{ enabled: boolean }>) => {
    updateDarkModeStyles(e.detail.enabled);
  }) as EventListener;

  document.addEventListener("darkModeChange", darkModeChangeHandler);

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
