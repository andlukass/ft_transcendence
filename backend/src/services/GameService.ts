const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;

const PADDLE_SPEED = 20;
const BALL_SPEED = 20;

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 500;

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

export class GameService {
  private leftPaddle: Paddle;
  private rightPaddle: Paddle;
  private score: Score;
  private ball: Ball;
  private isEnded: boolean;

  constructor() {
    const paddleY = (GAME_HEIGHT - PADDLE_HEIGHT) / 2;
    this.leftPaddle = { x: 0, y: paddleY };
    this.rightPaddle = { x: GAME_WIDTH - PADDLE_WIDTH, y: paddleY };
    this.score = { left: 0, right: 0 };
    this.ball = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, vx: 0, vy: 0 };
    this.isEnded = false;
  }

  updatePaddle(paddle: "left" | "right", move: "up" | "down") {
    const target = paddle === "left" ? this.leftPaddle : this.rightPaddle;
    const direction = move === "up" ? -1 : 1;
    const newY = target.y + direction * PADDLE_SPEED;

    if (newY < 0) {
      target.y = 0;
    } else if (newY + PADDLE_HEIGHT > GAME_HEIGHT) {
      target.y = GAME_HEIGHT - PADDLE_HEIGHT;
    } else {
      target.y = newY;
    }
  }

  endGame(): void {
    this.isEnded = true;
  }

  getGameState(): GameState {
    return {
      leftPaddle: this.leftPaddle,
      rightPaddle: this.rightPaddle,
      score: this.score,
      ball: this.ball,
      isEnded: this.isEnded,
    };
  }
}
