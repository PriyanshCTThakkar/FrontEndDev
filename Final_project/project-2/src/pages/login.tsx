/**
 * Ministry Portal Login Route
 *
 * Handles wizard authentication with redirect logic for authenticated users.
 * Uses domain-specific naming for uniqueness: ministryPortalRoute
 *
 * @pattern Route Factory with Authentication Guard
 */

import { createRoute, useNavigate, useSearch, type AnyRoute } from "@tanstack/react-router";
import { useMinistryAuth } from "../features/MinistryAuth/context/MinistryAuthContext";
import { useState, useEffect, type FormEvent } from "react";
import "./Login/LoginPage.css";

/**
 * Route Factory: Ministry Portal
 * @param parent - Explicitly typed as AnyRoute for type safety
 */
export default (parent: AnyRoute) => createRoute({
  path: '/ministry-portal',
  getParentRoute: () => parent,
  component: MinistryPortalGateway,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      registered: search.registered === 'true',
    };
  },
});

/**
 * Ministry Portal Gateway Component
 * Thin wrapper that handles wizard authentication with inline form logic
 */
function MinistryPortalGateway() {
  const { state: wizardAuthState, login: castLoginSpell, clearError: dismissDarkMagic } = useMinistryAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: '/ministry-portal' });
  const [wizardEmail, setWizardEmail] = useState<string>('');
  const [magicPassword, setMagicPassword] = useState<string>('');
  const [isInvokingSpell, setIsInvokingSpell] = useState<boolean>(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(search.registered || false);

  /**
   * Redirect if already authenticated
   */
  useEffect(() => {
    if (wizardAuthState.isAuthenticated) {
      navigate({ to: '/quidditch-command' });
    }
  }, [wizardAuthState.isAuthenticated, navigate]);

  /**
   * Handle form submission with unique naming
   */
  const handleAuthenticationSpell = async (spellCast: FormEvent<HTMLFormElement>) => {
    spellCast.preventDefault();
    dismissDarkMagic();

    if (!wizardEmail.trim() || !magicPassword.trim()) {
      return;
    }

    try {
      setIsInvokingSpell(true);
      await castLoginSpell(wizardEmail, magicPassword);
      // Success! The useEffect will handle redirect when auth state updates
    } catch (enchantmentError) {
      console.error('[MinistryPortal] Authentication spell failed:', enchantmentError);
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

        {/* Login Container */}
        <div className="login-container">
          {/* Ministry Header */}
          <div className="ministry-header">
            <div className="ministry-seal">
              <div className="seal-outer">
                <div className="seal-inner">
                  <span className="seal-icon">🔮</span>
                </div>
              </div>
            </div>
            <h1 className="ministry-title">Ministry of Magic</h1>
            <h2 className="ministry-subtitle">Identity Verification Portal</h2>
            <p className="ministry-description">
              Present your magical credentials to access the Quidditch Manager
            </p>
          </div>

          {/* Success Banner - "Registration Successful" */}
          {showSuccessMessage && (
            <div className="dark-magic-alert" style={{ backgroundColor: '#10b981', borderColor: '#059669' }}>
              <div className="alert-icon">✅</div>
              <div className="alert-content">
                <h3 className="alert-title">Registration Successful!</h3>
                <p className="alert-message">Your wizard account has been created. Please login with your credentials.</p>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="alert-dismiss"
                aria-label="Dismiss alert"
              >
                ✕
              </button>
            </div>
          )}

          {/* Error Banner - "Dark Magic Detected" */}
          {wizardAuthState.error && (
            <div className="dark-magic-alert">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <h3 className="alert-title">Dark Magic Detected</h3>
                <p className="alert-message">{wizardAuthState.error}</p>
              </div>
              <button
                onClick={dismissDarkMagic}
                className="alert-dismiss"
                aria-label="Dismiss alert"
              >
                ✕
              </button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleAuthenticationSpell} className="ministry-form">
            {/* Wand Identity (Email) */}
            <div className="form-group">
              <label htmlFor="wizardEmailInput" className="form-label">
                🪄 Wand Identity
              </label>
              <input
                id="wizardEmailInput"
                type="email"
                value={wizardEmail}
                onChange={(e) => setWizardEmail(e.target.value)}
                placeholder="wizard@ministry.magic"
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
                autoComplete="current-password"
                disabled={isInvokingSpell}
              />
              <span className="input-hint">Cast the unlocking charm</span>
            </div>

            {/* Alohomora Button */}
            <button
              type="submit"
              className="alohomora-button"
              disabled={isInvokingSpell}
            >
              {isInvokingSpell ? (
                <>
                  <span className="spell-spinner"></span>
                  Verifying Identity...
                </>
              ) : (
                <>
                  ✨ Alohomora
                </>
              )}
            </button>
          </form>

          {/* Magic Hint Box */}
          <div className="magic-hint-box">
            <div className="hint-header">
              <span className="hint-icon">🔮</span>
              <span className="hint-title">New to the Ministry?</span>
            </div>
            <div className="hint-content">
              <p className="hint-text">
                Don't have an account yet?
              </p>
              <p className="hint-subtext">
                <button
                  onClick={() => navigate({ to: '/ministry-enlistment' })}
                  className="footer-link"
                  type="button"
                  style={{ fontSize: '1rem', fontWeight: 'bold' }}
                >
                  Register as a New Wizard
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="ministry-footer">
            <p className="footer-text">
              Return to{' '}
              <button onClick={() => navigate({ to: '/' })} className="footer-link" type="button">
                The Daily Prophet
              </button>
            </p>
            <p className="footer-disclaimer">
              Ministry Approved • Secure Portal • Est. 1707
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}