/**
 * MuggleRepellent - Protected Route Guard
 *
 * A route guard component that prevents unauthorized access to protected routes.
 * Named after the enchantment that keeps Muggles away from magical locations.
 *
 * Usage:
 * Wrap protected routes with this component. If the user is not authenticated,
 * they will be redirected to the login page. Otherwise, nested routes render via <Outlet />.
 *
 * @example
 * ```tsx
 * <Route element={<MuggleRepellent />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 *   <Route path="/teams" element={<Teams />} />
 * </Route>
 * ```
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMinistryAuth } from '../context/MinistryAuthContext';

/**
 * MuggleRepellent Component
 *
 * Acts as a route guard for protected routes.
 * - If authenticated: Renders child routes via <Outlet />
 * - If not authenticated: Redirects to /login with return URL preserved
 */
export function MuggleRepellent() {
  const { state } = useMinistryAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  // Pass the current location so we can redirect back after login
  if (!state.isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
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
  const location = useLocation();

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
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // User is authenticated - render nested routes
  return <Outlet />;
}
