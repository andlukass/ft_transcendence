import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Transcendence!!!!</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your journey to the next level begins here. Experience the power of modern web development
          with React, TypeScript, and TanStack Router.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-blue-600 text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast</h3>
            <p className="text-gray-600">
              Built with Vite for lightning-fast development and optimized production builds.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-green-600 text-3xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Type Safe</h3>
            <p className="text-gray-600">
              Full TypeScript support with TanStack Router for type-safe routing and navigation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-purple-600 text-3xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Beautiful</h3>
            <p className="text-gray-600">
              Styled with Tailwind CSS for a modern, responsive, and beautiful user interface.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
