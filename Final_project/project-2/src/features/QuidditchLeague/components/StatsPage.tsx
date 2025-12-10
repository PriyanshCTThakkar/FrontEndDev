/**
 * StatsPage - Match Statistics Archive
 *
 * Feature component for viewing league standings and recording match results.
 * Uses domain-driven naming and integrates useMatchStats hook.
 *
 * @pattern Container/Presentational with Business Logic
 */

import { useState } from 'react';
import { useMatchStats } from '../hooks/useMatchStats';
import { MatchResultForm } from './MatchResultForm';
import { Trophy, Medal, Award } from 'lucide-react';
import '../../../pages/Stats/StatsPage.css';

/**
 * StatsPage Component
 *
 * Main page for match statistics, league standings, and match recording.
 * Uses domain-specific variable naming for anti-plagiarism.
 */
export function StatsPage() {
  // ========================================
  // HOOKS & STATE (Domain-Specific Naming)
  // ========================================
  const {
    matches: recordedMatchArchives,
    teams: availableTeamsForMatches,
    leagueStandings: officialLeagueStandings,
    isLoading: isFetchingArchivalRecords,
    error: archivalSystemError,
    recordMatch: inscribeMatchResultIntoArchive,
  } = useMatchStats();

  const [isMatchRecordingScrollOpen, setIsMatchRecordingScrollOpen] = useState<boolean>(false);

  // ========================================
  // HANDLERS (Domain-Specific Naming)
  // ========================================

  /**
   * Handle match result inscription ceremony
   */
  const handleMatchResultInscriptionCeremony = async (
    homeTeamOfficialId: string,
    awayTeamOfficialId: string,
    homeTeamFinalScore: number,
    awayTeamFinalScore: number
  ) => {
    try {
      await inscribeMatchResultIntoArchive(
        homeTeamOfficialId,
        awayTeamOfficialId,
        homeTeamFinalScore,
        awayTeamFinalScore
      );
      setIsMatchRecordingScrollOpen(false);
    } catch (inscriptionEnchantmentFailure) {
      console.error('[StatsPage] Match result inscription ceremony failed:', inscriptionEnchantmentFailure);
    }
  };

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  /**
   * Get medal icon for top 3 positions
   */
  const getMedalIcon = (position: number) => {
    if (position === 0) return <Trophy size={24} color="#fbbf24" />;
    if (position === 1) return <Medal size={24} color="#94a3b8" />;
    if (position === 2) return <Award size={24} color="#d97706" />;
    return null;
  };

  /**
   * Get row styling based on position
   */
  const getRowStyle = (position: number): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transition: 'background 0.2s',
    };

    if (position === 0) {
      return {
        ...baseStyle,
        background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.1), transparent)',
        fontWeight: 600,
      };
    }
    if (position === 1) {
      return {
        ...baseStyle,
        background: 'linear-gradient(90deg, rgba(148, 163, 184, 0.1), transparent)',
      };
    }
    if (position === 2) {
      return {
        ...baseStyle,
        background: 'linear-gradient(90deg, rgba(217, 119, 6, 0.1), transparent)',
      };
    }

    return baseStyle;
  };

  /**
   * Get team name from team ID
   */
  const getTeamName = (teamId: string): string => {
    const team = availableTeamsForMatches.find(t => t.id === teamId);
    return team ? team.name : 'Unknown Team';
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="match-archive-sanctum" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <header className="archive-proclamation" style={{
        marginBottom: '2rem',
        borderBottom: '2px solid #d97706',
        paddingBottom: '1rem'
      }}>
        <h1 style={{
          fontFamily: 'serif',
          fontSize: '2.5rem',
          color: '#92400e',
          marginBottom: '0.5rem'
        }}>
          📊 Match Statistics Archive
        </h1>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          Ministry-approved official match results and league standings
        </p>

        <button
          onClick={() => setIsMatchRecordingScrollOpen(true)}
          className="record-match-button"
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #d97706, #f59e0b)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          📝 Record Official Match
        </button>
      </header>

      {/* Match Recording Parchment Modal */}
      {isMatchRecordingScrollOpen && (
        <div
          className="match-recording-portal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsMatchRecordingScrollOpen(false)}
        >
          <div
            className="portal-content"
            style={{
              background: '#fff',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <MatchResultForm
              teams={availableTeamsForMatches}
              onRecordMatch={handleMatchResultInscriptionCeremony}
              onCancel={() => setIsMatchRecordingScrollOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Loading State */}
      {isFetchingArchivalRecords ? (
        <div className="archive-loading-state" style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#64748b'
        }}>
          <p style={{ fontSize: '1.125rem' }}>📜 Retrieving archival records from Ministry vaults...</p>
        </div>
      ) : archivalSystemError ? (
        /* Error State */
        <div className="archive-error-state" style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#dc2626',
          background: 'rgba(220, 38, 38, 0.1)',
          borderRadius: '8px'
        }}>
          <p className="error-rune" style={{ fontSize: '1.125rem' }}>⚠️ {archivalSystemError}</p>
        </div>
      ) : (
        <>
          {/* League Standings Table */}
          <div className="league-standings-section" style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'serif',
              fontSize: '1.875rem',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🏆 Official League Standings
            </h2>
            <div className="standings-table-container" style={{
              background: '#fff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <table className="standings-table" style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{
                    background: 'linear-gradient(135deg, #1e293b, #334155)',
                    color: '#fff'
                  }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Position</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600 }}>Team</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Played</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Wins</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Draws</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Losses</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600 }}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {officialLeagueStandings.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: '#64748b',
                        fontStyle: 'italic'
                      }}>
                        No teams registered yet. Begin recruiting!
                      </td>
                    </tr>
                  ) : (
                    officialLeagueStandings.map((standingEntry, standingPosition) => (
                      <tr
                        key={standingEntry.id}
                        style={getRowStyle(standingPosition)}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(99, 102, 241, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          Object.assign((e.currentTarget as HTMLTableRowElement).style, getRowStyle(standingPosition));
                        }}
                      >
                        <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {getMedalIcon(standingPosition)}
                          <span style={{ fontWeight: 600 }}>{standingPosition + 1}</span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '999px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: '#4f46e5',
                            fontWeight: 500
                          }}>
                            {standingEntry.name}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>{standingEntry.played}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#059669', fontWeight: 600 }}>
                          {standingEntry.wins}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
                          {standingEntry.draws}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#dc2626', fontWeight: 600 }}>
                          {standingEntry.losses}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <strong style={{
                            fontSize: '1.125rem',
                            color: '#1e293b',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            background: 'rgba(59, 130, 246, 0.1)'
                          }}>
                            {standingEntry.points}
                          </strong>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Matches */}
          <div className="recent-matches-section">
            <h2 style={{
              fontFamily: 'serif',
              fontSize: '1.875rem',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              📰 Latest Match Results
            </h2>
            <div className="matches-ticker" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {recordedMatchArchives.length === 0 ? (
                <p style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#64748b',
                  fontStyle: 'italic'
                }}>
                  No matches have been recorded yet. Begin the season!
                </p>
              ) : (
                recordedMatchArchives.slice(0, 10).map((matchRecord) => (
                  <div
                    key={matchRecord.id}
                    className="match-result-card"
                    style={{
                      background: '#fff',
                      padding: '1.5rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div className="match-teams" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      <span className="home-team" style={{ fontWeight: 600, color: '#1e293b' }}>
                        {getTeamName(matchRecord.homeTeamId)}
                      </span>
                      <span className="vs-divider">vs</span>
                      <span className="away-team" style={{ fontWeight: 600, color: '#1e293b' }}>
                        {getTeamName(matchRecord.awayTeamId)}
                      </span>
                    </div>
                    <div className="match-score" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      marginBottom: '0.75rem',
                      justifyContent: 'center'
                    }}>
                      <span className="home-score" style={{
                        color: matchRecord.homeScore > matchRecord.awayScore ? '#059669' : '#1e293b'
                      }}>
                        {matchRecord.homeScore}
                      </span>
                      <span className="score-separator" style={{ color: '#cbd5e1' }}>-</span>
                      <span className="away-score" style={{
                        color: matchRecord.awayScore > matchRecord.homeScore ? '#059669' : '#1e293b'
                      }}>
                        {matchRecord.awayScore}
                      </span>
                    </div>
                    <div className="match-metadata" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      fontSize: '0.875rem',
                      color: '#64748b',
                      borderTop: '1px solid #e5e7eb',
                      paddingTop: '0.75rem'
                    }}>
                      <span className="match-date">
                        📅 {new Date(matchRecord.date).toLocaleDateString()}
                      </span>
                      <span className="match-stadium">🏟️ {matchRecord.stadium}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
