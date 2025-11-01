const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;

const PADDLE_SPEED = 40;
const BALL_RADIUS = 10;

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 500;

export const MAX_SCORE = 7;

const AI_MOVE_DELAY_MS = 200;

export type Paddle = {
  x: number;
  y: number;
};

export type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
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
  isSinglePlayer: boolean;
};

export class GameService {
  private leftPaddle: Paddle;
  private rightPaddle: Paddle;
  private score: Score;
  private ball: Ball;
  private isEnded: boolean;
  private isSinglePlayer: boolean;
  private lastAIMoveTime: number = 0;

  constructor(isSinglePlayer: boolean = false) {
    const paddleY = (GAME_HEIGHT - PADDLE_HEIGHT) / 2;
    this.isSinglePlayer = isSinglePlayer;
    this.leftPaddle = { x: 0, y: paddleY };
    this.rightPaddle = { x: GAME_WIDTH - PADDLE_WIDTH, y: paddleY };
    this.score = { left: 0, right: 0 };
    this.ball = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, vx: 0, vy: 0, speed: 20 };
    this.isEnded = false;
    this.resetBallAndPaddles();
    this.startBall();
  }

  updateBall(): void {
    // Atualiza a posição da bola baseada na velocidade
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;
    this.ball.speed += 0.1;

    // Colisão com paredes superior e inferior (bounce)
    if (this.ball.y - BALL_RADIUS <= 0) {
      this.ball.y = BALL_RADIUS;
      this.ball.vy = -this.ball.vy;
    } else if (this.ball.y + BALL_RADIUS >= GAME_HEIGHT) {
      this.ball.y = GAME_HEIGHT - BALL_RADIUS;
      this.ball.vy = -this.ball.vy;
    }

    // Verifica colisão com paddles ANTES de verificar paredes laterais
    // Colisão com paddle esquerdo
    if (
      this.ball.x - BALL_RADIUS <= PADDLE_WIDTH &&
      this.ball.y >= this.leftPaddle.y &&
      this.ball.y <= this.leftPaddle.y + PADDLE_HEIGHT &&
      this.ball.vx < 0
    ) {
      this.ball.x = PADDLE_WIDTH + BALL_RADIUS;

      // Ajusta vy baseado na posição de impacto no paddle
      const hitPos = (this.ball.y - this.leftPaddle.y) / PADDLE_HEIGHT; // 0 a 1
      const angle = ((hitPos - 0.5) * Math.PI) / 3; // -60° a +60°
      this.ball.vx = Math.abs(Math.cos(angle)) * this.ball.speed;
      this.ball.vy = Math.sin(angle) * this.ball.speed;
      return; // Sai da função, não marca ponto
    }

    // Colisão com paddle direito
    if (
      this.ball.x + BALL_RADIUS >= GAME_WIDTH - PADDLE_WIDTH &&
      this.ball.y >= this.rightPaddle.y &&
      this.ball.y <= this.rightPaddle.y + PADDLE_HEIGHT &&
      this.ball.vx > 0
    ) {
      this.ball.x = GAME_WIDTH - PADDLE_WIDTH - BALL_RADIUS;

      // Ajusta vy baseado na posição de impacto no paddle
      const hitPos = (this.ball.y - this.rightPaddle.y) / PADDLE_HEIGHT; // 0 a 1
      const angle = ((hitPos - 0.5) * Math.PI) / 3; // -60° a +60°
      this.ball.vx = -Math.abs(Math.cos(angle)) * this.ball.speed;
      this.ball.vy = Math.sin(angle) * this.ball.speed;
      return; // Sai da função, não marca ponto
    }

    // Só marca ponto se passou pela parede SEM bater no paddle
    // Colisão com parede esquerda (ponto para direita)
    if (this.ball.x - BALL_RADIUS <= 0) {
      this.score.right++;
      this.resetBallAndPaddles();
      return;
    }

    // Colisão com parede direita (ponto para esquerda)
    if (this.ball.x + BALL_RADIUS >= GAME_WIDTH) {
      this.score.left++;
      this.resetBallAndPaddles();
      return;
    }
  }

  private resetBallAndPaddles(): void {
    // Reseta a posição dos paddles
    const paddleY = (GAME_HEIGHT - PADDLE_HEIGHT) / 2;
    this.leftPaddle = { x: 0, y: paddleY };
    this.rightPaddle = { x: GAME_WIDTH - PADDLE_WIDTH, y: paddleY };

    // Reseta a bola para o centro
    this.ball = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2, vx: 0, vy: 0, speed: 20 };
    this.startBall();
  }

  private startBall(): void {
    // Define uma velocidade inicial aleatória
    // Escolhe uma direção aleatória (esquerda ou direita)
    const direction = Math.random() < 0.5 ? -1 : 1;
    // Define um ângulo aleatório entre -30° e +30°
    const angle = ((Math.random() - 0.5) * Math.PI) / 3;

    this.ball.vx = direction * Math.cos(angle) * this.ball.speed;
    this.ball.vy = Math.sin(angle) * this.ball.speed;
  }

  moveAI() {
    const state = this.getGameState();
    if (!state.isSinglePlayer) return;

    const { ball, rightPaddle } = state;

    // só reage se a bola estiver vindo pra direita
    if (ball.vx <= 0) return;

    const paddleCenter = rightPaddle.y + 50; // metade do paddle
    const distance = ball.y - paddleCenter;

    // se já está quase alinhado, não faz nada
    if (Math.abs(distance) < 10) return;

    // Verifica se passou tempo suficiente desde a última movimentação
    const now = Date.now();
    if (now - this.lastAIMoveTime < AI_MOVE_DELAY_MS) return;

    // chance pequena de "errar" e não mover
    if (Math.random() < 0.05) return;

    // move um passo na direção da bola
    this.updatePaddle("right", distance < 0 ? "up" : "down");
    this.lastAIMoveTime = now;
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
      isSinglePlayer: this.isSinglePlayer,
    };
  }
}
