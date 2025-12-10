/**
 * Command Center Route (Dashboard)
 *
 * Protected route for the main Ministry Dashboard.
 * Checks authentication before allowing access to the Command Center.
 *
 * @pattern Route Factory with Auth Guard
 */

import { createRoute, useNavigate, type AnyRoute } from "@tanstack/react-router";
import { useMinistryAuth } from "../../features/MinistryAuth";
import { DashboardPage } from "../../features/QuidditchLeague/components/DashboardPage";
import { useEffect } from "react";

/**
 * Route Factory: Command Center
 * @param parent - Explicitly typed as AnyRoute for entropy compliance
 */
export default (parent: AnyRoute) => createRoute({
  path: '/quidditch-command',
  getParentRoute: () => parent,
  component: CommandRouteWrapper,
});

/**
 * Command Route Wrapper
 * Simple wrapper to render the Dashboard Feature
 */
function CommandRouteWrapper() {
  const { state: { isAuthenticated } } = useMinistryAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/ministry-portal' });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return <DashboardPage />;
}