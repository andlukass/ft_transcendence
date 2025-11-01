import { TournamentWinner } from "../components/tournament/TournamentWinner";
import { PlayerControls } from "../components/ui/PlayerControls";
import { Game, type GameState } from "../game/Game";
import { isMobile } from "../lib/utils";

let wsLeft: WebSocket | null = null;
let wsRight: WebSocket | null = null;

export function Local(): HTMLElement {
  const container = document.createElement("div");
  container.className = "px-4 py-6 sm:px-0";

  let matchId: string | null = null;
  let isConnected = false;
  let error: string | null = null;
  let winner: string | null = null;
  let gameState: GameState | null = null;
  let gameComponent: (HTMLElement & { update?: (state: GameState) => void }) | null = null;
  let keyDownHandler: ((e: KeyboardEvent) => void) | null = null;

  const updateView = () => {
    if (winner) {
      container.innerHTML = "";
      const innerDiv = document.createElement("div");
      innerDiv.className = "text-center";
      const winnerComp = TournamentWinner(winner);
      innerDiv.appendChild(winnerComp);
      container.appendChild(innerDiv);
      gameComponent = null;
      return;
    }

    // Show game if we have gameState
    if (gameState && matchId) {
      container.innerHTML = "";
      const gameContainer = document.createElement("div");
      gameContainer.className = "flex flex-col items-center";

      // Player info
      const playerInfo = document.createElement("div");
      playerInfo.className = "mb-4 text-center";
      playerInfo.innerHTML = `
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Local Match</h1>
        <p class="text-sm text-gray-500">Match ID: ${matchId}</p>
        <p class="text-sm ${isConnected ? "text-green-600" : "text-gray-600"} mt-2">
          ${isConnected ? "🟢 Connected" : "⚪ Disconnected"}
        </p>
      `;
      gameContainer.appendChild(playerInfo);

      // Player1 mobile controls (top)
      let player1Controls: HTMLElement | null = null;
      if (isMobile()) {
        player1Controls = PlayerControls({
          leftButtonId: "player1-down-btn",
          rightButtonId: "player1-up-btn",
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
      instructions.className = "text-center text-gray-600";
      instructions.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <div class="mb-4">
            <p class="text-lg font-semibold text-gray-900 mb-2">Player Left</p>
            <p class="text-gray-600">Use <kbd class="px-2 py-1 bg-gray-200 rounded">W</kbd> and <kbd class="px-2 py-1 bg-gray-200 rounded">S</kbd> to move</p>
          </div>
          <div class="mb-4">
            <p class="text-lg font-semibold text-gray-900 mb-2">Player Right</p>
            <p class="text-gray-600">Use <kbd class="px-2 py-1 bg-gray-200 rounded">↑</kbd> and <kbd class="px-2 py-1 bg-gray-200 rounded">↓</kbd> to move</p>
          </div>
        </div>
      `;

      let player2Controls: HTMLElement | null = null;
      if (isMobile()) {
        player2Controls = PlayerControls({
          leftButtonId: "arrow-down-btn",
          rightButtonId: "arrow-up-btn",
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

    const statusClass = isConnected ? "text-green-600" : "text-gray-600";
    const statusText = isConnected ? "🟢 Connected" : "⚪ Disconnected";

    container.innerHTML = `
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">Local Match</h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Play a local match against yourself or with a friend on the same keyboard.
          Both players will connect automatically.
        </p>

        <div class="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Controls</h3>
            <div class="flex justify-around mb-6">
              <div class="text-center">
                <p class="text-lg font-semibold text-gray-900 mb-2">Player Left</p>
                <p class="text-gray-600">Use <kbd class="px-3 py-2 bg-gray-200 rounded font-mono">W</kbd> and <kbd class="px-3 py-2 bg-gray-200 rounded font-mono">S</kbd> to move</p>
              </div>
              <div class="text-center">
                <p class="text-lg font-semibold text-gray-900 mb-2">Player Right</p>
                <p class="text-gray-600">Use <kbd class="px-3 py-2 bg-gray-200 rounded font-mono">↑</kbd> and <kbd class="px-3 py-2 bg-gray-200 rounded font-mono">↓</kbd> to move</p>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <div class="flex flex-col gap-4 justify-center">
              <button
                type="button"
                id="connect-btn"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
              >
                Start Local Multiplayer Match
              </button>
              <button
                type="button"
                id="connect-singleplayer-btn"
                class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
              >
                Start Local Singleplayer Match
              </button>
            </div>
            ${error ? `<p class="text-red-600 mt-2">${error}</p>` : ""}
          </div>

          <div class="mb-6">
            <p class="text-lg ${statusClass}">
              Status: ${statusText}
            </p>
          </div>

          <div class="flex justify-center">
            <div class="text-center">
              <div class="text-blue-600 text-4xl mb-4">🎮</div>
              <h3 class="text-xl font-semibold text-gray-900 mb-4">Current Match</h3>
              <div class="bg-gray-100 p-4 rounded-lg">
                ${
                  matchId
                    ? `<div>
                        <p class="text-green-600 font-semibold mb-2">Match ID:</p>
                        <p class="text-gray-900 break-all">${matchId}</p>
                      </div>`
                    : '<p class="text-gray-600">No active match</p>'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    const connectBtn = container.querySelector("#connect-btn") as HTMLButtonElement;
    if (connectBtn) {
      connectBtn.addEventListener("click", connectToMatch);
    }
    const connectSinglePlayerBtn = container.querySelector(
      "#connect-singleplayer-btn"
    ) as HTMLButtonElement;
    if (connectSinglePlayerBtn) {
      connectSinglePlayerBtn.addEventListener("click", connectToSinglePlayerMatch);
    }
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

      // Player Left: W and S keys
      if (e.key === "w" || e.key === "W") {
        move = "up";
        ws = wsLeft;
      } else if (e.key === "s" || e.key === "S") {
        move = "down";
        ws = wsLeft;
      }

      // Player Right: Arrow Up and Arrow Down
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

      // Connect first player (Left) - will be index 0
      wsLeft = new WebSocket(
        `ws://localhost:3000/match?playerName=${encodeURIComponent("LocalPlayerLeft")}`
      );

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
        console.log("WebSocket Left connected");
        leftConnected = true;

        // Connect second player (Right) after left is connected
        // This ensures they join the same match
        wsRight = new WebSocket(
          `ws://localhost:3000/match?playerName=${encodeURIComponent("LocalPlayerRight")}`
        );

        // Setup right player socket
        wsRight.onopen = () => {
          console.log("WebSocket Right connected");
          rightConnected = true;
          checkBothConnected();
        };

        wsRight.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Right player received:", data);

            if (data.matchId) {
              // Use the same matchId (should be the same for both)
              if (!matchId) {
                matchId = data.matchId;
              }
              checkBothConnected();
              updateView();
            } else if (data.error) {
              error = data.error;
              updateView();
            } else if (data.winner) {
              winner = data.winner;
              console.log("Winner:", data.winner);
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
          } else if (data.winner) {
            winner = data.winner;
            console.log("Winner:", data.winner);
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

  const connectToSinglePlayerMatch = () => {
    try {
      // Close existing connections if any
      if (wsLeft) {
        wsLeft.close();
      }
      if (wsRight) {
        wsRight.close();
      }

      error = null;

      // Connect only the left player with isSinglePlayer flag
      wsLeft = new WebSocket(
        `ws://localhost:3000/match?playerName=${encodeURIComponent("LocalPlayerLeft")}&isSinglePlayer=true`
      );

      let leftConnected = false;

      // Setup left player socket
      wsLeft.onopen = () => {
        console.log("WebSocket Left connected (Singleplayer)");
        leftConnected = true;
      };

      wsLeft.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Left player received:", data);

          if (data.matchId) {
            matchId = data.matchId;
            console.log("Match ID:", data.matchId);
            if (leftConnected && matchId) {
              isConnected = true;
            }
            console.log("Match ID:", matchId);
            updateView();
          } else if (data.error) {
            error = data.error;
            updateView();
          } else if (data.winner) {
            winner = data.winner;
            console.log("Winner:", data.winner);
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

  // Cleanup on unmount
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

  updateView();
  return container;
}
