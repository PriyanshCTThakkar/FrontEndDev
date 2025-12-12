import { createRoute, type AnyRoute } from "@tanstack/react-router";;
import { Link } from "@tanstack/react-router";
import { useMyAuth } from "../context/AuthContext";

export default function landingRoute(parentRoute: AnyRoute) {
  return createRoute({
    path: "/",
    getParentRoute: () => parentRoute,
    component: LandingPage,
  });
}

// The page title defines what the app does, it will be a new app to read wizarding news.
// The Daily Prophet is just to give Harry potter vibes
// This function will prompt the user to 'Presnt their wand' (login) or 'Visit Ollivander's' (signup)
function LandingPage() {
  const { isAuthenticated } = useMyAuth();
  return (
    <article
      style={{
        maxWidth: "720px",
        margin: "3rem auto",
        padding: "2.5rem 2rem",
        background: "#f8f3e8",             
        border: "2px solid #2f2a24",       
        borderRadius: "10px",             
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}>
      <header style={{ marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "2.4rem",
            letterSpacing: "0.04em",
            margin: 0,
          }}>
          Daily Prophet Newspaper
        </h1>
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "1rem",
            color: "#4a4338",
          }}>
          Wizarding news straight from the Ministry desk.
        </p>
      </header>

      <p
        style={{
          margin: "0 0 2rem",
          fontSize: "1.05rem",
          color: "#3d362e",
        }}>
        Welcome to The Daily Prophet. Present your wand to enter, or visit
        Ollivander&apos;s to get one.
      </p>

      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}>
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              style={{
                padding: "0.75rem 1.75rem",
                background: "#2f6f3e",   
                color: "#ffffff",
                borderRadius: "999px",   
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}>
              Present your Wand
            </Link>
            <Link
              to="/signup"
              style={{
                padding: "0.75rem 1.75rem",
                background: "#1f3a5f",
                color: "#ffffff",
                borderRadius: "999px",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "0.95rem",
              }}>
              Visit Ollivander&apos;s
            </Link>
          </>
        ) : (
          <Link
            to="/app/dashboard"
            style={{
              padding: "0.75rem 1.75rem",
              background: "#2f6f3e",
              color: "#ffffff",
              borderRadius: "999px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}>
            Go to Newsroom
          </Link>
        )}
      </section>
    </article>
  );
}