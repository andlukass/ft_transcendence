import { Link } from "@tanstack/react-router";

export function Topbar() {
  return (
    <nav className="shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between h-fit py-0 max-sm:mb-3 sm:py-4 max-sm:gap-2">
          <div className="shrink-0 flex items-center max-sm:justify-center">
            <Link
              to="/"
              className="gap-2 no-underline text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
            >
              <img src="/pong.svg" alt="The Pong Game" className="w-6 h-6" />
              <h1 className="text-xl font-semibold text-gray-900">The Pong Game</h1>
            </Link>
          </div>
          <div className="ml-6 flex space-x-8 text-center">
            <Link
              to="/match"
              className="no-underline text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
            >
              Local Match
            </Link>
            <Link
              to="/match"
              className="no-underline text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
            >
              Remote Match
            </Link>
            <Link
              to="/tournament"
              className="no-underline text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
            >
              Local Tournament
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
