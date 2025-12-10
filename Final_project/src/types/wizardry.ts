/**
 * Core TypeScript interfaces for Wizarding World Quidditch Manager
 * Demonstrates type-safe architecture for portfolio showcase
 */

export type HouseAlignment =
  | 'Gryffindor'
  | 'Slytherin'
  | 'Hufflepuff'
  | 'Ravenclaw';

export type QuidditchPosition =
  | 'Keeper'
  | 'Chaser'
  | 'Beater'
  | 'Seeker';

/**
 * Wizard - The authenticated user managing teams
 */
export interface Wizard {
  id: string;
  name: string;
  email: string;
  house: HouseAlignment;
  wandCore?: string;
  patronus?: string;
  registeredAt: Date;
  role: 'Manager' | 'Scout' | 'Commissioner';
  galleons: number; // In-game currency
}

/**
 * Team - Quidditch team entity
 */
export interface Team {
  id: string;
  name: string;
  houseAlignment: HouseAlignment;
  foundedYear: number;
  wins: number;
  losses: number;
  draws: number;
  stadiumName: string;
  managerId: string; // References Wizard.id
  logoUrl?: string;
}

/**
 * Player - Individual Quidditch player
 */
export interface Player {
  id: string;
  teamId: string; // References Team.id
  name: string;
  position: QuidditchPosition;
  stats: PlayerStats;
  yearJoined: number;
  jerseyNumber: number;
  nationality: string;
  marketValue: number; // In Galleons
  contractExpiresYear: number;
}

/**
 * Player Statistics - Performance metrics
 */
export interface PlayerStats {
  gamesPlayed: number;
  goalsScored?: number; // For Chasers
  saves?: number; // For Keepers
  catches?: number; // For Seekers (Golden Snitch)
  foulsCommitted: number;
  yellowCards: number;
  redCards: number;
  rating: number; // 0-100
}

/**
 * Match result interface
 */
export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: Date;
  stadium: string;
  snitchCaughtBy?: string; // Player.id
  status: 'Scheduled' | 'Live' | 'Completed' | 'Postponed';
}

/**
 * Daily Prophet Feed Item
 */
export interface ProphetArticle {
  id: string;
  headline: string;
  content: string;
  author: string;
  publishedAt: Date;
  category: 'Transfer' | 'Match' | 'Injury' | 'Scandal' | 'General';
  imageUrl?: string;
  relatedTeamIds?: string[];
  relatedPlayerIds?: string[];
}
