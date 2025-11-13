import { createBrowserRouter, RouterProvider } from 'react-router';
import type { RouteObject } from 'react-router';
import { Home, Login, Dashboard, DiagramEditor } from '../screens';
import ProtectedRoute from '../components/common/ProtectedRoute';

/**
 * Application routes configuration.
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/diagram/:id',
    element: (
      <ProtectedRoute>
        <DiagramEditor />
      </ProtectedRoute>
    ),
  },
];

/**
 * Browser router instance.
 */
const router = createBrowserRouter(routes);

/**
 * Navigation component that provides routing.
 */
export const Navigation = () => {
  return <RouterProvider router={router} />;
};
