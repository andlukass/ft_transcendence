import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Topbar } from '../components/topbar/Topbar';

export const Route = createRootRoute({
  component: () => (
    <main className="max-w-7xl mx-auto py-3 sm:py-6 sm:px-6 lg:px-8">
      <Topbar />
      <Outlet />
    </main>
  ),
  notFoundComponent: () => (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-8">Page not found</p>
      <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Go Home
      </Link>
    </div>
  ),
});
