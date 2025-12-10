import {
  type AnyRoute,
  createRouter,
  RouterProvider as TanRouterProvider,
} from "@tanstack/react-router";
import { routeTree } from "./pages";

export function createTree(
  parent: AnyRoute,
  ...createFns: ((parent: AnyRoute) => AnyRoute)[]
) {
  return parent.addChildren(createFns.map((fn) => fn(parent)));
}

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

// TypeScript type registration for router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function RouterProvider() {
  return <TanRouterProvider router={router} />;
}
