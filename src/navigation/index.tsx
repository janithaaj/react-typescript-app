import { createBrowserRouter, RouterProvider } from 'react-router';
import type { RouteObject } from 'react-router';
import {
  Home,
  Login,
  Dashboard,
  DiagramEditor,
  NotFound,
  ErrorPage,
} from '../screens';
import ProtectedRoute from '../components/common/ProtectedRoute';

/**
 * Application routes configuration.
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/diagram/:id',
    element: (
      <ProtectedRoute>
        <DiagramEditor />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <NotFound />,
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
