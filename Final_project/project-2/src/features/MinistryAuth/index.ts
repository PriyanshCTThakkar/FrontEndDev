/**
 * MinistryAuth Feature
 * Handles wizard authentication, registration, and authorization
 *
 * Architectural Pattern: Feature-based isolation
 * Export all public components, hooks, and types through this barrel
 */

// Context & State Management
export {
  MinistryAuthProvider,
  useMinistryAuth,
  type MinistryAuthState,
  type MinistryAuthAction,
  type LoginCredentials,
} from './context/MinistryAuthContext';

// Components (Presentational Layer)
export { MuggleRepellent, MuggleRepellentWithLoading } from './components/MuggleRepellent';
// export { LoginForm } from './components/LoginForm';
// export { RegisterForm } from './components/RegisterForm';
// export { WizardProfileCard } from './components/WizardProfileCard';

// Hooks (Business Logic Layer)
// export { useAuth } from './hooks/useAuth';
// export { useWizardSession } from './hooks/useWizardSession';
// export { useMinistryValidation } from './hooks/useMinistryValidation';

// Types (Type Definitions)
// export type { AuthState, LoginCredentials, RegistrationData } from './types';
