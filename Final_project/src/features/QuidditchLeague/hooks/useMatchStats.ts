/**
 * useMatchStats - Match Statistics Management Hook
 *
 * Custom hook for fetching and managing match data, including
 * recording new matches and calculating league standings.
 *
 * @architecture Business Logic Layer
 * - Encapsulates match-related state and operations
 * - Handles data fetching from OwlPostService
 * - Provides match recording with automatic refresh
 */

import { useState, useEffect, useCallback } from 'react';
import { owlPostService, DarkMagicError } from '../../../services/OwlPostService';
import type { Match, Team } from '../../../types/wizardry';

/**
 * Hook return type
 */
interface UseMatchStatsReturn {
  matches: Match[];
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  recordMatch: (
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number
  ) => Promise<void>;
  refreshData: () => Promise<void>;
}

/**
 * League standing with calculated statistics
 */
export interface LeagueStanding extends Team {
  points: number;
  played: number;
  winPercentage: number;
}

/**
 * useMatchStats Hook
 *
 * Manages match data and provides league standings calculations
 *
 * @returns Match data, teams, and management functions
 *
 * @example
 * ```tsx
 * function StatsPage() {
 *   const { matches, teams, recordMatch } = useMatchStats();
 *
 *   const handleRecordMatch = async (homeId, awayId, homeScore, awayScore) => {
 *     await recordMatch(homeId, awayId, homeScore, awayScore);
 *   };
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useMatchStats(): UseMatchStatsReturn {
  // ========================================
  // STATE
  // ========================================
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // DATA FETCHING
  // ========================================

  /**
   * Fetch all matches and teams from service
   */
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [matchesData, teamsData] = await Promise.all([
        owlPostService.getAllMatches(),
        owlPostService.getAllTeams(),
      ]);

      setMatches(matchesData);
      setTeams(teamsData);
    } catch (err) {
      const errorMessage = err instanceof DarkMagicError
        ? err.message
        : 'Failed to load match data. Dark magic interference detected!';

      setError(errorMessage);
      console.error('[useMatchStats] Data fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initial data load on mount
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ========================================
  // MATCH RECORDING
  // ========================================

  /**
   * Record a new match result
   * Automatically refreshes data after successful recording
   *
   * @param homeTeamId - ID of home team
   * @param awayTeamId - ID of away team
   * @param homeScore - Home team score
   * @param awayScore - Away team score
   * @throws {DarkMagicError} If teams don't exist or recording fails
   */
  const recordMatch = useCallback(
    async (
      homeTeamId: string,
      awayTeamId: string,
      homeScore: number,
      awayScore: number
    ): Promise<void> => {
      try {
        setError(null);

        // Record match via service
        await owlPostService.recordMatch(
          homeTeamId,
          awayTeamId,
          homeScore,
          awayScore
        );

        // Refresh data to reflect updated standings
        await fetchData();

        console.log('[useMatchStats] Match recorded successfully');
      } catch (err) {
        const errorMessage = err instanceof DarkMagicError
          ? err.message
          : 'Failed to record match. Please try again.';

        setError(errorMessage);
        console.error('[useMatchStats] Match recording failed:', err);

        throw err; // Re-throw for component-level error handling
      }
    },
    [fetchData]
  );

  // ========================================
  // PUBLIC REFRESH
  // ========================================

  /**
   * Manually refresh all data
   * Useful for pull-to-refresh or retry after error
   */
  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // ========================================
  // RETURN
  // ========================================
  return {
    matches,
    teams,
    isLoading,
    error,
    recordMatch,
    refreshData,
  };
}

/**
 * Calculate league standings from teams
 * Sorts by points (3 for win, 1 for draw), then by wins
 *
 * @param teams - Array of teams
 * @returns Sorted array of league standings
 */
export function calculateLeagueStandings(teams: Team[]): LeagueStanding[] {
  return teams
    .map(team => {
      const played = team.wins + team.losses + team.draws;
      const points = team.wins * 3 + team.draws;
      const winPercentage = played > 0 ? (team.wins / played) * 100 : 0;

      return {
        ...team,
        points,
        played,
        winPercentage,
      };
    })
    .sort((a, b) => {
      // Primary: Points (descending)
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      // Secondary: Wins (descending)
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }

      // Tertiary: Win percentage (descending)
      return b.winPercentage - a.winPercentage;
    });
}
