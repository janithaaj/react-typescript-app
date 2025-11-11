import { createBrowserRouter, RouterProvider } from 'react-router';
import type { RouteObject } from 'react-router';
import App from '../App';
import { Login, Dashboard } from '../screens';

/**
 * Application routes configuration.
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
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
