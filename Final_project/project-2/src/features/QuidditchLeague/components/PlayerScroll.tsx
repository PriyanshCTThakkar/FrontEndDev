/**
 * PlayerScroll - Presentational Component
 *
 * A purely presentational component that displays the list of Quidditch players.
 * Receives all data through props - contains NO business logic.
 *
 * Architecture Pattern: Container/Presentational Separation
 * - This component = Presentational (UI only, no hooks or logic)
 * - Parent component uses usePlayerRoster hook = Container (logic)
 *
 * Design: Styled like magical player cards with position badges
 *
 * @example
 * ```tsx
 * const { players, isLoading, error } = usePlayerRoster(teamId);
 *
 * <PlayerScroll
 *   players={players}
 *   isLoading={isLoading}
 *   error={error}
 *   onBanishPlayer={banishPlayer}
 * />
 * ```
 */

import type { Player } from '../../../types/wizardry';
import './PlayerScroll.css';

/**
 * Component Props Interface
 * All data comes from parent - no hooks used here
 */
interface PlayerScrollProps {
  players: Player[];
  isLoading: boolean;
  error: string | null;
  onBanishPlayer?: (playerId: string) => void;
  onPlayerClick?: (player: Player) => void;
  teamFilter?: string; // Optional team ID for filtering display
}

/**
 * PlayerScroll Component
 *
 * Displays players in a grid of cards.
 * Shows loading state with animated broomstick.
 *
 * @param props - Component props containing players data and callbacks
 */
export function PlayerScroll({
  players,
  isLoading,
  error,
  onBanishPlayer,
  onPlayerClick,
  teamFilter,
}: PlayerScrollProps) {
  // ========================================
  // LOADING STATE
  // ========================================
  if (isLoading) {
    return (
      <div className="player-scroll">
        <div className="scroll-header">
          <h2 className="scroll-title">⚡ Player Registry</h2>
          <p className="scroll-subtitle">Quidditch League Roster</p>
        </div>

        <div className="loading-broomstick">
          <div className="broomstick">🧹</div>
          <p className="loading-text">Summoning player rosters...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================
  if (error) {
    return (
      <div className="player-scroll">
        <div className="scroll-header">
          <h2 className="scroll-title">⚡ Player Registry</h2>
        </div>

        <div className="error-parchment">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Summoning Failed</h3>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  // ========================================
  // EMPTY STATE
  // ========================================
  if (players.length === 0) {
    return (
      <div className="player-scroll">
        <div className="scroll-header">
          <h2 className="scroll-title">⚡ Player Registry</h2>
        </div>

        <div className="empty-scroll">
          <div className="empty-icon">⚡</div>
          <h3 className="empty-title">No Players Registered</h3>
          <p className="empty-message">
            {teamFilter
              ? "This team hasn't recruited any players yet."
              : 'No players have been drafted to the league yet.'}
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // PLAYERS LIST
  // ========================================
  return (
    <div className="player-scroll">
      {/* Scroll Header */}
      <div className="scroll-header">
        <h2 className="scroll-title">⚡ Player Registry</h2>
        <p className="scroll-subtitle">Quidditch League Roster</p>
        <div className="player-count-badge">
          {players.length} {players.length === 1 ? 'Player' : 'Players'} Registered
        </div>
      </div>

      {/* Players Grid */}
      <div className="players-grid">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onBanish={onBanishPlayer}
            onClick={onPlayerClick}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * PlayerCard - Individual Player Display
 *
 * Presentational component for a single player.
 * Shows name, position, jersey number, and stats.
 */
interface PlayerCardProps {
  player: Player;
  onBanish?: (playerId: string) => void;
  onClick?: (player: Player) => void;
}

function PlayerCard({ player, onBanish, onClick }: PlayerCardProps) {
  const handleBanish = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onBanish && confirm(`Release ${player.name} from the team?`)) {
      onBanish(player.id);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(player);
    }
  };

  return (
    <div
      className={`player-card ${onClick ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      {/* Player Header */}
      <div className="player-card-header">
        <div className="player-jersey-circle">
          #{player.jerseyNumber}
        </div>

        {onBanish && (
          <button
            className="release-button"
            onClick={handleBanish}
            title="Release player"
            aria-label={`Release ${player.name}`}
          >
            ✨
          </button>
        )}
      </div>

      {/* Player Info */}
      <div className="player-info">
        <h3 className="player-name">{player.name}</h3>

        <span className={`position-badge position-${player.position.toLowerCase()}`}>
          {getPositionEmoji(player.position)} {player.position}
        </span>
      </div>

      {/* Player Stats */}
      <div className="player-stats">
        <div className="stat-item">
          <span className="stat-label">Year Joined:</span>
          <span className="stat-value">{player.yearJoined}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Games:</span>
          <span className="stat-value">{player.stats.gamesPlayed}</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Rating:</span>
          <span className="stat-value stat-highlight">
            {player.stats.rating}/100
          </span>
        </div>

        {/* Position-specific stats */}
        {player.position === 'Chaser' && player.stats.goalsScored !== undefined && (
          <div className="stat-item">
            <span className="stat-label">Goals:</span>
            <span className="stat-value">{player.stats.goalsScored}</span>
          </div>
        )}

        {player.position === 'Keeper' && player.stats.saves !== undefined && (
          <div className="stat-item">
            <span className="stat-label">Saves:</span>
            <span className="stat-value">{player.stats.saves}</span>
          </div>
        )}

        {player.position === 'Seeker' && player.stats.catches !== undefined && (
          <div className="stat-item">
            <span className="stat-label">Catches:</span>
            <span className="stat-value">{player.stats.catches}</span>
          </div>
        )}

        <div className="stat-item">
          <span className="stat-label">Value:</span>
          <span className="stat-value">{player.marketValue.toLocaleString()} 🪙</span>
        </div>

        <div className="stat-item">
          <span className="stat-label">Contract:</span>
          <span className="stat-value">Until {player.contractExpiresYear}</span>
        </div>
      </div>

      {/* Player Footer */}
      <div className="player-footer">
        <span className="nationality-badge">📍 {player.nationality}</span>
      </div>
    </div>
  );
}

/**
 * Utility: Get emoji for each position
 */
function getPositionEmoji(position: string): string {
  const emojiMap: Record<string, string> = {
    Keeper: '🛡️',
    Chaser: '⚡',
    Beater: '🏏',
    Seeker: '🔍',
  };
  return emojiMap[position] || '⚡';
}
