/**
 * LeagueScroll - Presentational Component
 *
 * A purely presentational component that displays the list of Quidditch teams.
 * Receives all data through props - contains NO business logic.
 *
 * Architecture Pattern: Container/Presentational Separation
 * - This component = Presentational (UI only, no hooks or logic)
 * - Parent component uses useTeamList hook = Container (logic)
 *
 * Design: Styled like a magical parchment scroll with ink text
 *
 * @example
 * ```tsx
 * const { teams, isLoading, error } = useTeamList();
 *
 * <LeagueScroll
 *   teams={teams}
 *   isLoading={isLoading}
 *   error={error}
 *   onBanishTeam={banishTeam}
 * />
 * ```
 */

import type { Team } from '../../../types/wizardry';
import './LeagueScroll.css';

/**
 * Component Props Interface
 * All data comes from parent - no hooks used here
 */
interface LeagueScrollProps {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  onBanishTeam?: (teamId: string) => void;
  onTeamClick?: (team: Team) => void;
}

/**
 * LeagueScroll Component
 *
 * Displays teams in a parchment-styled scrollable list.
 * Shows loading state with a "Loading Potion" spinner.
 *
 * @param props - Component props containing teams data and callbacks
 */
export function LeagueScroll({
  teams,
  isLoading,
  error,
  onBanishTeam,
  onTeamClick,
}: LeagueScrollProps) {
  // ========================================
  // LOADING STATE
  // ========================================
  if (isLoading) {
    return (
      <div className="league-scroll">
        <div className="scroll-header">
          <h2 className="scroll-title">Quidditch League Registry</h2>
          <p className="scroll-subtitle">Official Ministry Records</p>
        </div>

        <div className="loading-potion">
          <div className="potion-bottle">
            <div className="potion-bubble"></div>
            <div className="potion-bubble"></div>
            <div className="potion-bubble"></div>
          </div>
          <p className="loading-text">Brewing team data potion...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================
  if (error) {
    return (
      <div className="league-scroll">
        <div className="scroll-header">
          <h2 className="scroll-title">Quidditch League Registry</h2>
          <p className="scroll-subtitle">Official Ministry Records</p>
        </div>

        <div className="error-parchment">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Dark Magic Detected</h3>
          <p className="error-message">{error}</p>
          <p className="error-hint">
            Please contact the Ministry of Magic for assistance.
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // EMPTY STATE
  // ========================================
  if (teams.length === 0) {
    return (
      <div className="league-scroll">
        <div className="scroll-header">
          <h2 className="scroll-title">Quidditch League Registry</h2>
          <p className="scroll-subtitle">Official Ministry Records</p>
        </div>

        <div className="empty-scroll">
          <div className="empty-icon">🏆</div>
          <h3 className="empty-title">No Teams Registered</h3>
          <p className="empty-message">
            The Quidditch League is awaiting new teams to join.
            Be the first to recruit a team!
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // TEAMS LIST
  // ========================================
  return (
    <div className="league-scroll">
      {/* Scroll Header */}
      <div className="scroll-header">
        <h2 className="scroll-title">Quidditch League Registry</h2>
        <p className="scroll-subtitle">Official Ministry Records</p>
        <div className="team-count-badge">
          {teams.length} {teams.length === 1 ? 'Team' : 'Teams'} Registered
        </div>
      </div>

      {/* Teams Grid */}
      <div className="teams-parchment">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onBanish={onBanishTeam}
            onClick={onTeamClick}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * TeamCard - Individual Team Display
 *
 * Presentational component for a single team.
 * Styled like a parchment card with ink text.
 */
interface TeamCardProps {
  team: Team;
  onBanish?: (teamId: string) => void;
  onClick?: (team: Team) => void;
}

function TeamCard({ team, onBanish, onClick }: TeamCardProps) {
  const handleBanish = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onBanish && confirm(`Banish ${team.name}? This will remove all players!`)) {
      onBanish(team.id);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(team);
    }
  };

  // Calculate win percentage
  const totalGames = team.wins + team.losses + team.draws;
  const winPercentage = totalGames > 0
    ? ((team.wins / totalGames) * 100).toFixed(1)
    : '0.0';

  return (
    <div
      className={`team-card ${onClick ? 'clickable' : ''}`}
      onClick={handleClick}
    >
      {/* Team Header */}
      <div className="team-card-header">
        <div className="team-name-section">
          <h3 className="team-name">{team.name}</h3>
          <span className={`house-badge house-${team.houseAlignment.toLowerCase()}`}>
            {getHouseEmoji(team.houseAlignment)} {team.houseAlignment}
          </span>
        </div>

        {onBanish && (
          <button
            className="banish-button"
            onClick={handleBanish}
            title="Banish team from league"
            aria-label={`Banish ${team.name}`}
          >
            ✨ Vanish
          </button>
        )}
      </div>

      {/* Team Stats */}
      <div className="team-stats">
        <div className="stat-row">
          <span className="stat-label">Founded:</span>
          <span className="stat-value">{team.foundedYear}</span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Stadium:</span>
          <span className="stat-value">{team.stadiumName}</span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Record:</span>
          <span className="stat-value">
            {team.wins}W - {team.losses}L - {team.draws}D
          </span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Win Rate:</span>
          <span className="stat-value stat-highlight">{winPercentage}%</span>
        </div>
      </div>

      {/* Team Logo (if available) */}
      {team.logoUrl && (
        <div className="team-logo-section">
          <img
            src={team.logoUrl}
            alt={`${team.name} logo`}
            className="team-logo"
          />
        </div>
      )}
    </div>
  );
}

/**
 * Utility: Get emoji for each Hogwarts house
 */
function getHouseEmoji(house: string): string {
  const emojiMap: Record<string, string> = {
    Gryffindor: '🦁',
    Slytherin: '🐍',
    Hufflepuff: '🦡',
    Ravenclaw: '🦅',
  };
  return emojiMap[house] || '⚡';
}
