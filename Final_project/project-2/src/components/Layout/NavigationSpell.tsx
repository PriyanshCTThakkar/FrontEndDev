/**
 * NavigationSpell - Main Navigation Bar
 *
 * The primary navigation component for the Wizarding World Quidditch Manager.
 * Adapted for @tanstack/react-router compliance.
 */

import { Link, useNavigate } from '@tanstack/react-router';
import { useMinistryAuth } from '../../features/MinistryAuth/context/MinistryAuthContext';
// Keep your CSS import
import './NavigationSpell.css';

/**
 * NavigationSpell Component
 *
 * Main navigation bar with authentication-aware UI
 */
export function NavigationSpell() {
  const { state, logout } = useMinistryAuth();
  const navigate = useNavigate();

  const handleVanish = () => {
    logout();
    navigate({ to: '/' }); // Updated to object syntax for TanStack Router
  };

  return (
    <nav className="navigation-spell">
      {/* Brand/Logo */}
      <div className="nav-brand">
        <Link to="/">
          <h1 className="app-title">⚡ Quidditch Manager</h1>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        {/* Public Links */}
        <Link to="/" className="nav-link">
          Home
        </Link>

        {state.isAuthenticated ? (
          <>
            {/* Protected Links - Only show when authenticated */}
            <Link to="/quidditch-command" className="nav-link nav-link-primary">
              📰 The Daily Prophet
            </Link>

            <Link to="/quidditch-league-registry" className="nav-link">
              🏆 League Registry
            </Link>

            <Link to="/scouting-network" className="nav-link">
              ⚡ Player Scouting
            </Link>

            <Link to="/match-statistics" className="nav-link">
              📊 Match Statistics
            </Link>
          </>
        ) : (
          <>
            <Link to="/ministry-portal" className="nav-link nav-link-highlight">
              Login
            </Link>
            <Link to="/ministry-enlistment" className="nav-link nav-link-highlight">
              Enlist Now
            </Link>
          </>
        )}
      </div>

      {/* User Info & Actions */}
      <div className="nav-actions">
        {state.isAuthenticated && state.wizard ? (
          <>
            {/* Wizard Info */}
            <div className="wizard-info">
              <span className="wizard-name">{state.wizard.name}</span>
              <span className="wizard-house house-badge">
                {getHouseEmoji(state.wizard.house)} {state.wizard.house}
              </span>
              <span className="wizard-galleons">
                {state.wizard.galleons.toLocaleString()} 🪙
              </span>
            </div>

            {/* Vanish (Logout) Button */}
            <button
              onClick={handleVanish}
              className="vanish-button"
              title="Cast Logout Spell"
            >
              ✨ Vanish
            </button>
          </>
        ) : (
          <div className="nav-cta">
            <span className="nav-hint">Join the League</span>
          </div>
        )}
      </div>
    </nav>
  );
}

/**
 * Get emoji for each Hogwarts house
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