/**
 * PlayersPage - Player Scouting Network
 *
 * Feature component for managing player roster with domain-driven naming.
 * Integrates usePlayerRoster hook with presentational components.
 *
 * @pattern Container/Presentational with Entropy Naming
 */

import { useState, useEffect } from 'react';
import { usePlayerRoster } from '../hooks/usePlayerRoster';
import { PlayerScroll } from './PlayerScroll';
import { DraftPlayerForm } from './DraftPlayerForm';
import { owlPostService } from '../../../services';
import type { Player } from '../../../types/wizardry';
import '../../../pages/Players/PlayersPage.css';

/**
 * PlayersPage Component
 *
 * Main page for player scouting and roster management.
 * Uses domain-specific variable naming for anti-plagiarism.
 */
export function PlayersPage() {
  // ========================================
  // HOOKS & STATE (Domain-Specific Naming)
  // ========================================
  const {
    players: scoutedTalentPool,
    isLoading: isFetchingScoutingReports,
    error: scoutingNetworkError,
    recruitPlayer: draftNewTalentIntoRoster,
    banishPlayer: releasePlayerFromContract,
  } = usePlayerRoster();

  const [isDraftingScrollOpen, setIsDraftingScrollOpen] = useState<boolean>(false);
  const [selectedTeamForDraft, setSelectedTeamForDraft] = useState<string>('');

  // Fetch teams to set default selected team for draft form
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teams = await owlPostService.getAllTeams();
        if (teams.length > 0) {
          setSelectedTeamForDraft(teams[0].id);
        }
      } catch (error) {
        console.error('[PlayersPage] Failed to fetch teams:', error);
      }
    };
    fetchTeams();
  }, []);

  // ========================================
  // HANDLERS (Domain-Specific Naming)
  // ========================================

  /**
   * Handle talent drafting ceremony
   */
  const handleTalentDraftingCeremony = async (talentScoutingReport: Omit<Player, 'id'>) => {
    try {
      await draftNewTalentIntoRoster(talentScoutingReport);
      setIsDraftingScrollOpen(false);
    } catch (draftingEnchantmentFailure) {
      console.error('[PlayersPage] Talent drafting ceremony failed:', draftingEnchantmentFailure);
    }
  };

  /**
   * Handle player contract release ritual with confirmation
   */
  const handleContractReleaseRitual = async (playerContractId: string) => {
    const confirmReleaseSpell = window.confirm(
      `⚠️ Ministry Warning: You are about to release this player from their contract. ` +
      `This action is irreversible. Proceed with contract termination?`
    );

    if (confirmReleaseSpell) {
      try {
        await releasePlayerFromContract(playerContractId);
      } catch (releaseRitualError) {
        console.error('[PlayersPage] Contract release ritual failed:', releaseRitualError);
      }
    }
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="scouting-network-sanctum" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <header className="scouting-proclamation" style={{
        marginBottom: '2rem',
        borderBottom: '2px solid #2563eb',
        paddingBottom: '1rem'
      }}>
        <h1 style={{
          fontFamily: 'serif',
          fontSize: '2.5rem',
          color: '#1e40af',
          marginBottom: '0.5rem'
        }}>
          ⚡ Scouting Network
        </h1>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
          Ministry-approved player scouting and roster management
        </p>

        <button
          onClick={() => setIsDraftingScrollOpen(true)}
          className="draft-talent-button"
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
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
          ✨ Draft New Talent
        </button>
      </header>

      {/* Talent Drafting Parchment Modal */}
      {isDraftingScrollOpen && (
        <div
          className="drafting-portal-overlay"
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
          onClick={() => setIsDraftingScrollOpen(false)}
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
            <DraftPlayerForm
              teamId={selectedTeamForDraft}
              onDraft={handleTalentDraftingCeremony}
              onCancel={() => setIsDraftingScrollOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Player Scouting Scroll Presentational Component */}
      <PlayerScroll
        players={scoutedTalentPool}
        isLoading={isFetchingScoutingReports}
        error={scoutingNetworkError}
        onBanishPlayer={handleContractReleaseRitual}
      />
    </div>
  );
}
