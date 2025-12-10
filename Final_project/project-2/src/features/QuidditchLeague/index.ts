/**
 * QuidditchLeague Feature
 * Manages teams, players, matches, and league standings
 *
 * Architectural Pattern: Feature-based isolation
 * Export all public components, hooks, and types through this barrel
 */

// Components (Presentational Layer)
export { LeagueScroll } from './components/LeagueScroll';
export { RecruitmentForm } from './components/RecruitmentForm';
export { PlayerScroll } from './components/PlayerScroll';
export { DraftPlayerForm } from './components/DraftPlayerForm';
export { MatchResultForm } from './components/MatchResultForm';
// export { TeamCard } from './components/TeamCard';
// export { TeamRoster } from './components/TeamRoster';
// export { LeagueStandings } from './components/LeagueStandings';
// export { MatchSchedule } from './components/MatchSchedule';

// Hooks (Business Logic Layer)
export { useTeamList } from './hooks/useTeamList';
export { usePlayerRoster } from './hooks/usePlayerRoster';
export { useMatchStats, calculateLeagueStandings } from './hooks/useMatchStats';
// export { useMatches } from './hooks/useMatches';
// export { useLeagueStats } from './hooks/useLeagueStats';
// export { useTransferMarket } from './hooks/useTransferMarket';

// Types (Type Definitions)
// export type { TeamFilter, PlayerFilter, MatchResult } from './types';
