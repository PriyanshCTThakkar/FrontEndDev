import { createRoute, type AnyRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, use } from "react";
import { useMyAuth } from "../context/AuthContext";

export default function signupRoute(parentRoute: AnyRoute) {
  return createRoute({
    path: "/signup",
    getParentRoute: () => parentRoute,
    component: SignupPage,  
  });
}

function SignupPage() {  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error, isAuthenticated } = useMyAuth();  
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) 
      {
        navigate({to:"/app/dashboard"});
      }
  }, [isAuthenticated, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();
    await signup(email, password);  
  };

  return (
  <main
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#e8e1d5",
    }}
  >
    <article
      style={{
        width: "100%",
        maxWidth: "420px",
        padding: "2.25rem 2rem",
        background: "#f8f3e8",
        border: "2px solid #2f2a24",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      }}
    >
      <header style={{ marginBottom: "1.75rem", textAlign: "center" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "1.8rem",
            letterSpacing: "0.04em",
          }}
        >
          Register New Reporter
        </h1>
        <p style={{ marginTop: "0.5rem", color: "#4a4338", fontSize: "0.95rem" }}>
          Create your Daily Prophet newsroom account.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "0.35rem",
              fontSize: "0.9rem",
              color: "#3d362e",
            }}
          >
            Owl Post Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid #b0a28f",
              fontSize: "0.95rem",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "0.35rem",
              fontSize: "0.9rem",
              color: "#3d362e",
            }}
          >
            Incantation
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid #b0a28f",
              fontSize: "0.95rem",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem 1.5rem",
            borderRadius: "999px",
            border: "none",
            background: "#1f3a5f",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: "pointer",
          }}
        >
          Visit Ollivander&apos;s
        </button>
      </form>
    </article>
  </main>
);

}
