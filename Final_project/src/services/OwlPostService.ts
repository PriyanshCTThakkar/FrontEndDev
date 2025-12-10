/**
 * OwlPostService - Data Layer Service
 *
 * A class-based service simulating magical owl post delivery system.
 * Handles all data persistence with localStorage and simulates network latency.
 *
 * @architecture Singleton Pattern - Use getInstance() to access
 * @example
 * ```typescript
 * const owlPost = OwlPostService.getInstance();
 * const teams = await owlPost.getAllTeams();
 * ```
 */

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
 * Magical signature injected into all data objects
 * Ensures data authenticity and tracks when it was stored
 */
interface MagicalSignature {
  _timestamp: number;
  _spellId: string;
  _owlDelivery: string;
}

/**
 * Data shape stored in localStorage with magical signature
 */
type MagicalData<T> = T & MagicalSignature;

/**
 * OwlPostService - Main Data Service Class
 *
 * Implements the Singleton pattern to ensure single source of truth
 * for all data operations across the application.
 */
export class OwlPostService {
  private static instance: OwlPostService;

  // LocalStorage keys
  private readonly TEAMS_KEY = 'quidditch_teams';
  private readonly PLAYERS_KEY = 'quidditch_players';
  private readonly MATCHES_KEY = 'quidditch_matches';

  // Owl flight configuration
  private readonly OWL_FLIGHT_DELAY = 800; // milliseconds

