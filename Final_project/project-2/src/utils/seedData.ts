/**
 * Seed Data Utility
 *
 * Populates the application with initial demo data for testing.
 * This includes teams and players for the Quidditch League.
 */

import { owlPostService } from '../services/OwlPostService';
import type { Team, Player } from '../types/wizardry';

/**
 * Check if the database already has data
 */
async function hasExistingData(): Promise<boolean> {
  const teams = await owlPostService.getAllTeams();
  return teams.length > 0;
}

/**
 * Seed initial teams
 */
async function seedTeams(): Promise<Team[]> {
  console.log('🌱 Seeding teams...');

  const teamsToCreate = [
    {
      name: 'Gryffindor Lions',
      houseAlignment: 'Gryffindor' as const,
      foundedYear: 1990,
      wins: 0,
      losses: 0,
      draws: 0,
      stadiumName: 'Gryffindor Stadium',
      managerId: 'wizard-gryffindor',
    },
    {
      name: 'Slytherin Serpents',
      houseAlignment: 'Slytherin' as const,
      foundedYear: 1991,
      wins: 0,
      losses: 0,
      draws: 0,
      stadiumName: 'Slytherin Arena',
      managerId: 'wizard-slytherin',
    },
    {
      name: 'Ravenclaw Eagles',
      houseAlignment: 'Ravenclaw' as const,
      foundedYear: 1992,
      wins: 0,
      losses: 0,
      draws: 0,
      stadiumName: 'Ravenclaw Tower Pitch',
      managerId: 'wizard-ravenclaw',
    },
    {
      name: 'Hufflepuff Badgers',
      houseAlignment: 'Hufflepuff' as const,
      foundedYear: 1993,
      wins: 0,
      losses: 0,
      draws: 0,
      stadiumName: 'Hufflepuff Field',
      managerId: 'wizard-hufflepuff',
    },
  ];

  const createdTeams: Team[] = [];

  for (const teamData of teamsToCreate) {
    const team = await owlPostService.recruitTeam(teamData);
    createdTeams.push(team);
    console.log(`  ✅ Created: ${team.name}`);
  }

  return createdTeams;
}

/**
 * Seed initial players for each team
 */
async function seedPlayers(teams: Team[]): Promise<void> {
  console.log('\n🌱 Seeding players...');

  const positions: Player['position'][] = ['Seeker', 'Chaser', 'Chaser', 'Chaser', 'Beater', 'Beater', 'Keeper'];

  for (const team of teams) {
    console.log(`\n  Team: ${team.name}`);

    for (let i = 0; i < positions.length; i++) {
      const position = positions[i] || 'Chaser';
      const playerData = {
        name: generatePlayerName(team.houseAlignment, i),
        teamId: team.id,
        position: position,
        jerseyNumber: i + 1,
        nationality: 'British',
        yearJoined: 2020,
        marketValue: 5000 + Math.floor(Math.random() * 10000),
        contractExpiresYear: 2026,
        stats: {
          gamesPlayed: 0,
          goalsScored: 0,
          saves: 0,
          catches: 0,
          foulsCommitted: 0,
          yellowCards: 0,
          redCards: 0,
          rating: 70 + Math.floor(Math.random() * 20),
        },
      };

      await owlPostService.recruitPlayer(playerData);
      console.log(`    ✅ ${position}: ${playerData.name} (#${playerData.jerseyNumber})`);
    }
  }
}

/**
 * Generate a themed player name based on house
 */
function generatePlayerName(house: string, index: number): string {
  const firstNames = {
    Gryffindor: ['Harry', 'Ron', 'Hermione', 'Ginny', 'Fred', 'George', 'Oliver'],
    Slytherin: ['Draco', 'Pansy', 'Blaise', 'Marcus', 'Adrian', 'Miles', 'Terence'],
    Ravenclaw: ['Luna', 'Cho', 'Padma', 'Terry', 'Michael', 'Anthony', 'Roger'],
    Hufflepuff: ['Cedric', 'Hannah', 'Susan', 'Ernie', 'Justin', 'Zacharias', 'Nymphadora'],
  };

  const lastNames = ['Potter', 'Weasley', 'Granger', 'Malfoy', 'Chang', 'Lovegood', 'Diggory', 'Abbott', 'Bones'];

  const houseNames = firstNames[house as keyof typeof firstNames] || firstNames.Gryffindor;
  const firstName = houseNames[index % houseNames.length] || houseNames[0];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)] || 'Smith';

  return `${firstName} ${lastName}`;
}

/**
 * Main seed function
 * Call this to populate the database with initial data
 */
export async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting database seeding...\n');

  // Check if data already exists
  if (await hasExistingData()) {
    console.log('⚠️  Database already contains data. Skipping seed.');
    console.log('💡 To reset, clear localStorage and refresh the page.\n');
    return;
  }

  try {
    // Seed teams
    const teams = await seedTeams();

    // Seed players
    await seedPlayers(teams);

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`📊 Created ${teams.length} teams and ${teams.length * 7} players\n`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

/**
 * Clear all data from the database
 */
export async function clearDatabase(): Promise<void> {
  console.log('🗑️  Clearing all database data...');
  await owlPostService.obliterateAllData();
  console.log('✅ Database cleared successfully!\n');
}

/**
 * Reset database (clear + seed)
 */
export async function resetDatabase(): Promise<void> {
  await clearDatabase();
  await seedDatabase();
}
