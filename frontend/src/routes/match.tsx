import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/match")({
  component: Match,
});

function Match() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Match</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Welcome to the match page! This is where your gaming matches will be displayed.
        </p>

        <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-blue-600 text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Match</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600">No active match</p>
              </div>
            </div>

            <div className="text-center">
              <div className="text-green-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Match History</h3>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-600">No matches played yet</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors mr-4"
            >
              Find Match
            </button>
            <button
              type="button"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              View Statistics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