  /**
   * Private constructor enforces Singleton pattern
   * Use getInstance() to access the service
   */
  private constructor() {
    this._initializeStorage();
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
   * Adds magical signature to data before storage
   * Injects timestamp and unique spell ID for data tracking
   * @private
   * @param data - Any data object to sign
   * @returns Data with magical signature attached
   */
  private _addMagicalSignature<T extends object>(data: T): MagicalData<T> {
    return {
      ...data,
      _timestamp: Date.now(),
      _spellId: this._generateSpellId(),
      _owlDelivery: 'Hedwig Express',
    };
  }

  /**
   * Generates a random spell ID for data authenticity
   * Format: WIZ-XXXXXXXX (8 random hex characters)
   * @private
   */
  private _generateSpellId(): string {
    return `WIZ-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  }

  /**
   * Generates a unique UUID for new entities
   * @private
   */
  private _generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Initialize localStorage if empty
   * @private
   */
  private _initializeStorage(): void {
    if (!localStorage.getItem(this.TEAMS_KEY)) {
      localStorage.setItem(this.TEAMS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.PLAYERS_KEY)) {
      localStorage.setItem(this.PLAYERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.MATCHES_KEY)) {
      localStorage.setItem(this.MATCHES_KEY, JSON.stringify([]));
    }
  }

  /**
   * Safely retrieve and parse data from localStorage
   * @private
   * @param key - LocalStorage key
   * @throws {DarkMagicError} If data is corrupted or invalid
   */
  private _getFromStorage<T>(key: string): MagicalData<T>[] {
    try {
      const raw = localStorage.getItem(key);

      if (raw === null) {
        throw new DarkMagicError(
          `Data store '${key}' has been cursed and vanished!`,
          null
        );
      }

      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        throw new DarkMagicError(
          `Data store '${key}' has been transfigured into invalid form!`,
          parsed
        );
      }

      return parsed as MagicalData<T>[];

    } catch (error) {
      if (error instanceof DarkMagicError) {
        throw error;
      }

      // JSON parsing error
      throw new DarkMagicError(
        `Failed to read from '${key}' - Dark magic has corrupted the data!`,
        error
      );
    }
  }

  /**
   * Safely save data to localStorage with magical signature
   * @private
   * @param key - LocalStorage key
   * @param data - Data array to save
   * @throws {DarkMagicError} If save operation fails
   */
  private _saveToStorage<T extends object>(key: string, data: T[]): void {
    try {
      const signedData = data.map(item =>
        '_spellId' in item ? item : this._addMagicalSignature(item)
      );

      localStorage.setItem(key, JSON.stringify(signedData));

    } catch (error) {
      throw new DarkMagicError(
        `Failed to save to '${key}' - The Unforgivable Curse blocks this action!`,
        error
      );
    }
  }

  /**
   * Strip magical signature from data before returning to client
   * @private
   */
  private _removeMagicalSignature<T>(data: MagicalData<T>): T {
    const { _timestamp, _spellId, _owlDelivery, ...cleanData } = data;
    return cleanData as T;
  }

  // ============================================================
  // PUBLIC API METHODS
  // ============================================================

  /**
   * Retrieve all Quidditch teams
   * @returns Promise resolving to array of teams
   * @throws {DarkMagicError} If data retrieval fails
   *
   * @example
   * ```typescript
   * const teams = await owlPost.getAllTeams();
   * console.log(teams.length); // 4
   * ```
   */
  public async getAllTeams(): Promise<Team[]> {
    await this._simulateFlightDelay();

    const magicalTeams = this._getFromStorage<Team>(this.TEAMS_KEY);
    return magicalTeams.map(team => this._removeMagicalSignature(team));
  }

  /**
   * Recruit a new team to the league
   * Generates unique ID and saves with magical signature
   *
   * @param teamData - Team data without ID
   * @returns Promise resolving to the newly created team with ID
   * @throws {DarkMagicError} If save operation fails
   *
   * @example
   * ```typescript
   * const newTeam = await owlPost.recruitTeam({
   *   name: 'Holyhead Harpies',
   *   houseAlignment: 'Gryffindor',
   *   foundedYear: 1203,
   *   wins: 0,
   *   losses: 0,
   *   draws: 0,
   *   stadiumName: 'Harpy Stadium',
   *   managerId: 'wizard-123',
   * });
   * ```
   */
  public async recruitTeam(teamData: Omit<Team, 'id'>): Promise<Team> {
    await this._simulateFlightDelay();

    const newTeam: Team = {
      id: this._generateId(),
      ...teamData,
    };

    const existingTeams = this._getFromStorage<Team>(this.TEAMS_KEY);
    const updatedTeams = [
      ...existingTeams.map(t => this._removeMagicalSignature(t)),
      newTeam,
    ];

    this._saveToStorage(this.TEAMS_KEY, updatedTeams);

    return newTeam;
  }

  /**
   * Banish a team from the league
   * Removes team and all associated players
   *
   * @param teamId - ID of team to remove
   * @returns Promise resolving when banishment is complete
   * @throws {DarkMagicError} If team doesn't exist or deletion fails
   *
   * @example
   * ```typescript
   * await owlPost.banishTeam('team-123');
   * ```
   */
  public async banishTeam(teamId: string): Promise<void> {
    await this._simulateFlightDelay();

    const existingTeams = this._getFromStorage<Team>(this.TEAMS_KEY);
    const teamExists = existingTeams.some(
      t => this._removeMagicalSignature(t).id === teamId
    );

    if (!teamExists) {
      throw new DarkMagicError(
        `Team with ID '${teamId}' has already vanished or never existed!`,
        { teamId }
      );
    }

    // Remove team
    const filteredTeams = existingTeams
      .map(t => this._removeMagicalSignature(t))
      .filter(team => team.id !== teamId);

    this._saveToStorage(this.TEAMS_KEY, filteredTeams);

    // Remove associated players
    const existingPlayers = this._getFromStorage<Player>(this.PLAYERS_KEY);
    const filteredPlayers = existingPlayers
      .map(p => this._removeMagicalSignature(p))
      .filter(player => player.teamId !== teamId);

    this._saveToStorage(this.PLAYERS_KEY, filteredPlayers);
  }

  /**
   * Get all players for a specific team
   *
   * @param teamId - ID of the team
   * @returns Promise resolving to array of players
   * @throws {DarkMagicError} If data retrieval fails
   *
   * @example
   * ```typescript
   * const players = await owlPost.getPlayersByTeam('team-123');
   * const seekers = players.filter(p => p.position === 'Seeker');
   * ```
   */
  public async getPlayersByTeam(teamId: string): Promise<Player[]> {
    await this._simulateFlightDelay();

    const allPlayers = this._getFromStorage<Player>(this.PLAYERS_KEY);

    return allPlayers
      .map(p => this._removeMagicalSignature(p))
      .filter(player => player.teamId === teamId);
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

    const newPlayer: Player = {
      id: this._generateId(),
      ...playerData,
    };

    const existingPlayers = this._getFromStorage<Player>(this.PLAYERS_KEY);
    const updatedPlayers = [
      ...existingPlayers.map(p => this._removeMagicalSignature(p)),
      newPlayer,
    ];

    this._saveToStorage(this.PLAYERS_KEY, updatedPlayers);

    return newPlayer;
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

    const existingPlayers = this._getFromStorage<Player>(this.PLAYERS_KEY);
    const playerExists = existingPlayers.some(
      p => this._removeMagicalSignature(p).id === playerId
    );

    if (!playerExists) {
      throw new DarkMagicError(
        `Player with ID '${playerId}' has already vanished or never existed!`,
        { playerId }
      );
    }

    const filteredPlayers = existingPlayers
      .map(p => this._removeMagicalSignature(p))
      .filter(player => player.id !== playerId);

    this._saveToStorage(this.PLAYERS_KEY, filteredPlayers);
  }

  /**
   * Record a match result and update team/player stats
   *
   * @param homeTeamId - ID of the home team
   * @param awayTeamId - ID of the away team
   * @param homeScore - Home team's score
   * @param awayScore - Away team's score
   * @returns Promise resolving to the newly created match
   * @throws {DarkMagicError} If teams don't exist or save fails
   *
   * @example
   * ```typescript
   * const match = await owlPost.recordMatch(
   *   'team-1',
   *   'team-2',
   *   180,
   *   150
   * );
   * ```
   */
  public async recordMatch(
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number
  ): Promise<Match> {
    await this._simulateFlightDelay();

    // Validate teams exist
    const allTeams = this._getFromStorage<Team>(this.TEAMS_KEY)
      .map(t => this._removeMagicalSignature(t));

    const homeTeam = allTeams.find(t => t.id === homeTeamId);
    const awayTeam = allTeams.find(t => t.id === awayTeamId);

    if (!homeTeam) {
      throw new DarkMagicError(
        `Home team '${homeTeamId}' not found!`,
        { homeTeamId }
      );
    }

    if (!awayTeam) {
      throw new DarkMagicError(
        `Away team '${awayTeamId}' not found!`,
        { awayTeamId }
      );
    }

    // Create match record
    const newMatch: Match = {
      id: this._generateId(),
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      date: new Date(),
      stadium: homeTeam.stadiumName,
      status: 'Completed',
    };

    // Save match
    const existingMatches = this._getFromStorage<Match>(this.MATCHES_KEY);
    const updatedMatches = [
      ...existingMatches.map(m => this._removeMagicalSignature(m)),
      newMatch,
    ];
    this._saveToStorage(this.MATCHES_KEY, updatedMatches);

    // Update team standings
    const updatedTeams = allTeams.map(team => {
      if (team.id === homeTeamId) {
        if (homeScore > awayScore) {
          return { ...team, wins: team.wins + 1 };
        } else if (homeScore < awayScore) {
          return { ...team, losses: team.losses + 1 };
        } else {
          return { ...team, draws: team.draws + 1 };
        }
      } else if (team.id === awayTeamId) {
        if (awayScore > homeScore) {
          return { ...team, wins: team.wins + 1 };
        } else if (awayScore < homeScore) {
          return { ...team, losses: team.losses + 1 };
        } else {
          return { ...team, draws: team.draws + 1 };
        }
      }
      return team;
    });

    this._saveToStorage(this.TEAMS_KEY, updatedTeams);

    // Update player stats (increment matchesPlayed for all players on both teams)
    const allPlayers = this._getFromStorage<Player>(this.PLAYERS_KEY)
      .map(p => this._removeMagicalSignature(p));

    const updatedPlayers = allPlayers.map(player => {
      if (player.teamId === homeTeamId || player.teamId === awayTeamId) {
        return {
          ...player,
          stats: {
            ...player.stats,
            gamesPlayed: player.stats.gamesPlayed + 1,
          },
        };
      }
      return player;
    });

    this._saveToStorage(this.PLAYERS_KEY, updatedPlayers);

    return newMatch;
  }

  /**
   * Get all recorded matches
   *
   * @returns Promise resolving to array of matches
   * @throws {DarkMagicError} If data retrieval fails
   */
  public async getAllMatches(): Promise<Match[]> {
    await this._simulateFlightDelay();

    const magicalMatches = this._getFromStorage<Match>(this.MATCHES_KEY);
    return magicalMatches.map(match => this._removeMagicalSignature(match));
  }

  /**
   * Clear all data (use with caution!)
   * Useful for testing or resetting the application
   *
   * @returns Promise resolving when data is cleared
   */
  public async obliterateAllData(): Promise<void> {
    await this._simulateFlightDelay();

    localStorage.removeItem(this.TEAMS_KEY);
    localStorage.removeItem(this.PLAYERS_KEY);
    localStorage.removeItem(this.MATCHES_KEY);

    this._initializeStorage();
  }
}

// Export singleton instance for convenience
export const owlPostService = OwlPostService.getInstance();
