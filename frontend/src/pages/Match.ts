import { TournamentWinner } from "../components/tournament/TournamentWinner";

let ws: WebSocket | null = null;

export function Match(): HTMLElement {
  const container = document.createElement("div");
  container.className = "px-4 py-6 sm:px-0";

  let matchId: string | null = null;
  let playerName = "";
  let isConnected = false;
  let error: string | null = null;
  let winner: string | null = null;

  const updateView = () => {
    if (winner) {
      container.innerHTML = "";
      const innerDiv = document.createElement("div");
      innerDiv.className = "text-center";
      const winnerComp = TournamentWinner(winner);
      innerDiv.appendChild(winnerComp);
      container.appendChild(innerDiv);
      return;
    }

    const statusClass = isConnected ? "text-green-600" : "text-gray-600";
    const statusText = isConnected ? "🟢 Connected" : "⚪ Disconnected";

    container.innerHTML = `
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-6">Match</h1>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Welcome to the match page! This is where your gaming matches will be displayed.
        </p>

        <div class="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <div class="mb-8">
            <div class="flex gap-4 justify-center">
              <input
                type="text"
                id="player-name-input"
                value="${playerName}"
                placeholder="Enter your player name"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                id="connect-btn"
                ${isConnected ? "disabled" : ""}
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
              >
                ${isConnected ? "Connected" : "Find Match"}
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
    const nameInput = container.querySelector("#player-name-input") as HTMLInputElement;
    if (nameInput) {
      nameInput.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        playerName = target.value;
      });
    }

    const connectBtn = container.querySelector("#connect-btn") as HTMLButtonElement;
    if (connectBtn) {
      connectBtn.addEventListener("click", connectToMatch);
    }
  };

  const connectToMatch = () => {
    if (!playerName.trim()) {
      error = "Player name is required";
      updateView();
      return;
    }

    try {
      // Close existing connection if any
      if (ws) {
        ws.close();
      }

      error = null;
      ws = new WebSocket(
        `ws://localhost:3000/match?playerName=${encodeURIComponent(playerName.trim())}`
      );

      ws.onopen = () => {
        console.log("WebSocket connected");
        isConnected = true;
        updateView();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received data:", data);

          if (data.matchId) {
            matchId = data.matchId;
            console.log("Match ID:", data.matchId);
            updateView();
          } else if (data.error) {
            error = data.error;
            updateView();
          } else if (data.winner) {
            winner = data.winner;
            console.log("Winner:", data.winner);
            updateView();
          }
        } catch (err) {
          console.error("Error parsing message:", err);
          error = "Failed to parse server response";
          updateView();
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        error = "Failed to connect to server";
        isConnected = false;
        updateView();
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        isConnected = false;
        ws = null;
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
    if (ws) {
      ws.close();
      ws = null;
    }
  };

  // Store cleanup function on container
  (container as HTMLElement & { _cleanup?: () => void })._cleanup = cleanup;

  updateView();
  return container;
}
