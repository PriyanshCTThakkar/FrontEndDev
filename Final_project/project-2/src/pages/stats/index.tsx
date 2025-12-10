/**
 * Match Statistics Archive Route
 *
 * Protected route for match statistics and league standings.
 * Uses domain-specific naming: matchArchiveRoute
 *
 * @pattern Protected Route Factory with Stats Integration
 */

import { createRoute, useNavigate, type AnyRoute } from "@tanstack/react-router";
import { useMinistryAuth } from "../../features/MinistryAuth";
import { StatsPage } from "../../features/QuidditchLeague/components/StatsPage";
import { useEffect } from "react";

/**
 * Route Factory: Match Statistics Archive
 * @param parent - Explicitly typed as AnyRoute for type safety
 */
export default (parent: AnyRoute) => createRoute({
  path: '/match-statistics',
  getParentRoute: () => parent,
  component: MatchStatisticsArchiveSanctuary,
});

/**
 * Match Statistics Archive Sanctuary
 * Thin wrapper that renders the StatsPage feature component
 */
function MatchStatisticsArchiveSanctuary() {
  const {
    state: { isAuthenticated: isArchivalCredentialsVerified },
  } = useMinistryAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isArchivalCredentialsVerified) {
      navigate({ to: '/ministry-portal' });
    }
  }, [isArchivalCredentialsVerified, navigate]);

  /**
   * Defense-in-depth authentication verification
   */
  if (!isArchivalCredentialsVerified) {
    return (
      <div style={{
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚫 Ministry Access Denied</h2>
        <p style={{ color: '#64748b' }}>
          You must authenticate at the Ministry Portal to access the Match Statistics Archive.
        </p>
      </div>
    );
  }

  return <StatsPage />;
}
