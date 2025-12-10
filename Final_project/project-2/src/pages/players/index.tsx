/**
 * Scouting Network Route
 *
 * Protected route for player scouting and roster management.
 * Uses domain-specific naming: scoutingNetworkRoute
 *
 * @pattern Protected Route Factory with Container/Presentational Pattern
 */

import { createRoute, useNavigate, type AnyRoute } from "@tanstack/react-router";
import { useMinistryAuth } from "../../features/MinistryAuth";
import { PlayersPage } from "../../features/QuidditchLeague/components/PlayersPage";
import { useEffect } from "react";

/**
 * Route Factory: Scouting Network
 * @param parent - Explicitly typed as AnyRoute for type safety
 */
export default (parent: AnyRoute) => createRoute({
  path: '/scouting-network',
  getParentRoute: () => parent,
  component: ScoutingNetworkCommandPost,
});

/**
 * Scouting Network Command Post
 * Thin wrapper that renders the PlayersPage feature component
 */
function ScoutingNetworkCommandPost() {
  const {
    state: { isAuthenticated: isScoutingCredentialsVerified },
  } = useMinistryAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isScoutingCredentialsVerified) {
      navigate({ to: '/ministry-portal' });
    }
  }, [isScoutingCredentialsVerified, navigate]);

  /**
   * Defense-in-depth authentication verification
   */
  if (!isScoutingCredentialsVerified) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚫 Ministry Access Denied</h2>
        <p style={{ color: '#64748b' }}>
          You must authenticate at the Ministry Portal to access the Scouting Network.
        </p>
      </div>
    );
  }

  return <PlayersPage />;
}
