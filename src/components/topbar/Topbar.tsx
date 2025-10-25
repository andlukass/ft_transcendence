import { Link } from '@tanstack/react-router';

export function Topbar() {
  return (
    <nav className="shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Transcendence</h1>
            </div>
            <div className="ml-6 flex space-x-8">
              <Link
                to="/match"
                className="no-underline text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
              >
                Partida Local
              </Link>
              <Link
                to="/match"
                className="no-underline text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
              >
                Partida Remota
              </Link>
              <Link
                to="/match"
                className="no-underline text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
              >
                Torneio Local
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
