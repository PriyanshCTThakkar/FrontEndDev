/**
 * Ministry Enlistment Route (Signup)
 *
 * Handles wizard registration with Firebase Auth.
 * Uses domain-specific naming: ministryEnlistmentRoute
 *
 * @pattern Route Factory with Authentication
 */

import { createRoute, useNavigate, type AnyRoute } from "@tanstack/react-router";
import { useMinistryAuth } from "../features/MinistryAuth/context/MinistryAuthContext";
import { useState, type FormEvent } from "react";
import "../pages/Login/LoginPage.css";

/**
 * Route Factory: Ministry Enlistment (Signup)
 * @param parent - Explicitly typed as AnyRoute for type safety
 */
export default (parent: AnyRoute) => createRoute({
  path: '/ministry-enlistment',
  getParentRoute: () => parent,
  component: MinistryEnlistmentGateway,
});

/**
 * Ministry Enlistment Gateway Component
 * Handles new wizard registration with Firebase Auth
 */
function MinistryEnlistmentGateway() {
  const { state: wizardAuthState, signup: castEnlistmentSpell, logout: signOut, clearError: dismissDarkMagic } = useMinistryAuth();
  const navigate = useNavigate();

  const [wizardName, setWizardName] = useState<string>('');
  const [wizardEmail, setWizardEmail] = useState<string>('');
  const [magicPassword, setMagicPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isInvokingSpell, setIsInvokingSpell] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  /**
   * Handle form submission
   */
  const handleEnlistmentCeremony = async (spellCast: FormEvent<HTMLFormElement>) => {
    spellCast.preventDefault();
    dismissDarkMagic();
    setValidationError('');

    // Client-side validation
    if (!wizardName.trim()) {
      setValidationError('Wizard name is required for Ministry enlistment');
      return;
    }

    if (!wizardEmail.trim()) {
      setValidationError('Wizard email is required for Ministry enlistment');
      return;
    }

    if (magicPassword.length < 6) {
      setValidationError('Secret spell must be at least 6 characters long');
      return;
    }

    if (magicPassword !== confirmPassword) {
      setValidationError('Secret spells do not match!');
      return;
    }

    try {
      setIsInvokingSpell(true);
      await castEnlistmentSpell(wizardEmail, magicPassword, wizardName);

      // Success! Sign out the user and redirect to login
      await signOut();

      // Redirect to login page with success message
      navigate({
        to: '/ministry-portal',
        search: { registered: 'true' }
      });
    } catch (enchantmentError) {
      console.error('[MinistryEnlistment] Registration spell failed:', enchantmentError);
      // Error is already in state via dispatch, just keep form open
    } finally {
      setIsInvokingSpell(false);
    }
  };

  return (
    <div className="login-page">
      <div className="ministry-background">
        {/* Floating Magical Particles */}
        <div className="magical-particles">
          <span className="particle">✨</span>
          <span className="particle">🌟</span>
          <span className="particle">⚡</span>
          <span className="particle">✨</span>
          <span className="particle">🌟</span>
        </div>

        {/* Signup Container */}
        <div className="login-container">
          {/* Ministry Header */}
          <div className="ministry-header">
            <div className="ministry-seal">
              <div className="seal-outer">
                <div className="seal-inner">
                  <span className="seal-icon">📜</span>
                </div>
              </div>
            </div>
            <h1 className="ministry-title">Ministry of Magic</h1>
            <h2 className="ministry-subtitle">Wizard Enlistment Portal</h2>
            <p className="ministry-description">
              Register your magical credentials to join the Quidditch Manager league
            </p>
          </div>

          {/* Error Banner */}
          {(wizardAuthState.error || validationError) && (
            <div className="dark-magic-alert">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <h3 className="alert-title">Dark Magic Detected</h3>
                <p className="alert-message">{validationError || wizardAuthState.error}</p>
              </div>
              <button
                onClick={() => {
                  dismissDarkMagic();
                  setValidationError('');
                }}
                className="alert-dismiss"
                aria-label="Dismiss alert"
              >
                ✕
              </button>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleEnlistmentCeremony} className="ministry-form">
            {/* Wizard Name */}
            <div className="form-group">
              <label htmlFor="wizardNameInput" className="form-label">
                🧙 Wizard Name
              </label>
              <input
                id="wizardNameInput"
                type="text"
                value={wizardName}
                onChange={(e) => setWizardName(e.target.value)}
                placeholder="Harry Potter"
                className="form-input"
                required
                autoComplete="name"
                disabled={isInvokingSpell}
              />
              <span className="input-hint">Enter your full wizard name</span>
            </div>

            {/* Wizard Email */}
            <div className="form-group">
              <label htmlFor="wizardEmailInput" className="form-label">
                🪄 Wizard Email
              </label>
              <input
                id="wizardEmailInput"
                type="email"
                value={wizardEmail}
                onChange={(e) => setWizardEmail(e.target.value)}
                placeholder="wizard@hogwarts.edu"
                className="form-input"
                required
                autoComplete="email"
                disabled={isInvokingSpell}
              />
              <span className="input-hint">Enter your registered magical email</span>
            </div>

            {/* Secret Spell (Password) */}
            <div className="form-group">
              <label htmlFor="magicPasswordInput" className="form-label">
                🔐 Secret Spell
              </label>
              <input
                id="magicPasswordInput"
                type="password"
                value={magicPassword}
                onChange={(e) => setMagicPassword(e.target.value)}
                placeholder="Enter your secret spell..."
                className="form-input"
                required
                autoComplete="new-password"
                disabled={isInvokingSpell}
                minLength={6}
              />
              <span className="input-hint">At least 6 characters</span>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPasswordInput" className="form-label">
                🔒 Confirm Secret Spell
              </label>
              <input
                id="confirmPasswordInput"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your secret spell..."
                className="form-input"
                required
                autoComplete="new-password"
                disabled={isInvokingSpell}
                minLength={6}
              />
              <span className="input-hint">Must match the spell above</span>
            </div>

            {/* Enlistment Button */}
            <button
              type="submit"
              className="alohomora-button"
              disabled={isInvokingSpell}
            >
              {isInvokingSpell ? (
                <>
                  <span className="spell-spinner"></span>
                  Enrolling in Ministry...
                </>
              ) : (
                <>
                  ✨ Enlist Now
                </>
              )}
            </button>
          </form>

          {/* Magic Hint Box */}
          <div className="magic-hint-box">
            <div className="hint-header">
              <span className="hint-icon">🔮</span>
              <span className="hint-title">Enlistment Requirements</span>
            </div>
            <div className="hint-content">
              <p className="hint-text">
                • Valid wizard email address<br />
                • Secret spell with at least 6 characters<br />
                • Full wizard name for Ministry records
              </p>
              <p className="hint-subtext">
                Your Hogwarts house will be assigned based on your email domain!
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="ministry-footer">
            <p className="footer-text">
              Already enlisted?{' '}
              <button
                onClick={() => navigate({ to: '/ministry-portal' })}
                className="footer-link"
                type="button"
              >
                Access Portal
              </button>
            </p>
            <p className="footer-text">
              Return to{' '}
              <button onClick={() => navigate({ to: '/' })} className="footer-link" type="button">
                The Daily Prophet
              </button>
            </p>
            <p className="footer-disclaimer">
              Ministry Approved • Secure Registration • Est. 1707
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
