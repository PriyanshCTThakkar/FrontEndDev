/**
 * MatchResultForm - Record Official Match Results
 *
 * Form for recording Quidditch match results between two teams.
 * Updates team standings and player statistics automatically.
 *
 * Architecture Pattern: Controlled Component
 * - Manages own form state (useState)
 * - Receives submission handler via props
 * - Validates before submitting
 */

import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { Team } from '../../../types/wizardry';
import './MatchResultForm.css';

/**
 * Component Props Interface
 */
interface MatchResultFormProps {
  teams: Team[];
  onRecordMatch: (homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number) => Promise<void>;
  onCancel: () => void;
}

/**
 * Form field validation errors
 */
interface FormErrors {
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: string;
  awayScore?: string;
}

/**
 * MatchResultForm Component
 *
 * Official Ministry form for recording Quidditch match results.
 * Includes validation and prevents invalid team selections.
 */
export function MatchResultForm({
  teams,
  onRecordMatch,
  onCancel,
}: MatchResultFormProps) {
  // ========================================
  // FORM STATE
  // ========================================
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);

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

    // Home team validation
    if (!homeTeamId) {
      newErrors.homeTeam = 'Please select a home team';
    }

    // Away team validation
    if (!awayTeamId) {
      newErrors.awayTeam = 'Please select an away team';
    }

    // Same team check
    if (homeTeamId && awayTeamId && homeTeamId === awayTeamId) {
      newErrors.awayTeam = 'Home and away teams must be different';
    }

    // Score validation
    if (homeScore < 0) {
      newErrors.homeScore = 'Score cannot be negative';
    }

    if (awayScore < 0) {
      newErrors.awayScore = 'Score cannot be negative';
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

      // Call parent's record match handler
      await onRecordMatch(homeTeamId, awayTeamId, homeScore, awayScore);

      // Success - form will be closed by parent
    } catch (error) {
      console.error('[MatchResultForm] Submission failed:', error);
      setErrors({
        homeTeam: 'Failed to record match. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // INPUT HANDLERS
  // ========================================
  const handleHomeTeamChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setHomeTeamId(e.target.value);
    if (errors.homeTeam) {
      setErrors({ ...errors, homeTeam: undefined });
    }
  };

  const handleAwayTeamChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAwayTeamId(e.target.value);
    if (errors.awayTeam) {
      setErrors({ ...errors, awayTeam: undefined });
    }
  };

  const handleHomeScoreChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHomeScore(Number(e.target.value));
    if (errors.homeScore) {
      setErrors({ ...errors, homeScore: undefined });
    }
  };

  const handleAwayScoreChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAwayScore(Number(e.target.value));
    if (errors.awayScore) {
      setErrors({ ...errors, awayScore: undefined });
    }
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="match-form-overlay">
      <div className="match-form-container">
        {/* Form Header */}
        <div className="form-header">
          <h2 className="form-title">
            ⚡ Official Match Report
          </h2>
          <h3 className="form-subtitle">
            Record Match Result
          </h3>
          <p className="form-description">
            Submit official Quidditch match scores to update league standings
          </p>
        </div>

        {/* Match Form */}
        <form onSubmit={handleSubmit} className="match-form">
          {/* Home Team */}
          <div className="form-field">
            <label htmlFor="homeTeam" className="field-label">
              🏠 Home Team <span className="required">*</span>
            </label>
            <select
              id="homeTeam"
              value={homeTeamId}
              onChange={handleHomeTeamChange}
              className={`field-select ${errors.homeTeam ? 'input-error' : ''}`}
              disabled={isSubmitting}
            >
              <option value="">-- Select Home Team --</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.houseAlignment})
                </option>
              ))}
            </select>
            {errors.homeTeam && (
              <span className="field-error">{errors.homeTeam}</span>
            )}
          </div>

          {/* Home Score */}
          <div className="form-field">
            <label htmlFor="homeScore" className="field-label">
              Home Score <span className="required">*</span>
            </label>
            <input
              id="homeScore"
              type="number"
              value={homeScore}
              onChange={handleHomeScoreChange}
              min={0}
              step={10}
              className={`field-input ${errors.homeScore ? 'input-error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.homeScore && (
              <span className="field-error">{errors.homeScore}</span>
            )}
            <p className="field-hint">
              Quidditch scores typically end in 0
            </p>
          </div>

          {/* VS Divider */}
          <div className="vs-divider">
            <span className="vs-text">VS</span>
          </div>

          {/* Away Team */}
          <div className="form-field">
            <label htmlFor="awayTeam" className="field-label">
              ✈️ Away Team <span className="required">*</span>
            </label>
            <select
              id="awayTeam"
              value={awayTeamId}
              onChange={handleAwayTeamChange}
              className={`field-select ${errors.awayTeam ? 'input-error' : ''}`}
              disabled={isSubmitting}
            >
              <option value="">-- Select Away Team --</option>
              {teams
                .filter(team => team.id !== homeTeamId) // Exclude home team
                .map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.houseAlignment})
                  </option>
                ))}
            </select>
            {errors.awayTeam && (
              <span className="field-error">{errors.awayTeam}</span>
            )}
          </div>

          {/* Away Score */}
          <div className="form-field">
            <label htmlFor="awayScore" className="field-label">
              Away Score <span className="required">*</span>
            </label>
            <input
              id="awayScore"
              type="number"
              value={awayScore}
              onChange={handleAwayScoreChange}
              min={0}
              step={10}
              className={`field-input ${errors.awayScore ? 'input-error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.awayScore && (
              <span className="field-error">{errors.awayScore}</span>
            )}
            <p className="field-hint">
              Golden Snitch adds 150 points
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
                  Recording Match...
                </>
              ) : (
                <>
                  ⚡ Record Result
                </>
              )}
            </button>
          </div>
        </form>

        {/* Ministry Footer */}
        <div className="ministry-seal-footer">
          <p className="seal-text">
            Approved by the Quidditch Officials Committee
          </p>
        </div>
      </div>
    </div>
  );
}
