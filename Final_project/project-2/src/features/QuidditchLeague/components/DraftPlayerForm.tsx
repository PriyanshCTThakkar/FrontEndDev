/**
 * DraftPlayerForm - Player Recruitment Form
 *
 * A Scouting Report-themed form for drafting new Quidditch players to teams.
 * Handles local form state and validation, delegates submission to parent.
 *
 * Architecture Pattern: Controlled Component
 * - Manages own form state (useState)
 * - Receives submission handler via props
 * - Validates before submitting
 *
 * @example
 * ```tsx
 * const { recruitPlayer } = usePlayerRoster();
 *
 * <DraftPlayerForm
 *   teamId="team-123"
 *   onDraft={recruitPlayer}
 *   onCancel={() => setShowForm(false)}
 * />
 * ```
 */

import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { Player, QuidditchPosition } from '../../../types/wizardry';
import './DraftPlayerForm.css';

/**
 * Component Props Interface
 */
interface DraftPlayerFormProps {
  teamId: string;
  onDraft: (playerData: Omit<Player, 'id'>) => Promise<void>;
  onCancel: () => void;
}

/**
 * Form field validation errors
 */
interface FormErrors {
  playerName?: string;
  jerseyNumber?: string;
  nationality?: string;
  contractExpiresYear?: string;
}

/**
 * DraftPlayerForm Component
 *
 * Scouting-styled form for drafting new players to a team.
 * Includes validation and loading states.
 */
