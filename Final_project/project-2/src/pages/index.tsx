/**
 * Wizarding World Route Tree
 * * Registers all known magical locations (routes) in the application.
 * Uses domain-specific naming to map paths to their route factories.
 */

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NavigationSpell } from "../components/Layout/NavigationSpell";
import { MinistryAuthProvider } from "../features/MinistryAuth/context/MinistryAuthContext";
import "../App.css";

// 1. Import Your Custom Route Factories
import createLandingPage from "./landing";
import createMinistryPortal from "./login";
import createMinistryEnlistment from "./signup";
import createLeagueRegistry from "./teams/index";
import createCommandCenter from "./dashboard/index";
import createScoutingNetwork from "./players/index";
import createMatchArchive from "./stats/index";

// 2. Define the Root Route (The Main Layout)
// This wraps the entire app in Auth Context and Navigation
const wizardingRootRoute = createRootRoute({
  component: WizardingWorldRootLayout,
});

function WizardingWorldRootLayout() {
  return (
    <MinistryAuthProvider>
      <div className="app">
        <NavigationSpell />
        <main className="wizarding-main-content">
          <Outlet />
        </main>
      </div>
    </MinistryAuthProvider>
  );
}

// 3. Initialize the Routes
// We call the factory functions to create the route objects
const landingRoute = createLandingPage(wizardingRootRoute);
const ministryPortalRoute = createMinistryPortal(wizardingRootRoute);
const ministryEnlistmentRoute = createMinistryEnlistment(wizardingRootRoute);
const leagueRegistryRoute = createLeagueRegistry(wizardingRootRoute);
const commandCenterRoute = createCommandCenter(wizardingRootRoute);
const scoutingNetworkRoute = createScoutingNetwork(wizardingRootRoute);
const matchArchiveRoute = createMatchArchive(wizardingRootRoute);

// 4. Build the Route Tree
// Note: We use .addChildren() which is the standard TanStack pattern
const wizardingWorldTree = wizardingRootRoute.addChildren([
  landingRoute,
  ministryPortalRoute,
  ministryEnlistmentRoute,
  leagueRegistryRoute,
  commandCenterRoute,
  scoutingNetworkRoute,
  matchArchiveRoute,
]);

// 5. Export the Route Tree
// This is used by router.tsx to create the router instance
export const routeTree = wizardingWorldTree;