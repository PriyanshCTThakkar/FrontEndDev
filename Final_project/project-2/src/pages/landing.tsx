/**
 * Daily Prophet Landing Route
 *
 * Home page route for the Wizarding World Quidditch Manager.
 * Implements the Daily Prophet newspaper theme with authentication awareness.
 *
 * @pattern Route Factory with Inline Component
 */

import { createRoute, Link, type AnyRoute } from "@tanstack/react-router";
import { useMinistryAuth } from "../features/MinistryAuth/context/MinistryAuthContext";
import "./Landing/LandingPage.css";

/**
 * Route Factory: Daily Prophet Homepage
 * @param parent - Explicitly typed as AnyRoute for type safety
 */
export default (parent: AnyRoute) => createRoute({
  path: '/',
  getParentRoute: () => parent,
  component: DailyProphetNewsroomPortal,
});

/**
 * Daily Prophet Newsroom Portal Component
 * The main landing page styled like the Daily Prophet newspaper
 */
function DailyProphetNewsroomPortal() {
  const { state: wizardAuthenticationState } = useMinistryAuth();

  return (
    <div className="landing-page">
      {/* Daily Prophet Masthead */}
      <div className="prophet-masthead">
        <div className="masthead-ornament">✦ ✦ ✦</div>
        <h1 className="prophet-title">THE DAILY PROPHET</h1>
        <div className="masthead-subtitle">
          The Wizarding World's Most Trusted Source for Quidditch News
        </div>
        <div className="masthead-ornament">✦ ✦ ✦</div>
      </div>

      {/* Main Headline */}
      <div className="headline-section">
        <div className="headline-banner">BREAKING NEWS</div>
        <h2 className="main-headline">
          ⚡ Quidditch Season Begins! ⚡
        </h2>
        <p className="headline-subtext">
          Magical Managers Worldwide Prepare for Most Exciting Season Yet
        </p>
        <div className="headline-dateline">
          Published: {new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* Ministry Access Widget */}
      <div className="ministry-widget">
        {wizardAuthenticationState.isAuthenticated && wizardAuthenticationState.wizard ? (
          <>
            {/* Authenticated State */}
            <div className="ministry-authenticated">
              <div className="authenticated-header">
                <span className="auth-icon">🪄</span>
                <h3>Welcome Back, Wizard {wizardAuthenticationState.wizard.name}</h3>
              </div>
              <div className="wizard-info-card">
                <div className="info-row">
                  <span className="info-label">House:</span>
                  <span className="info-value house-badge">{wizardAuthenticationState.wizard.house}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Role:</span>
                  <span className="info-value">{wizardAuthenticationState.wizard.role}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Galleons:</span>
                  <span className="info-value">{wizardAuthenticationState.wizard.galleons.toLocaleString()} 🪙</span>
                </div>
              </div>
              <Link to="/quidditch-league-registry" className="ministry-button ministry-button-primary">
                📰 Enter Daily Prophet Dashboard
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Unauthenticated State */}
            <div className="ministry-unauthenticated">
              <div className="ministry-seal">
                <div className="seal-icon">🔐</div>
                <h3>Ministry Access Required</h3>
                <p>Authenticate your magical credentials to manage Quidditch teams</p>
              </div>
              <Link to="/ministry-portal" className="ministry-button ministry-button-access">
                ✨ Ministry Access
              </Link>
              <div className="ministry-hint">
                <p>New to the league? Register as a Quidditch Manager today!</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* News Articles Grid */}
      <div className="news-articles-section">
        <div className="section-divider">
          <span>✦ FEATURED STORIES ✦</span>
        </div>

        <div className="articles-grid">
          {/* Article 1 */}
          <div className="article-card">
            <div className="article-category">League Updates</div>
            <h3 className="article-title">🏆 New Teams Join the International League</h3>
            <p className="article-excerpt">
              The International Quidditch Federation announces expansion with 12 new teams
              representing houses from magical schools worldwide...
            </p>
            <div className="article-meta">By Rita Skeeter • 2 hours ago</div>
          </div>

          {/* Article 2 */}
          <div className="article-card">
            <div className="article-category">Player Scouting</div>
            <h3 className="article-title">⚡ Top Seeker Prospects for the Season</h3>
            <p className="article-excerpt">
              Our scouting report reveals the most promising young Seekers ready to make
              their mark in professional Quidditch this season...
            </p>
            <div className="article-meta">By Quidditch Correspondent • 5 hours ago</div>
          </div>

          {/* Article 3 */}
          <div className="article-card">
            <div className="article-category">Match Results</div>
            <h3 className="article-title">🔥 Dramatic Victory in Season Opener</h3>
            <p className="article-excerpt">
              The Holyhead Harpies defeated the Puddlemere United 240-170 after an
              intense 4-hour match with spectacular Seeker performance...
            </p>
            <div className="article-meta">By Match Commentator • 1 day ago</div>
          </div>

          {/* Article 4 */}
          <div className="article-card">
            <div className="article-category">Transfer News</div>
            <h3 className="article-title">🪙 Record-Breaking Transfer Market Opens</h3>
            <p className="article-excerpt">
              Managers spent over 2 million Galleons in the opening week as star players
              switch teams in the most active transfer period ever...
            </p>
            <div className="article-meta">By Finance Reporter • 2 days ago</div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="prophet-footer">
        <div className="section-divider">
          <span>✦ ABOUT THIS PROJECT ✦</span>
        </div>
        <div className="about-content">
          <h3>Portfolio Demonstration</h3>
          <p>
            This Wizarding World Quidditch Manager showcases advanced React architecture
            patterns and TypeScript best practices.
          </p>
          <div className="tech-highlights">
            <span className="tech-badge">Feature-Based Architecture</span>
            <span className="tech-badge">Singleton Service Layer</span>
            <span className="tech-badge">useReducer + Context</span>
            <span className="tech-badge">Protected Routes</span>
            <span className="tech-badge">TypeScript Strict</span>
            <span className="tech-badge">localStorage Persistence</span>
          </div>
        </div>
        <div className="footer-tagline">
          <em>Delivering magical news since 1743</em>
        </div>
      </div>
    </div>
  );
}
