import { Game, type GameState } from "../../game/Game";
import { isMobile } from "../../lib/utils";
import { PlayerControls } from "../ui/PlayerControls";

export interface TournamentGameProps {
  player1: string;
  player2: string;
  onWinnerSelect: (winner: string) => void;
}

export function TournamentGame({
  player1,
  player2,
  onWinnerSelect,
}: TournamentGameProps): HTMLElement {
  const container = document.createElement("div");
  container.className = "flex flex-col items-center gap-6 p-6 bg-gray-800 rounded-lg";

  let wsLeft: WebSocket | null = null;
  let wsRight: WebSocket | null = null;
  let matchId: string | null = null;
  let isConnected = false;
  let error: string | null = null;
  let winner: string | null = null;
  let gameState: GameState | null = null;
  let gameComponent: (HTMLElement & { update?: (state: GameState) => void }) | null = null;
  let keyDownHandler: ((e: KeyboardEvent) => void) | null = null;

  const updateView = () => {
    container.innerHTML = "";

    if (winner) {
      // Winner already determined, game ended
      const winnerDiv = document.createElement("div");
      winnerDiv.className = "text-center text-white";
      winnerDiv.textContent = `Winner: ${winner}`;
      container.appendChild(winnerDiv);
      gameComponent = null;
      return;
    }

    // Show game if we have gameState
    if (gameState && matchId) {
      const gameContainer = document.createElement("div");
      gameContainer.className = "flex flex-col items-center";

      // Player info
      const playerInfo = document.createElement("div");
      playerInfo.className = "mb-4 text-center text-white";
      playerInfo.innerHTML = `
        <h2 class="text-2xl font-bold mb-2">${player1} vs ${player2}</h2>
        <p class="text-sm text-gray-300">Match ID: ${matchId}</p>
        <p class="text-sm ${isConnected ? "text-green-400" : "text-gray-400"} mt-2">
          ${isConnected ? "🟢 Connected" : "⚪ Disconnected"}
        </p>
      `;
      gameContainer.appendChild(playerInfo);

      // Player1 mobile controls (top)
      let player1Controls: HTMLElement | null = null;
      if (isMobile()) {
        player1Controls = PlayerControls({
          leftButtonId: "tournament-player1-down-btn",
          rightButtonId: "tournament-player1-up-btn",
          onLeftClick: () => {
            if (keyDownHandler) {
              const event = new KeyboardEvent("keydown", { key: "s" });
              keyDownHandler(event);
            }
          },
          onRightClick: () => {
            if (keyDownHandler) {
              const event = new KeyboardEvent("keydown", { key: "w" });
              keyDownHandler(event);
            }
          },
          className: "-mb-10",
        });
        gameContainer.appendChild(player1Controls);
      }

      // Create or update game component
      if (!gameComponent) {
        gameComponent = Game({ gameState });
      } else if (gameComponent.update) {
        gameComponent.update(gameState);
      }
      gameContainer.appendChild(gameComponent);

      // Instructions
      const instructions = document.createElement("div");
      instructions.className = "mt-4 text-center text-gray-300";
      instructions.innerHTML = `
        <div class="bg-gray-700 p-4 rounded-lg max-w-2xl mx-auto">
          <div class="mb-3">
            <p class="text-sm font-semibold text-white mb-1">${player1} (Left)</p>
            <p class="text-xs text-gray-300">Use <kbd class="px-2 py-1 bg-gray-600 rounded">W</kbd> and <kbd class="px-2 py-1 bg-gray-600 rounded">S</kbd> to move</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-white mb-1">${player2} (Right)</p>
            <p class="text-xs text-gray-300">Use <kbd class="px-2 py-1 bg-gray-600 rounded">↑</kbd> and <kbd class="px-2 py-1 bg-gray-600 rounded">↓</kbd> to move</p>
          </div>
        </div>
      `;

      let player2Controls: HTMLElement | null = null;
      if (isMobile()) {
        player2Controls = PlayerControls({
          leftButtonId: "tournament-arrow-down-btn",
          rightButtonId: "tournament-arrow-up-btn",
          onLeftClick: () => {
            if (keyDownHandler) {
              const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
              keyDownHandler(event);
            }
          },
          onRightClick: () => {
            if (keyDownHandler) {
              const event = new KeyboardEvent("keydown", { key: "ArrowUp" });
              keyDownHandler(event);
            }
          },
          className: "mt-4",
          innerClassName: "-mt-10",
        });
        gameContainer.appendChild(player2Controls);
      }

      if (!isMobile()) {
        gameContainer.appendChild(instructions);
      }

      container.appendChild(gameContainer);
      setupKeyboardControls();
      return;
    }

    // Initial connection state
    const statusClass = isConnected ? "text-green-400" : "text-gray-400";
    const statusText = isConnected ? "🟢 Connected" : "⚪ Connecting...";

    const connectingDiv = document.createElement("div");
    connectingDiv.className = "text-center text-white";
    connectingDiv.innerHTML = `
      <h2 class="text-2xl font-bold mb-2">${player1} vs ${player2}</h2>
      <p class="text-lg ${statusClass} mb-4">${statusText}</p>
      ${error ? `<p class="text-red-400 text-sm">${error}</p>` : ""}
    `;
    container.appendChild(connectingDiv);
  };

  const setupKeyboardControls = () => {
    // Remove existing listener if any
    if (keyDownHandler) {
      window.removeEventListener("keydown", keyDownHandler);
    }

    keyDownHandler = (e: KeyboardEvent) => {
      if (!isConnected) return;

      let move: "up" | "down" | null = null;
      let ws: WebSocket | null = null;

      // Player Left (player1): W and S keys
      if (e.key === "w" || e.key === "W") {
        move = "up";
        ws = wsLeft;
      } else if (e.key === "s" || e.key === "S") {
        move = "down";
        ws = wsLeft;
      }

      // Player Right (player2): Arrow Up and Arrow Down
      if (e.key === "ArrowUp") {
        move = "up";
        ws = wsRight;
      } else if (e.key === "ArrowDown") {
        move = "down";
        ws = wsRight;
      }

      if (move && ws && ws.readyState === WebSocket.OPEN) {
        e.preventDefault();
        ws.send(JSON.stringify({ type: "movePlayer", move }));
      }
    };

    window.addEventListener("keydown", keyDownHandler);
  };

  const connectToMatch = () => {
    try {
      // Close existing connections if any
      if (wsLeft) {
        wsLeft.close();
      }
      if (wsRight) {
        wsRight.close();
      }

      error = null;

      // Connect first player (Left - player1)
      wsLeft = new WebSocket(`ws://localhost:3000/match?playerName=${encodeURIComponent(player1)}`);

      let leftConnected = false;
      let rightConnected = false;

      const checkBothConnected = () => {
        if (leftConnected && rightConnected && matchId) {
          isConnected = true;
          updateView();
        }
      };

      // Setup left player socket
      wsLeft.onopen = () => {
        console.log("WebSocket Left connected for", player1);
        leftConnected = true;

        // Connect second player (Right - player2) after left is connected
        wsRight = new WebSocket(
          `ws://localhost:3000/match?playerName=${encodeURIComponent(player2)}`
        );

        // Setup right player socket
        wsRight.onopen = () => {
          console.log("WebSocket Right connected for", player2);
          rightConnected = true;
          checkBothConnected();
        };

        wsRight.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Right player received:", data);

            if (data.matchId) {
              if (!matchId) {
                matchId = data.matchId;
              }
              checkBothConnected();
              updateView();
            } else if (data.error) {
              error = data.error;
              updateView();
            } else if (data.type === "winner" && data.winner) {
              if (!winner) {
                winner = data.winner;
                console.log("Winner:", data.winner);
                // Call onWinnerSelect with the winner name (only once)
                onWinnerSelect(data.winner);
              }
              updateView();
            } else if (data.type === "gameState" && data.gameState) {
              gameState = data.gameState;
              if (gameComponent?.update && gameState) {
                gameComponent.update(gameState);
              } else {
                updateView();
              }
            }
          } catch (err) {
            console.error("Error parsing right message:", err);
          }
        };

        wsRight.onerror = (err) => {
          console.error("WebSocket Right error:", err);
          error = "Failed to connect right player";
          isConnected = false;
          updateView();
        };

        wsRight.onclose = () => {
          console.log("WebSocket Right disconnected");
          rightConnected = false;
          isConnected = false;
          wsRight = null;
          updateView();
        };
      };

      wsLeft.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Left player received:", data);

          if (data.matchId) {
            matchId = data.matchId;
            console.log("Match ID:", data.matchId);
            checkBothConnected();
            updateView();
          } else if (data.error) {
            error = data.error;
            updateView();
          } else if (data.type === "winner" && data.winner) {
            if (!winner) {
              winner = data.winner;
              console.log("Winner:", data.winner);
              // Call onWinnerSelect with the winner name (only once)
              onWinnerSelect(data.winner);
            }
            updateView();
          } else if (data.type === "gameState" && data.gameState) {
            gameState = data.gameState;
            if (gameComponent?.update && gameState) {
              gameComponent.update(gameState);
            } else {
              updateView();
            }
          }
        } catch (err) {
          console.error("Error parsing left message:", err);
        }
      };

      wsLeft.onerror = (err) => {
        console.error("WebSocket Left error:", err);
        error = "Failed to connect left player";
        isConnected = false;
        updateView();
      };

      wsLeft.onclose = () => {
        console.log("WebSocket Left disconnected");
        leftConnected = false;
        isConnected = false;
        wsLeft = null;
        updateView();
      };
    } catch (err) {
      console.error("Error connecting to WebSocket:", err);
      error = "Failed to establish connection";
      updateView();
    }
  };

  // Cleanup function
  const cleanup = () => {
    if (wsLeft) {
      wsLeft.close();
      wsLeft = null;
    }
    if (wsRight) {
      wsRight.close();
      wsRight = null;
    }
    gameComponent = null;
    gameState = null;
    if (keyDownHandler) {
      window.removeEventListener("keydown", keyDownHandler);
      keyDownHandler = null;
    }
  };

  // Store cleanup function on container
  (container as HTMLElement & { _cleanup?: () => void })._cleanup = cleanup;

  // Auto-connect when component is created
  connectToMatch();
  updateView();

  return container;
}
