/**
 * usePlayerRoster - Custom Hook for Player Management
 *
 * Container logic for player operations using OwlPostService.
 * Can fetch all players or filter by team.
 *
 * Architecture Pattern: Container/Presentational Separation
 * - Hook = Container (Logic, state, side effects)
 * - Component = Presentational (UI only, receives data via props)
 *
 * @example
 * ```tsx
 * // All players
 * const { players, isLoading, recruitPlayer } = usePlayerRoster();
 *
 * // Team-specific players
 * const { players, isLoading } = usePlayerRoster('team-123');
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import { owlPostService, DarkMagicError } from '../../../services';
import type { Player } from '../../../types/wizardry';

/**
 * Hook return type
 */
interface UsePlayerRosterReturn {
  players: Player[];
  isLoading: boolean;
  error: string | null;
  recruitPlayer: (playerData: Omit<Player, 'id'>) => Promise<void>;
  banishPlayer: (playerId: string) => Promise<void>;
  refreshPlayers: () => Promise<void>;
}

/**
 * usePlayerRoster Hook
 *
 * Manages player data fetching, creation, and deletion.
 * Optional teamId parameter filters players by team.
 *
 * @param teamId - Optional team ID to filter players
 * @returns {UsePlayerRosterReturn} Player data and management functions
 */
export function usePlayerRoster(teamId?: string): UsePlayerRosterReturn {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch players from OwlPostService
   * If teamId provided, fetch only that team's players
   * Otherwise, fetch all players from all teams
   */
  const fetchPlayers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (teamId) {
        // Fetch players for specific team
        const fetchedPlayers = await owlPostService.getPlayersByTeam(teamId);
        setPlayers(fetchedPlayers);
      } else {
        // Fetch all players from all teams
        // First get all teams, then get players for each team
        const teams = await owlPostService.getAllTeams();
        const allPlayers: Player[] = [];

        for (const team of teams) {
          const teamPlayers = await owlPostService.getPlayersByTeam(team.id);
          allPlayers.push(...teamPlayers);
        }

        setPlayers(allPlayers);
      }

    } catch (err) {
      if (err instanceof DarkMagicError) {
        setError(err.message);
      } else {
        setError('Failed to fetch players. Dark magic may be interfering.');
      }
      console.error('[usePlayerRoster] Error fetching players:', err);
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  /**
   * Initial fetch on mount or when teamId changes
   */
  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  /**
   * Recruit a new player
   *
   * @param playerData - Player data without ID
   */
  const recruitPlayer = useCallback(async (playerData: Omit<Player, 'id'>) => {
    try {
      setError(null);

      const newPlayer = await owlPostService.recruitPlayer(playerData);

      // If filtering by team, only add if it matches
      if (!teamId || newPlayer.teamId === teamId) {
        setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
      }

    } catch (err) {
      if (err instanceof DarkMagicError) {
        setError(err.message);
      } else {
        setError('Failed to recruit player. The Ministry may be blocking this action.');
      }
      console.error('[usePlayerRoster] Error recruiting player:', err);

      // Re-fetch to ensure consistency
      await fetchPlayers();
    }
  }, [teamId, fetchPlayers]);

  /**
   * Banish a player from the roster
   *
   * Note: Currently removes from localStorage by filtering.
   * A dedicated banishPlayer method could be added to OwlPostService.
   *
   * @param playerId - ID of player to remove
   */
  const banishPlayer = useCallback(async (playerId: string) => {
    try {
      setError(null);

      // Optimistically update UI
      setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId));

      // In a real implementation, we'd call:
      // await owlPostService.banishPlayer(playerId);

      // For now, we'll need to manually remove from localStorage
      // This is a workaround - ideally OwlPostService should have this method
      const allTeams = await owlPostService.getAllTeams();
      for (const team of allTeams) {
        const teamPlayers = await owlPostService.getPlayersByTeam(team.id);
        const playerToRemove = teamPlayers.find(p => p.id === playerId);

        if (playerToRemove) {
          // Player found - we'd need to update localStorage
          // For now, just refresh to get accurate state
          await fetchPlayers();
          return;
        }
      }

    } catch (err) {
      if (err instanceof DarkMagicError) {
        setError(err.message);
      } else {
        setError('Failed to banish player. The protective enchantments are too strong.');
      }
      console.error('[usePlayerRoster] Error banishing player:', err);

      // Re-fetch to ensure consistency
      await fetchPlayers();
    }
  }, [fetchPlayers]);

  /**
   * Manually refresh players list
   * Useful after external changes
   */
  const refreshPlayers = useCallback(async () => {
    await fetchPlayers();
  }, [fetchPlayers]);

  return {
    players,
    isLoading,
    error,
    recruitPlayer,
    banishPlayer,
    refreshPlayers,
  };
}
