/**
 * OwlPostService - Firebase Firestore Data Layer Service
 *
 * A class-based service managing magical owl post delivery system.
 * Now uses Firebase Firestore for production-grade persistence.
 * Handles all data operations with real-time database synchronization.
 *
 * @architecture Singleton Pattern - Use getInstance() to access
 * @example
 * ```typescript
 * const owlPost = OwlPostService.getInstance();
 * const teams = await owlPost.getAllTeams();
 * ```
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase';
import type { Team, Player, Match } from '../types/wizardry';

/**
 * Custom Error for corrupted or missing data
 * Thrown when dark magic has tampered with our data stores
 */
export class DarkMagicError extends Error {
  constructor(message: string, public readonly corruptedData?: unknown) {
    super(message);
    this.name = 'DarkMagicError';

    // Maintains proper stack trace for where error was thrown (V8 engines)
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, DarkMagicError);
    }
  }
}

/**
 * Firestore document with metadata
 */
interface FirestoreDoc<T> {
  id: string;
  data: T;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * OwlPostService - Main Data Service Class (Firebase Edition)
 *
 * Implements the Singleton pattern to ensure single source of truth
 * for all data operations across the application.
 */
export class OwlPostService {
  private static instance: OwlPostService;

  // Owl flight configuration (simulated delay for UX consistency)
  private readonly OWL_FLIGHT_DELAY = 400; // milliseconds (reduced for Firebase speed)

  /**
   * Private constructor enforces Singleton pattern
   * Use getInstance() to access the service
   */
  private constructor() {
    // No initialization needed for Firebase
    // Collections are created automatically on first write
  }

  /**
   * Get the singleton instance of OwlPostService
   * @returns The single instance of OwlPostService
   */
  public static getInstance(): OwlPostService {
    if (!OwlPostService.instance) {
      OwlPostService.instance = new OwlPostService();
    }
    return OwlPostService.instance;
  }

