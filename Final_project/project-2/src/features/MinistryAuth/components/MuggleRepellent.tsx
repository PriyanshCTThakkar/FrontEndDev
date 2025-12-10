/**
 * MuggleRepellent - Protected Route Guard
 *
 * A route guard component that prevents unauthorized access to protected routes.
 * Named after the enchantment that keeps Muggles away from magical locations.
 *
 * Usage:
 * Wrap protected routes with this component. If the user is not authenticated,
 * they will be redirected to the login page. Otherwise, nested routes render via <Outlet />.
 */

import { Navigate, Outlet } from '@tanstack/react-router';
import { useMinistryAuth } from '../context/MinistryAuthContext';

/**
 * MuggleRepellent Component
 *
 * Acts as a route guard for protected routes.
 * - If authenticated: Renders child routes via <Outlet />
 * - If not authenticated: Redirects to /ministry-portal (Login)
 */
export function MuggleRepellent() {
  const { state } = useMinistryAuth();

  // If not authenticated, redirect to the Ministry Portal (Login)
  if (!state.isAuthenticated) {
    return <Navigate to="/ministry-portal" replace />;
  }

  // User is authenticated - render nested routes
  return <Outlet />;
}

/**
 * Optional: Loading state while checking authentication
 * Use this if you want to show a loading spinner during initial auth check
 */
export function MuggleRepellentWithLoading() {
  const { state } = useMinistryAuth();

  // Show loading while initial auth check is in progress
  if (state.isLoading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Checking magical credentials...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!state.isAuthenticated) {
    return <Navigate to="/ministry-portal" replace />;
  }

  // User is authenticated - render nested routes
  return <Outlet />;
}