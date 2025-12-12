import {createRoute, type AnyRoute, Link, useParams} from "@tanstack/react-router";
import {useMyAuth} from "../../context/AuthContext";
import React, {useEffect, useState, useRef} from "react";
import {db} from "../../lib/firebase";
import {doc, getDoc, updateDoc, increment} from "firebase/firestore";

export default function storyArticlesRoute (parentRoute: AnyRoute)
{
    return createRoute({
        path: "stories/$storyId",
        getParentRoute: () => parentRoute,
        component: StoryArticlesPage,
    });
}

interface StoryData {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    createdAt?: any;
    authorEmail?: string;
    views?: number;
}

function StoryArticlesPage()
{
    const {storyId} = useParams({from: "/app/stories/$storyId"});
    const [story, setStory] = useState<StoryData | null>(null);
    const {user:wizard}=useMyAuth();
    const [loading, setLoading] = useState(true);
    const hasIncrementedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;  

    async function fetchArticle() {
      const ref = doc(db, "stories", storyId);
      const snap = await getDoc(ref);

      if (cancelled) return;  
      if (snap.exists()) {
        const data = snap.data() as StoryData;
        setStory({ ...data, id: snap.id });

        if (!hasIncrementedRef.current && !cancelled) {
          await updateDoc(ref, {
            views: increment(1),
          });
          if (!cancelled) {
            hasIncrementedRef.current = true;
          }
        }
      }
      if (!cancelled) {
        setLoading(false);
      }
    }

    fetchArticle();

    return () => {
      cancelled = true;  
    };
  }, [storyId]);


    if (loading) {
        return <p style={{padding: "2rem"}}>Brewing Article...</p>;
    }

    if (!story) 
        {
        return 
        (
        <article style={{padding: "2rem"}}><h1>Brewing Unsuccessful</h1>
        <Link to="../stories">Back to Stories</Link>
        </article>
        );
        }


    return (
    <main
      style={{
        minHeight: "100vh",
        padding: "3rem 1.5rem",
        background: "#e8e1d5",
      }}>
      <article
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2.5rem 2rem",
          background: "#f8f3e8",
          border: "2px solid #2f2a24",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}>
        <nav style={{ marginBottom: "1.5rem" }}>
          <Link
            to="../../stories"
            style={{
              fontSize: "0.9rem",
              color: "#1f3a5f",
              textDecoration: "underline",
            }}>
            Back to stories
          </Link>
        </nav>

        <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontSize: "2.1rem",
              marginBottom: "0.5rem",
              letterSpacing: "0.04em",
            }}>
            {story.title}
          </h1>
          <p
            style={{
              color: "#6a5c4a",
              fontSize: "0.9rem",
              margin: 0,
            }}>
            by {story.authorEmail || "Snap by Anonymous Wizard"} • Wizard on
            duty: {wizard?.email}
          </p>
          <p
            style={{
              color: "#6a5c4a",
              fontSize: "0.8rem",
              marginTop: "0.4rem",
            }}>
            Views: {story.views ?? 0}
          </p>
        </header>

        {story.imageUrl && (
          <section style={{ marginBottom: "1.5rem" }}>
            <img
              src={story.imageUrl}
              alt={story.title}
              style={{
                width: "100%",
                maxHeight: "360px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "1px solid #b0a28f",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}/>
            <p
              style={{
                fontSize: "0.8rem",
                fontStyle: "italic",
                marginTop: "0.5rem",
                textAlign: "center",
                color: "#6a5c4a",
              }}>
              Exclusive from the Daily Prophet Archives
            </p>
          </section>
        )}

        <section
          style={{
            lineHeight: 1.7,
            fontSize: "1rem",
            color: "#2f2820",
          }}>
          <p style={{ whiteSpace: "pre-wrap", marginTop: 0 }}>
            {story.content}
          </p>
        </section>
      </article>
    </main>
  );  
}


