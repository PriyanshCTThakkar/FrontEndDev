/*
Daily prophet dashboard - the first protected page
Shows user is logged in by proving auth works and unlocks protected features
*/

import { createRoute, type AnyRoute, Link} from "@tanstack/react-router";
import { useMyAuth } from "../../context/AuthContext";
import {useNavigate} from "@tanstack/react-router";
import React, {useEffect, useState} from "react";
import {db} from "../../lib/firebase";
import {collection, onSnapshot} from "firebase/firestore";

export default function dashboardRoute(parentRoute: AnyRoute) 
{
    return createRoute({ path: "dashboard",
    getParentRoute: () => parentRoute,
    component: mydashboardPage,
})
}

function mydashboardPage() 
{
    const { user: wizard, isAuthenticated: hasMinistryaccess, logout: mischiefManaged } = useMyAuth();
    const apparate = useNavigate();
    const [totalStories, setTotalStories] = useState(0);
    const [totalViews, setTotalViews] = useState(0);

    useEffect(() => {
        const storiesRef = collection(db, "stories");
        const unsubscribe = onSnapshot(storiesRef, (snapshot) => {
            const docs = snapshot.docs.map((d) => d.data() as any);
            setTotalStories(docs.length);
            let viewsSum = docs.reduce(
                (sum, story) => sum + (typeof story.views === "number" ? story.views : 0),
                0
            );
            setTotalViews(viewsSum);
        });
        return () => unsubscribe();
    }, []);


    // kicking out intruders

    useEffect(() => {
        if (!hasMinistryaccess) {
       apparate({ to: "/" });
        }
    }, [hasMinistryaccess, apparate]);

    if (!hasMinistryaccess) {
       return <div> Verifying your wand...</div>;
    }



    return (
  <main
    style={{
      minHeight: "100vh",
      padding: "3rem 1.5rem",
      background: "#e8e1d5",
    }}
  >
    <section
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "2.5rem 2rem",
        background: "#f8f3e8",
        border: "2px solid #2f2a24",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "2rem",
            letterSpacing: "0.04em",
          }}
        >
          Newsroom Dashboard
        </h1>
        <p style={{ marginTop: "0.6rem", color: "#4a4338" }}>
          Welcome back, {wizard?.email}
        </p>
      </header>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            flex: "0 1 220px",
            padding: "1.25rem 1rem",
            borderRadius: "8px",
            border: "1px solid #b0a28f",
            background: "#fbf6ea",
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "2rem",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            {totalStories}
          </h2>
          <p style={{ marginTop: "0.4rem", color: "#3d362e" }}>Total Stories</p>
        </div>

        <div
          style={{
            flex: "0 1 220px",
            padding: "1.25rem 1rem",
            borderRadius: "8px",
            border: "1px solid #b0a28f",
            background: "#fbf6ea",
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "2rem",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            {totalViews}
          </h2>
          <p style={{ marginTop: "0.4rem", color: "#3d362e" }}>Total Views</p>
        </div>
      </div>

      <nav style={{ textAlign: "center" }}>
        <Link
          to="../stories"
          style={{
            display: "inline-block",
            padding: "0.9rem 1.8rem",
            background: "#2f6f3e",
            color: "#ffffff",
            borderRadius: "999px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          Manage Articles
        </Link>
      </nav>
    </section>
  </main>
);

}



