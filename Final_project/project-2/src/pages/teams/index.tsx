/**
 * Quidditch League Registry Route
 *
 * Protected route for managing teams in the Ministry-approved league.
 * Uses domain-specific naming: leagueRegistryRoute
 *
 * @pattern Protected Route Factory with Container/Presentational Pattern
 */

import { createRoute, useNavigate, type AnyRoute } from "@tanstack/react-router";
import { useMinistryAuth } from "../../features/MinistryAuth";
import { useTeamList } from "../../features/QuidditchLeague/hooks/useTeamList";
import { LeagueScroll } from "../../features/QuidditchLeague/components/LeagueScroll";
import { RecruitmentForm } from "../../features/QuidditchLeague/components/RecruitmentForm";
import { useState, useEffect } from "react";
import type { Team } from "../../types/wizardry";
import "../Teams/TeamsPage.css";

/**
 * Route Factory: League Registry
 * @param parent - Explicitly typed as AnyRoute for type safety
 */
export default (parent: AnyRoute) => createRoute({
  path: '/quidditch-league-registry',
  getParentRoute: () => parent,
  component: QuiddditchLeagueRegistryCommandCenter,
});

/**
 * Quidditch League Registry Command Center
 * Thin wrapper that orchestrates team management using custom hooks and components
 */
function QuiddditchLeagueRegistryCommandCenter() {
  const {
    state: { isAuthenticated: isWizardCredentialVerified },
  } = useMinistryAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isWizardCredentialVerified) {
      navigate({ to: '/ministry-portal' });
    }
  }, [isWizardCredentialVerified, navigate]);

  const {
    teams: registeredQuidditchSquads,
    isLoading: isFetchingSquadManifests,
    error: squadRegistryError,
    recruitTeam: registerNewSquadIntoLeague,
    banishTeam: dissolveSquadFromRegistry,
  } = useTeamList();

  const [isRecruitmentScrollOpen, setIsRecruitmentScrollOpen] = useState<boolean>(false);

  /**
   * Defense-in-depth authentication verification
   */
  if (!isWizardCredentialVerified) {
    return (
      <div className="unauthorized-sanctuary">
        <h2>🚫 Ministry Access Denied</h2>
        <p>You must authenticate at the Ministry Portal to access the League Registry.</p>
      </div>
    );
  }

  /**
   * Handle squad recruitment ceremony
   */
  const handleSquadRecruitmentCeremony = async (squadManifestScroll: Omit<Team, 'id'>) => {
    try {
      await registerNewSquadIntoLeague(squadManifestScroll);
      setIsRecruitmentScrollOpen(false);
    } catch (recruitmentEnchantmentFailure) {
      console.error('[LeagueRegistry] Squad recruitment ceremony failed:', recruitmentEnchantmentFailure);
    }
  };

  /**
   * Handle squad dissolution ritual with Ministry confirmation
   */
  const handleSquadDissolutionRitual = async (squadRegistrationId: string) => {
    const confirmDissolutionSpell = window.confirm(
      `⚠️ Ministry Warning: You are about to dissolve this team from the official registry. ` +
      `This action will vanish all associated player contracts. Proceed with banishing spell?`
    );

    if (confirmDissolutionSpell) {
      try {
        await dissolveSquadFromRegistry(squadRegistrationId);
      } catch (dissolutionRitualError) {
        console.error('[LeagueRegistry] Squad dissolution ritual failed:', dissolutionRitualError);
      }
    }
  };

  return (
    <div className="league-registry-sanctum">
      <header className="registry-proclamation">
        <h1 className="registry-title">🏆 Quidditch League Registry</h1>
        <p className="registry-decree">
          Ministry-approved teams competing for the House Cup glory
        </p>

        <button
          className="recruit-team-button"
          onClick={() => setIsRecruitmentScrollOpen(true)}
        >
          ✨ Recruit New Squad
        </button>
      </header>

      {/* Recruitment Parchment Modal */}
      {isRecruitmentScrollOpen && (
        <div className="recruitment-portal-overlay">
          <div className="portal-content">
             <RecruitmentForm
               onRecruit={handleSquadRecruitmentCeremony}
               onCancel={() => setIsRecruitmentScrollOpen(false)}
             />
          </div>
        </div>
      )}

      {/* League Scroll Presentational Component */}
      <LeagueScroll
        teams={registeredQuidditchSquads}
        isLoading={isFetchingSquadManifests}
        error={squadRegistryError}
        onBanishTeam={handleSquadDissolutionRitual}
      />
    </div>
  );
}
