/**
 * useTeamList - Custom Hook for Team Management
 *
 * Container logic for team operations using OwlPostService.
 * This hook encapsulates all business logic, keeping components purely presentational.
 *
 * Architecture Pattern: Container/Presentational Separation
 * - Hook = Container (Logic, state, side effects)
 * - Component = Presentational (UI only, receives data via props)
 *
 * @example
 * ```tsx
 * function TeamsPage() {
 *   const { teams, isLoading, error, recruitTeam, banishTeam } = useTeamList();
 *
 *   return <LeagueScroll teams={teams} isLoading={isLoading} />;
 * }
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import { owlPostService, DarkMagicError } from '../../../services';
import type { Team } from '../../../types/wizardry';

/**
 * Hook return type
 */
interface UseTeamListReturn {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  recruitTeam: (teamData: Omit<Team, 'id'>) => Promise<void>;
  banishTeam: (teamId: string) => Promise<void>;
  refreshTeams: () => Promise<void>;
}

/**
 * useTeamList Hook
 *
 * Manages team data fetching, creation, and deletion.
 * Handles loading states and error handling.
 *
 * @returns {UseTeamListReturn} Team data and management functions
 */
export function useTeamList(): UseTeamListReturn {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all teams from OwlPostService
   * Called on mount and after mutations
   */
  const fetchTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedTeams = await owlPostService.getAllTeams();
      setTeams(fetchedTeams);

    } catch (err) {
      if (err instanceof DarkMagicError) {
        setError(err.message);
      } else {
        setError('Failed to fetch teams. Dark magic may be interfering.');
      }
      console.error('[useTeamList] Error fetching teams:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initial fetch on mount
   */
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  /**
   * Recruit a new team to the league
   *
   * @param teamData - Team data without ID
   */
  const recruitTeam = useCallback(async (teamData: Omit<Team, 'id'>) => {
    try {
      setError(null);

      const newTeam = await owlPostService.recruitTeam(teamData);

      // Optimistically update UI
      setTeams(prevTeams => [...prevTeams, newTeam]);

    } catch (err) {
      if (err instanceof DarkMagicError) {
        setError(err.message);
      } else {
        setError('Failed to recruit team. The Ministry may be blocking this action.');
      }
      console.error('[useTeamList] Error recruiting team:', err);

      // Re-fetch to ensure consistency
      await fetchTeams();
    }
  }, [fetchTeams]);

  /**
   * Banish a team from the league
   * Also removes all associated players
   *
   * @param teamId - ID of team to remove
   */
  const banishTeam = useCallback(async (teamId: string) => {
    try {
      setError(null);

      await owlPostService.banishTeam(teamId);

      // Optimistically update UI
      setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));

    } catch (err) {
      if (err instanceof DarkMagicError) {
        setError(err.message);
      } else {
        setError('Failed to banish team. The protective enchantments are too strong.');
      }
      console.error('[useTeamList] Error banishing team:', err);

      // Re-fetch to ensure consistency
      await fetchTeams();
    }
  }, [fetchTeams]);

  /**
   * Manually refresh teams list
   * Useful after external changes
   */
  const refreshTeams = useCallback(async () => {
    await fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    isLoading,
    error,
    recruitTeam,
    banishTeam,
    refreshTeams,
  };
}
