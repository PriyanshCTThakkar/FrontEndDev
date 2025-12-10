/**
 * OwlPostService Usage Examples
 *
 * This file demonstrates how to use the OwlPostService
 * in various scenarios. Use these patterns in your React components.
 */

import { owlPostService, DarkMagicError } from './OwlPostService';
import type { Player } from '../types/wizardry';

/**
 * Example 1: Fetching all teams
 */
export async function exampleFetchTeams(): Promise<void> {
  try {
    const teams = await owlPostService.getAllTeams();
    console.log(`📋 Found ${teams.length} teams:`, teams);

    teams.forEach(team => {
      console.log(`  🏆 ${team.name} (${team.houseAlignment})`);
    });

  } catch (error) {
    if (error instanceof DarkMagicError) {
      console.error('🔮 Dark magic detected:', error.message);
      console.error('📦 Corrupted data:', error.corruptedData);
    } else {
      console.error('💥 Unexpected error:', error);
    }
  }
}

/**
 * Example 2: Recruiting a new team
 */
export async function exampleRecruitTeam(): Promise<void> {
  try {
    const newTeam = await owlPostService.recruitTeam({
      name: 'Holyhead Harpies',
      houseAlignment: 'Gryffindor',
      foundedYear: 1203,
      wins: 24,
      losses: 12,
      draws: 3,
      stadiumName: 'Harpy Heights',
      managerId: 'wizard-001',
      logoUrl: '/assets/harpies-logo.png',
    });

    console.log('✅ Team recruited successfully:', newTeam);
    console.log(`🆔 Generated ID: ${newTeam.id}`);

  } catch (error) {
    if (error instanceof DarkMagicError) {
      console.error('❌ Failed to recruit team:', error.message);
    }
  }
}

/**
 * Example 3: Recruiting multiple players to a team
 */
export async function exampleRecruitPlayers(teamId: string): Promise<void> {
  const players = [
    {
      name: 'Ginny Weasley',
      position: 'Chaser' as const,
      jerseyNumber: 7,
    },
    {
      name: 'Harry Potter',
      position: 'Seeker' as const,
      jerseyNumber: 1,
    },
  ];

  for (const playerData of players) {
    try {
      const newPlayer = await owlPostService.recruitPlayer({
        teamId,
        name: playerData.name,
        position: playerData.position,
        stats: {
          gamesPlayed: 0,
          goalsScored: 0,
          foulsCommitted: 0,
          yellowCards: 0,
          redCards: 0,
          rating: 75,
        },
        yearJoined: 2024,
        jerseyNumber: playerData.jerseyNumber,
        nationality: 'British',
        marketValue: 5000,
        contractExpiresYear: 2027,
      });

      console.log(`✅ Recruited: ${newPlayer.name} (#${newPlayer.jerseyNumber})`);

    } catch (error) {
      if (error instanceof DarkMagicError) {
        console.error(`❌ Failed to recruit ${playerData.name}:`, error.message);
      }
    }
  }
}

/**
 * Example 4: Getting players by team
 */
export async function exampleGetTeamRoster(teamId: string): Promise<void> {
  try {
    const players = await owlPostService.getPlayersByTeam(teamId);

    console.log(`\n👥 Team Roster (${players.length} players):`);

    const groupedByPosition = players.reduce((acc, player) => {
      if (!acc[player.position]) {
        acc[player.position] = [];
      }
      acc[player.position]!.push(player);
      return acc;
    }, {} as Record<string, Player[]>);

    Object.entries(groupedByPosition).forEach(([position, positionPlayers]) => {
      console.log(`\n  ⚡ ${position}s:`);
      positionPlayers.forEach(p => {
        console.log(`    #${p.jerseyNumber} ${p.name} (Rating: ${p.stats.rating})`);
      });
    });

  } catch (error) {
    if (error instanceof DarkMagicError) {
      console.error('❌ Failed to fetch roster:', error.message);
    }
  }
}

/**
 * Example 5: Banishing a team (with error handling)
 */
export async function exampleBanishTeam(teamId: string): Promise<void> {
  try {
    console.log(`🗑️  Attempting to banish team: ${teamId}`);

    await owlPostService.banishTeam(teamId);

    console.log('✅ Team banished successfully!');
    console.log('📝 All associated players have also been removed.');

  } catch (error) {
    if (error instanceof DarkMagicError) {
      console.error('❌ Banishment failed:', error.message);

      // Team doesn't exist - handle gracefully
      console.log('💡 Tip: Check if the team ID is correct');
    }
  }
}

/**
 * Example 6: Complete workflow - Create team and add players
 */
export async function exampleCompleteWorkflow(): Promise<void> {
  console.log('🚀 Starting complete workflow...\n');

  try {
    // Step 1: Create team
    const team = await owlPostService.recruitTeam({
      name: 'Puddlemere United',
      houseAlignment: 'Hufflepuff',
      foundedYear: 1163,
      wins: 0,
      losses: 0,
      draws: 0,
      stadiumName: 'Puddlemere Pitch',
      managerId: 'wizard-789',
    });

    console.log(`✅ Step 1: Created team "${team.name}" (ID: ${team.id})\n`);

    // Step 2: Add players
    await owlPostService.recruitPlayer({
      teamId: team.id,
      name: 'Oliver Wood',
      position: 'Keeper',
      stats: {
        gamesPlayed: 45,
        saves: 320,
        foulsCommitted: 12,
        yellowCards: 2,
        redCards: 0,
        rating: 88,
      },
      yearJoined: 2020,
      jerseyNumber: 1,
      nationality: 'Scottish',
      marketValue: 12000,
      contractExpiresYear: 2026,
    });

    console.log('✅ Step 2: Added Oliver Wood (Keeper)\n');

    // Step 3: Fetch roster
    const roster = await owlPostService.getPlayersByTeam(team.id);
    console.log(`✅ Step 3: Fetched roster - ${roster.length} player(s)\n`);

    // Step 4: Verify team exists
    const allTeams = await owlPostService.getAllTeams();
    const teamExists = allTeams.some(t => t.id === team.id);
    console.log(`✅ Step 4: Team verification - ${teamExists ? 'FOUND' : 'MISSING'}\n`);

    console.log('🎉 Workflow completed successfully!');

  } catch (error) {
    if (error instanceof DarkMagicError) {
      console.error('💥 Workflow failed:', error.message);
      console.error('🔍 Debug info:', error.corruptedData);
    }
  }
}

/**
 * Example 7: React Hook Usage Pattern
 *
 * This is how you'd use OwlPostService in a React component/hook:
 */
/*
import { useState, useEffect } from 'react';
import { owlPostService, DarkMagicError } from '@/services';
import type { Team } from '@/types';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true);
        setError(null);

        const data = await owlPostService.getAllTeams();
        setTeams(data);

      } catch (err) {
        if (err instanceof DarkMagicError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  return { teams, loading, error };
}
*/
