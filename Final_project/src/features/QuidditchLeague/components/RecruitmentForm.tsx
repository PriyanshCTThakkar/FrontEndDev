/**
 * RecruitmentForm - Team Recruitment Form
 *
 * A Ministry-themed form for recruiting new Quidditch teams to the league.
 * Handles local form state and validation, delegates submission to parent.
 *
 * Architecture Pattern: Controlled Component
 * - Manages own form state (useState)
 * - Receives submission handler via props
 * - Validates before submitting
 *
 * @example
 * ```tsx
 * const { recruitTeam } = useTeamList();
 * const [showForm, setShowForm] = useState(false);
 *
 * <RecruitmentForm
 *   onRecruit={recruitTeam}
 *   onCancel={() => setShowForm(false)}
 * />
 * ```
 */

import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { Team, HouseAlignment } from '../../../types/wizardry';
import './RecruitmentForm.css';

/**
 * Component Props Interface
 */
interface RecruitmentFormProps {
  onRecruit: (teamData: Omit<Team, 'id'>) => Promise<void>;
  onCancel: () => void;
}

/**
 * Form field validation errors
 */
interface FormErrors {
  teamName?: string;
  stadiumName?: string;
  foundedYear?: string;
}

/**
 * RecruitmentForm Component
 *
 * Ministry-styled form for registering new Quidditch teams.
 * Includes validation and loading states.
 */
export function RecruitmentForm({ onRecruit, onCancel }: RecruitmentFormProps) {
  // ========================================
  // FORM STATE
  // ========================================
  const [teamName, setTeamName] = useState('');
  const [houseAlignment, setHouseAlignment] = useState<HouseAlignment>('Gryffindor');
  const [foundedYear, setFoundedYear] = useState<number>(new Date().getFullYear());
  const [stadiumName, setStadiumName] = useState('');

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

    // Team Name validation
    if (!teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    } else if (teamName.trim().length < 3) {
      newErrors.teamName = 'Team name must be at least 3 characters';
    }

    // Stadium Name validation
    if (!stadiumName.trim()) {
      newErrors.stadiumName = 'Stadium name is required';
    }

    // Founded Year validation
    const currentYear = new Date().getFullYear();
    if (foundedYear < 990) {
      newErrors.foundedYear = 'Founded year must be after 990 AD (Hogwarts founding)';
    } else if (foundedYear > currentYear) {
      newErrors.foundedYear = `Founded year cannot be in the future`;
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

      // Create team data object
      const teamData: Omit<Team, 'id'> = {
        name: teamName.trim(),
        houseAlignment,
        foundedYear,
        stadiumName: stadiumName.trim(),
        wins: 0,
        losses: 0,
        draws: 0,
        managerId: 'current-wizard', // Will be set by service/backend
      };

      // Call parent's recruitment handler
      await onRecruit(teamData);

      // Success - form will be closed by parent
    } catch (error) {
      console.error('[RecruitmentForm] Submission failed:', error);
      setErrors({
        teamName: 'Failed to recruit team. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================
  // INPUT HANDLERS
  // ========================================
  const handleTeamNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTeamName(e.target.value);
    if (errors.teamName) {
      setErrors({ ...errors, teamName: undefined });
    }
  };

  const handleStadiumNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStadiumName(e.target.value);
    if (errors.stadiumName) {
      setErrors({ ...errors, stadiumName: undefined });
    }
  };

  const handleFoundedYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFoundedYear(Number(e.target.value));
    if (errors.foundedYear) {
      setErrors({ ...errors, foundedYear: undefined });
    }
  };

  const handleHouseChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setHouseAlignment(e.target.value as HouseAlignment);
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="recruitment-form-overlay">
      <div className="recruitment-form-container">
        {/* Form Header */}
        <div className="form-header">
          <h2 className="form-title">
            ⚡ Ministry of Magic
          </h2>
          <h3 className="form-subtitle">
            Official Team Registration Form
          </h3>
          <p className="form-description">
            Register your Quidditch team with the Ministry to compete in the official league.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="registration-form">
          {/* Team Name */}
          <div className="form-field">
            <label htmlFor="teamName" className="field-label">
              Team Name <span className="required">*</span>
            </label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={handleTeamNameChange}
              placeholder="Enter team name (e.g., Holyhead Harpies)"
              className={`field-input ${errors.teamName ? 'input-error' : ''}`}
              disabled={isSubmitting}
              maxLength={50}
            />
            {errors.teamName && (
              <span className="field-error">{errors.teamName}</span>
            )}
          </div>

          {/* House Alignment */}
          <div className="form-field">
            <label htmlFor="houseAlignment" className="field-label">
              House Alignment <span className="required">*</span>
            </label>
            <select
              id="houseAlignment"
              value={houseAlignment}
              onChange={handleHouseChange}
              className="field-select"
              disabled={isSubmitting}
            >
              <option value="Gryffindor">🦁 Gryffindor</option>
              <option value="Slytherin">🐍 Slytherin</option>
              <option value="Hufflepuff">🦡 Hufflepuff</option>
              <option value="Ravenclaw">🦅 Ravenclaw</option>
            </select>
            <p className="field-hint">
              Select the Hogwarts house your team represents
            </p>
          </div>

          {/* Founded Year */}
          <div className="form-field">
            <label htmlFor="foundedYear" className="field-label">
              Founded Year <span className="required">*</span>
            </label>
            <input
              id="foundedYear"
              type="number"
              value={foundedYear}
              onChange={handleFoundedYearChange}
              min={990}
              max={new Date().getFullYear()}
              className={`field-input ${errors.foundedYear ? 'input-error' : ''}`}
              disabled={isSubmitting}
            />
            {errors.foundedYear && (
              <span className="field-error">{errors.foundedYear}</span>
            )}
            <p className="field-hint">
              Year your team was established (990 AD - Present)
            </p>
          </div>

          {/* Stadium Name */}
          <div className="form-field">
            <label htmlFor="stadiumName" className="field-label">
              Stadium Name <span className="required">*</span>
            </label>
            <input
              id="stadiumName"
              type="text"
              value={stadiumName}
              onChange={handleStadiumNameChange}
              placeholder="Enter stadium name (e.g., Hogwarts Pitch)"
              className={`field-input ${errors.stadiumName ? 'input-error' : ''}`}
              disabled={isSubmitting}
              maxLength={50}
            />
            {errors.stadiumName && (
              <span className="field-error">{errors.stadiumName}</span>
            )}
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
                  Signing Contract...
                </>
              ) : (
                <>
                  ✨ Register Team
                </>
              )}
            </button>
          </div>
        </form>

        {/* Ministry Seal */}
        <div className="ministry-seal">
          <p className="seal-text">
            Approved by the Department of Magical Games and Sports
          </p>
        </div>
      </div>
    </div>
  );
}