export function DraftPlayerForm({
  teamId,
  onDraft,
  onCancel,
}: DraftPlayerFormProps) {
  // ========================================
  // FORM STATE
  // ========================================
  const [playerName, setPlayerName] = useState('');
  const [position, setPosition] = useState<QuidditchPosition>('Seeker');
  const [jerseyNumber, setJerseyNumber] = useState<number>(1);
  const [yearJoined, setYearJoined] = useState<number>(new Date().getFullYear());
  const [nationality, setNationality] = useState('British');
  const [marketValue, setMarketValue] = useState<number>(5000);
  const [contractExpiresYear, setContractExpiresYear] = useState<number>(
    new Date().getFullYear() + 3
  );

  // ========================================
  // UI STATE
  // ========================================
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // ========================================
  // VALIDATION
  // ========================================
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Player Name validation
    if (!playerName.trim()) {
      newErrors.playerName = 'Player name is required';
    } else if (playerName.trim().length < 2) {
      newErrors.playerName = 'Player name must be at least 2 characters';
    }

    // Jersey Number validation
    if (jerseyNumber < 1 || jerseyNumber > 99) {
      newErrors.jerseyNumber = 'Jersey number must be between 1 and 99';
    }

    // Nationality validation
    if (!nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
    }

    // Contract validation
    const currentYear = new Date().getFullYear();
    if (contractExpiresYear <= currentYear) {
      newErrors.contractExpiresYear = 'Contract must extend beyond current year';
    } else if (contractExpiresYear > currentYear + 10) {
      newErrors.contractExpiresYear = 'Contract cannot exceed 10 years';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========================================
  // FORM SUBMISSION
  // ========================================
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      // Create player data object
      const playerData: Omit<Player, 'id'> = {
        teamId,
        name: playerName.trim(),
        position,
        stats: {
          gamesPlayed: 0,
          goalsScored: position === 'Chaser' ? 0 : undefined,
          saves: position === 'Keeper' ? 0 : undefined,
          catches: position === 'Seeker' ? 0 : undefined,
          foulsCommitted: 0,
          yellowCards: 0,
          redCards: 0,
          rating: 50, // Starting rating
        },
        yearJoined,
        jerseyNumber,
        nationality: nationality.trim(),
        marketValue,
        contractExpiresYear,
      };

      // Call parent's draft handler
      await onDraft(playerData);

      // Success - form will be closed by parent
    } catch (error) {
      console.error('[DraftPlayerForm] Submission failed:', error);
      setErrors({
        playerName: 'Failed to draft player. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // INPUT HANDLERS
  // ========================================
  const handlePlayerNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
    if (errors.playerName) {
      setErrors({ ...errors, playerName: undefined });
    }
  };

  const handleJerseyNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    setJerseyNumber(Number(e.target.value));
    if (errors.jerseyNumber) {
      setErrors({ ...errors, jerseyNumber: undefined });
    }
  };

  const handleNationalityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNationality(e.target.value);
    if (errors.nationality) {
      setErrors({ ...errors, nationality: undefined });
    }
  };

  const handleContractYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setContractExpiresYear(Number(e.target.value));
    if (errors.contractExpiresYear) {
      setErrors({ ...errors, contractExpiresYear: undefined });
    }
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="draft-form-overlay">
      <div className="draft-form-container">
        {/* Form Header */}
        <div className="form-header">
          <h2 className="form-title">
            ⚡ Scouting Report
          </h2>
          <h3 className="form-subtitle">
            Player Draft Registration
          </h3>
          <p className="form-description">
            Register a new player to join the Quidditch league roster.
          </p>
        </div>

        {/* Draft Form */}
        <form onSubmit={handleSubmit} className="draft-form">
          {/* Player Name */}
          <div className="form-field">
            <label htmlFor="playerName" className="field-label">
              Player Name <span className="required">*</span>
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={handlePlayerNameChange}
              placeholder="Enter full name (e.g., Harry Potter)"
              className={`field-input ${errors.playerName ? 'input-error' : ''}`}
              disabled={isSubmitting}
              maxLength={50}
            />
            {errors.playerName && (
              <span className="field-error">{errors.playerName}</span>
            )}
          </div>

          {/* Position - STRICT DROPDOWN */}
          <div className="form-field">
            <label htmlFor="position" className="field-label">
              Position <span className="required">*</span>
            </label>
            <select
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value as QuidditchPosition)}
              className="field-select"
              disabled={isSubmitting}
            >
              <option value="Seeker">🔍 Seeker - Catches the Golden Snitch</option>
              <option value="Chaser">⚡ Chaser - Scores with the Quaffle</option>
              <option value="Beater">🏏 Beater - Hits Bludgers</option>
              <option value="Keeper">🛡️ Keeper - Defends the goal hoops</option>
            </select>
            <p className="field-hint">
              Select the primary playing position for this player
            </p>
          </div>

          {/* Jersey Number */}
          <div className="form-field">
            <label htmlFor="jerseyNumber" className="field-label">
              Jersey Number <span className="required">*</span>
            </label>
            <input
              id="jerseyNumber"
              type="number"
              value={jerseyNumber}
              onChange={handleJerseyNumberChange}
              min={1}
              max={99}
              className={`field-input ${errors.jerseyNumber ? 'input-error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.jerseyNumber && (
              <span className="field-error">{errors.jerseyNumber}</span>
            )}
            <p className="field-hint">
              Choose a jersey number (1-99)
            </p>
          </div>

          {/* Year Joined */}
          <div className="form-field">
            <label htmlFor="yearJoined" className="field-label">
              Year Joined
            </label>
            <input
              id="yearJoined"
              type="number"
              value={yearJoined}
              onChange={(e) => setYearJoined(Number(e.target.value))}
              min={1990}
              max={new Date().getFullYear()}
              className="field-input"
              disabled={isSubmitting}
            />
            <p className="field-hint">
              Year the player joined the team
            </p>
          </div>

          {/* Nationality */}
          <div className="form-field">
            <label htmlFor="nationality" className="field-label">
              Nationality <span className="required">*</span>
            </label>
            <input
              id="nationality"
              type="text"
              value={nationality}
              onChange={handleNationalityChange}
              placeholder="Enter nationality (e.g., British, Irish)"
              className={`field-input ${errors.nationality ? 'input-error' : ''}`}
              disabled={isSubmitting}
              maxLength={50}
            />
            {errors.nationality && (
              <span className="field-error">{errors.nationality}</span>
            )}
          </div>

          {/* Market Value */}
          <div className="form-field">
            <label htmlFor="marketValue" className="field-label">
              Market Value (Galleons)
            </label>
            <input
              id="marketValue"
              type="number"
              value={marketValue}
              onChange={(e) => setMarketValue(Number(e.target.value))}
              min={1000}
              max={100000}
              step={1000}
              className="field-input"
              disabled={isSubmitting}
            />
            <p className="field-hint">
              Player's market value in Galleons
            </p>
          </div>

          {/* Contract Expires */}
          <div className="form-field">
            <label htmlFor="contractExpiresYear" className="field-label">
              Contract Expires <span className="required">*</span>
            </label>
            <input
              id="contractExpiresYear"
              type="number"
              value={contractExpiresYear}
              onChange={handleContractYearChange}
              min={new Date().getFullYear() + 1}
              max={new Date().getFullYear() + 10}
              className={`field-input ${errors.contractExpiresYear ? 'input-error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.contractExpiresYear && (
              <span className="field-error">{errors.contractExpiresYear}</span>
            )}
            <p className="field-hint">
              Year when the player's contract ends
            </p>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn-cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Signing Player...
                </>
              ) : (
                <>
                  ⚡ Draft Player
                </>
              )}
            </button>
          </div>
        </form>

        {/* Scouting Footer */}
        <div className="scouting-seal">
          <p className="seal-text">
            Approved by the League Scouting Committee
          </p>
        </div>
      </div>
    </div>
  );
}
