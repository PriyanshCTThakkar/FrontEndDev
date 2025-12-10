import { Link } from "@tanstack/react-router";
import { useMinistryAuth } from "../../MinistryAuth";
import { Trophy, Users, ScrollText } from "lucide-react";
import { useState } from "react";
import { seedDatabase, resetDatabase } from "../../../utils/seedData";
import "../../../pages/Dashboard/DashboardPage.css";

export function DashboardPage() {
  const { state } = useMinistryAuth();
  const wizard = state.wizard;
  const [seeding, setSeeding] = useState<boolean>(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const handleSeedDatabase = async () => {
    try {
      setSeeding(true);
      setSeedMessage(null);
      await seedDatabase();
      setSeedMessage('✅ Database seeded successfully with 4 teams and 28 players!');
    } catch (error) {
      setSeedMessage('❌ Failed to seed database. Check console for details.');
      console.error('Seed error:', error);
    } finally {
      setSeeding(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('⚠️ This will delete ALL existing data and create fresh sample data. Are you sure?')) {
      return;
    }

    try {
      setSeeding(true);
      setSeedMessage(null);
      await resetDatabase();
      setSeedMessage('✅ Database reset and reseeded successfully!');
      window.location.reload();
    } catch (error) {
      setSeedMessage('❌ Failed to reset database. Check console for details.');
      console.error('Reset error:', error);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="dashboard-sanctum" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <header className="dashboard-header" style={{ marginBottom: '3rem', borderBottom: '2px solid #8a2be2', paddingBottom: '1rem' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '2.5rem', color: '#2d1b4e' }}>
          Welcome Back, {wizard?.name || 'Wizard'}
        </h1>
        <div className="wizard-stats" style={{ display: 'flex', gap: '1rem', color: '#666' }}>
          <span>🏠 {wizard?.house}</span>
          <span>🪙 {wizard?.galleons?.toLocaleString()} Galleons</span>
          <span>📜 {wizard?.role}</span>
        </div>
      </header>

      {/* Action Cards Grid */}
      <div className="command-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* League Registry Card */}
        <Link to="/quidditch-league-registry" className="command-card" style={{ textDecoration: 'none' }}>
          <div className="card-content" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', transition: 'transform 0.2s', height: '100%' }}>
            <div className="icon-wrapper" style={{ background: '#f3e8ff', width: 'fit-content', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <Trophy size={32} color="#8a2be2" />
            </div>
            <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>League Registry</h2>
            <p style={{ color: '#4b5563' }}>Manage teams, view standings, and oversee league operations.</p>
            <span style={{ display: 'inline-block', marginTop: '1rem', color: '#8a2be2', fontWeight: 600 }}>Enter Registry →</span>
          </div>
        </Link>

        {/* Scouting Network Card */}
        <Link to="/scouting-network" className="command-card" style={{ textDecoration: 'none' }}>
          <div className="card-content" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', transition: 'transform 0.2s', height: '100%' }}>
            <div className="icon-wrapper" style={{ background: '#dbeafe', width: 'fit-content', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <Users size={32} color="#2563eb" />
            </div>
            <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Scouting Network</h2>
            <p style={{ color: '#4b5563' }}>Scout players, manage rosters, and build the ultimate lineup.</p>
            <span style={{ display: 'inline-block', marginTop: '1rem', color: '#2563eb', fontWeight: 600 }}>Scout Talent →</span>
          </div>
        </Link>

        {/* Match Stats Card */}
        <Link to="/match-statistics" className="command-card" style={{ textDecoration: 'none' }}>
          <div className="card-content" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', transition: 'transform 0.2s', height: '100%' }}>
            <div className="icon-wrapper" style={{ background: '#fef3c7', width: 'fit-content', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
              <ScrollText size={32} color="#d97706" />
            </div>
            <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>Match Statistics</h2>
            <p style={{ color: '#4b5563' }}>Record official match results and view historical archives.</p>
            <span style={{ display: 'inline-block', marginTop: '1rem', color: '#d97706', fontWeight: 600 }}>View Archives →</span>
          </div>
        </Link>

      </div>

      {/* Developer Tools Section */}
      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', color: '#2d1b4e', textAlign: 'center' }}>
          🛠️ Developer Tools
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
          Seed the database with sample data to test features
        </p>

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #4a90e2, #8a2be2)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                cursor: seeding ? 'not-allowed' : 'pointer',
                opacity: seeding ? 0.5 : 1,
                fontFamily: 'inherit',
              }}
            >
              {seeding ? '⏳ Seeding...' : '🌱 Seed Database'}
            </button>

            <button
              onClick={handleResetDatabase}
              disabled={seeding}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '700',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '12px',
                color: '#ef4444',
                cursor: seeding ? 'not-allowed' : 'pointer',
                opacity: seeding ? 0.5 : 1,
                fontFamily: 'inherit',
              }}
            >
              {seeding ? '⏳ Resetting...' : '🗑️ Reset & Reseed'}
            </button>
          </div>

          {seedMessage && (
            <p style={{
              margin: '1rem 0 0 0',
              padding: '1rem',
              background: seedMessage.includes('✅') ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              color: seedMessage.includes('✅') ? '#4ade80' : '#ef4444',
              fontSize: '1rem',
            }}>
              {seedMessage}
            </p>
          )}

          <p style={{
            margin: '1rem 0 0 0',
            fontSize: '0.875rem',
            color: '#888',
            fontStyle: 'italic'
          }}>
            Creates 4 teams (one per house) with 7 players each
          </p>
        </div>
      </div>
    </div>
  );
}