  /**
   * Simulates owl post flight delay
   * Mimics real-world network latency for authentic feel
   * @private
   */
  private async _simulateFlightDelay(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, this.OWL_FLIGHT_DELAY);
    });
  }

  /**
   * Convert Firestore Timestamp to Date
   * @private
   */
  private _timestampToDate(timestamp: any): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (timestamp?.toDate) {
      return timestamp.toDate();
    }
    return timestamp || new Date();
  }

  // ============================================================
  // PUBLIC API METHODS - TEAMS
  // ============================================================

  /**
   * Retrieve all Quidditch teams from Firestore
   * @returns Promise resolving to array of teams
   * @throws {DarkMagicError} If data retrieval fails
   */
  public async getAllTeams(): Promise<Team[]> {
    await this._simulateFlightDelay();

    try {
      const teamsCol = collection(db, COLLECTIONS.TEAMS);
      const snapshot = await getDocs(teamsCol);

      const teams: Team[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Team));

      return teams;
    } catch (error) {
      console.error('[OwlPostService] Failed to retrieve teams:', error);
      throw new DarkMagicError(
        'Failed to retrieve teams from the Ministry archives!',
        error
      );
    }
  }

  /**
   * Recruit a new team to the league
   * Creates team document in Firestore
   *
   * @param teamData - Team data without ID
   * @returns Promise resolving to the newly created team with ID
   * @throws {DarkMagicError} If save operation fails
   */
  public async recruitTeam(teamData: Omit<Team, 'id'>): Promise<Team> {
    await this._simulateFlightDelay();

    try {
      const teamsCol = collection(db, COLLECTIONS.TEAMS);

      const newTeamData = {
        ...teamData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(teamsCol, newTeamData);

      const newTeam: Team = {
        id: docRef.id,
        ...teamData,
      };

      return newTeam;
    } catch (error) {
      console.error('[OwlPostService] Failed to recruit team:', error);
      throw new DarkMagicError(
        'Failed to recruit team - Ministry registration blocked!',
        error
      );
    }
  }

  /**
   * Banish a team from the league
   * Removes team and all associated players from Firestore
   *
   * @param teamId - ID of team to remove
   * @returns Promise resolving when banishment is complete
   * @throws {DarkMagicError} If team doesn't exist or deletion fails
   */
  public async banishTeam(teamId: string): Promise<void> {
    await this._simulateFlightDelay();

    try {
      // Check if team exists
      const teamRef = doc(db, COLLECTIONS.TEAMS, teamId);
      const teamSnap = await getDoc(teamRef);

      if (!teamSnap.exists()) {
        throw new DarkMagicError(
          `Team with ID '${teamId}' has already vanished or never existed!`,
          { teamId }
        );
      }

      // Use batch for atomic operations
      const batch = writeBatch(db);

      // Delete team
      batch.delete(teamRef);

      // Delete all players on this team
      const playersCol = collection(db, COLLECTIONS.PLAYERS);
      const playersQuery = query(playersCol, where('teamId', '==', teamId));
      const playersSnapshot = await getDocs(playersQuery);

      playersSnapshot.docs.forEach((playerDoc) => {
        batch.delete(playerDoc.ref);
      });

      // Commit batch
      await batch.commit();
    } catch (error) {
      if (error instanceof DarkMagicError) {
        throw error;
      }
      console.error('[OwlPostService] Failed to banish team:', error);
      throw new DarkMagicError(
        'Failed to banish team - Ministry protection spell active!',
        error
      );
    }
  }

  // ============================================================
  // PUBLIC API METHODS - PLAYERS
  // ============================================================

  /**
   * Get all players for a specific team
   *
   * @param teamId - ID of the team
   * @returns Promise resolving to array of players
   * @throws {DarkMagicError} If data retrieval fails
   */
  public async getPlayersByTeam(teamId: string): Promise<Player[]> {
    await this._simulateFlightDelay();

    try {
      const playersCol = collection(db, COLLECTIONS.PLAYERS);
      const playersQuery = query(playersCol, where('teamId', '==', teamId));
      const snapshot = await getDocs(playersQuery);

      const players: Player[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Player));

      return players;
    } catch (error) {
      console.error('[OwlPostService] Failed to retrieve players:', error);
      throw new DarkMagicError(
        `Failed to retrieve players for team '${teamId}'!`,
        error
      );
    }
  }

  /**
   * Recruit a new player to a team
   *
   * @param playerData - Player data without ID
   * @returns Promise resolving to the newly created player with ID
   * @throws {DarkMagicError} If save operation fails
   */
  public async recruitPlayer(playerData: Omit<Player, 'id'>): Promise<Player> {
    await this._simulateFlightDelay();

    try {
      const playersCol = collection(db, COLLECTIONS.PLAYERS);

      const newPlayerData = {
        ...playerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(playersCol, newPlayerData);

      const newPlayer: Player = {
        id: docRef.id,
        ...playerData,
      };

      return newPlayer;
    } catch (error) {
      console.error('[OwlPostService] Failed to recruit player:', error);
      throw new DarkMagicError(
        'Failed to recruit player - Scouting network unavailable!',
        error
      );
    }
  }

  /**
   * Banish a player from a team
   *
   * @param playerId - ID of player to remove
   * @returns Promise resolving when banishment is complete
   * @throws {DarkMagicError} If player doesn't exist or deletion fails
   */
  public async banishPlayer(playerId: string): Promise<void> {
    await this._simulateFlightDelay();

    try {
      const playerRef = doc(db, COLLECTIONS.PLAYERS, playerId);
      const playerSnap = await getDoc(playerRef);

      if (!playerSnap.exists()) {
        throw new DarkMagicError(
          `Player with ID '${playerId}' has already vanished or never existed!`,
          { playerId }
        );
      }

      await deleteDoc(playerRef);
    } catch (error) {
      if (error instanceof DarkMagicError) {
        throw error;
      }
      console.error('[OwlPostService] Failed to banish player:', error);
      throw new DarkMagicError(
        'Failed to banish player - Contract protection spell active!',
        error
      );
    }
  }

  // ============================================================
  // PUBLIC API METHODS - MATCHES
  // ============================================================

  /**
   * Record a match result and update team/player stats
   * Uses Firestore batch writes for atomicity
   *
   * @param homeTeamId - ID of the home team
   * @param awayTeamId - ID of the away team
   * @param homeScore - Home team's score
   * @param awayScore - Away team's score
   * @returns Promise resolving to the newly created match
   * @throws {DarkMagicError} If teams don't exist or save fails
   */
  public async recordMatch(
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number
  ): Promise<Match> {
    await this._simulateFlightDelay();

    try {
      // Validate teams exist
      const homeTeamRef = doc(db, COLLECTIONS.TEAMS, homeTeamId);
      const awayTeamRef = doc(db, COLLECTIONS.TEAMS, awayTeamId);

      const [homeTeamSnap, awayTeamSnap] = await Promise.all([
        getDoc(homeTeamRef),
        getDoc(awayTeamRef),
      ]);

      if (!homeTeamSnap.exists()) {
        throw new DarkMagicError(
          `Home team '${homeTeamId}' not found!`,
          { homeTeamId }
        );
      }

      if (!awayTeamSnap.exists()) {
        throw new DarkMagicError(
          `Away team '${awayTeamId}' not found!`,
          { awayTeamId }
        );
      }

      const homeTeam = { id: homeTeamSnap.id, ...homeTeamSnap.data() } as Team;
      const awayTeam = { id: awayTeamSnap.id, ...awayTeamSnap.data() } as Team;

      // Create match record
      const matchesCol = collection(db, COLLECTIONS.MATCHES);
      const newMatchData = {
        homeTeamId,
        awayTeamId,
        homeScore,
        awayScore,
        date: serverTimestamp(),
        stadium: homeTeam.stadiumName,
        status: 'Completed',
        createdAt: serverTimestamp(),
      };

      const matchDocRef = await addDoc(matchesCol, newMatchData);

      const newMatch: Match = {
        id: matchDocRef.id,
        homeTeamId,
        awayTeamId,
        homeScore,
        awayScore,
        date: new Date(),
        stadium: homeTeam.stadiumName,
        status: 'Completed',
      };

      // Update team standings using batch
      const batch = writeBatch(db);

      // Update home team
      const homeTeamUpdates: Partial<Team> = {};
      if (homeScore > awayScore) {
        homeTeamUpdates.wins = (homeTeam.wins || 0) + 1;
      } else if (homeScore < awayScore) {
        homeTeamUpdates.losses = (homeTeam.losses || 0) + 1;
      } else {
        homeTeamUpdates.draws = (homeTeam.draws || 0) + 1;
      }
      homeTeamUpdates.updatedAt = serverTimestamp() as any;
      batch.update(homeTeamRef, homeTeamUpdates);

      // Update away team
      const awayTeamUpdates: Partial<Team> = {};
      if (awayScore > homeScore) {
        awayTeamUpdates.wins = (awayTeam.wins || 0) + 1;
      } else if (awayScore < homeScore) {
        awayTeamUpdates.losses = (awayTeam.losses || 0) + 1;
      } else {
        awayTeamUpdates.draws = (awayTeam.draws || 0) + 1;
      }
      awayTeamUpdates.updatedAt = serverTimestamp() as any;
      batch.update(awayTeamRef, awayTeamUpdates);

      // Update player stats (increment gamesPlayed for all players on both teams)
      const playersCol = collection(db, COLLECTIONS.PLAYERS);

      const homePlayersQuery = query(playersCol, where('teamId', '==', homeTeamId));
      const awayPlayersQuery = query(playersCol, where('teamId', '==', awayTeamId));

      const [homePlayersSnap, awayPlayersSnap] = await Promise.all([
        getDocs(homePlayersQuery),
        getDocs(awayPlayersQuery),
      ]);

      homePlayersSnap.docs.forEach((playerDoc) => {
        const playerData = playerDoc.data() as Player;
        batch.update(playerDoc.ref, {
          'stats.gamesPlayed': (playerData.stats?.gamesPlayed || 0) + 1,
          updatedAt: serverTimestamp(),
        });
      });

      awayPlayersSnap.docs.forEach((playerDoc) => {
        const playerData = playerDoc.data() as Player;
        batch.update(playerDoc.ref, {
          'stats.gamesPlayed': (playerData.stats?.gamesPlayed || 0) + 1,
          updatedAt: serverTimestamp(),
        });
      });

      // Commit all updates atomically
      await batch.commit();

      return newMatch;
    } catch (error) {
      if (error instanceof DarkMagicError) {
        throw error;
      }
      console.error('[OwlPostService] Failed to record match:', error);
      throw new DarkMagicError(
        'Failed to record match - Ministry archives sealed!',
        error
      );
    }
  }

  /**
   * Get all recorded matches from Firestore
   *
   * @returns Promise resolving to array of matches
   * @throws {DarkMagicError} If data retrieval fails
   */
  public async getAllMatches(): Promise<Match[]> {
    await this._simulateFlightDelay();

    try {
      const matchesCol = collection(db, COLLECTIONS.MATCHES);
      const snapshot = await getDocs(matchesCol);

      const matches: Match[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: this._timestampToDate(data.date),
        } as Match;
      });

      // Sort by date descending (newest first)
      matches.sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date.getTime() : 0;
        const dateB = b.date instanceof Date ? b.date.getTime() : 0;
        return dateB - dateA;
      });

      return matches;
    } catch (error) {
      console.error('[OwlPostService] Failed to retrieve matches:', error);
      throw new DarkMagicError(
        'Failed to retrieve matches from the archives!',
        error
      );
    }
  }

  /**
   * Clear all data (use with caution!)
   * Useful for testing or resetting the application
   * NOTE: In production, this should require admin privileges
   *
   * @returns Promise resolving when data is cleared
   */
  public async obliterateAllData(): Promise<void> {
    await this._simulateFlightDelay();

    try {
      const batch = writeBatch(db);

      // Delete all teams
      const teamsSnapshot = await getDocs(collection(db, COLLECTIONS.TEAMS));
      teamsSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

      // Delete all players
      const playersSnapshot = await getDocs(collection(db, COLLECTIONS.PLAYERS));
      playersSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

      // Delete all matches
      const matchesSnapshot = await getDocs(collection(db, COLLECTIONS.MATCHES));
      matchesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();
    } catch (error) {
      console.error('[OwlPostService] Failed to obliterate data:', error);
      throw new DarkMagicError(
        'Failed to obliterate data - Ministry protection active!',
        error
      );
    }
  }
}

// Export singleton instance for convenience
export const owlPostService = OwlPostService.getInstance();
