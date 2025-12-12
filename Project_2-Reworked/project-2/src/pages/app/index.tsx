/* Wizard's App Layout */

import { createRoute, type AnyRoute, Link, Outlet } from "@tanstack/react-router";
import dashboardRoute from "./dashboardPage" ;
import storiesRoute from "./storiesPage";
import storyArticlesRoute from "./storyArticlespage";

export default function appRoute(parentRoute: AnyRoute)
{
    const app = createRoute({
        path: "/app",
        getParentRoute: () => parentRoute,
        component: ProtectedAppLayout,
    });

    const dashboard = dashboardRoute(app);
    const stories = storiesRoute(app);
    const storyArticles = storyArticlesRoute(app);
    app.addChildren([dashboard, stories, storyArticles]);
    return app;
}

function ProtectedAppLayout()
{
    return (
        <>
            <header style ={{background: "#1a1a2e", color: "white", padding: "1rem"}}>
                <nav>
                    <Link to="/app/dashboard" style={{marginRight: "2rem"}}>Newsroom</Link>
                    <Link to="/app/stories" style={{marginRight: "2rem"}}>Stories</Link>
                </nav>
            </header>
            <main style ={{padding: "2rem"}}>
                <Outlet />
            </main>
        </>
    );
}