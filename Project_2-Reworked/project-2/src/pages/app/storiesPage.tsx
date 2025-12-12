/* this page manages the news articles for the Newsroom for The daily Prophet */

import {createRoute, type AnyRoute, Link, useNavigate} from "@tanstack/react-router";
import {useMyAuth} from "../../context/AuthContext";
import React, {useEffect, useState} from "react";
import {db} from "../../lib/firebase";
import {collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp} from "firebase/firestore";


export default function storiesRoute (parentRoute: AnyRoute)
{
    return createRoute({
        path: "stories",
        getParentRoute: () => parentRoute,
        component: StoriesPage,
    });
}

function StoriesPage()
{
    const { user: wizard, isAuthenticated: hasNewsRoomAccess, logout: endShift } = useMyAuth();
    const navigate = useNavigate();
    useEffect(() => {
  if (!hasNewsRoomAccess) {
    navigate({ to: "/" });
  }
}, [hasNewsRoomAccess, navigate]);

    const [stories, setStories] = useState<any[]>([]);
    const [form, setform] = useState({
      title: "",
      content: "",
      imageUrl: "",
      createdAt: null,
});

    useEffect(() => {
      const storiesCollectionRef = collection(db, "stories");

      const unsubscribe = onSnapshot(storiesCollectionRef, (snapshot) => {
        const storiesData = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("DOC", doc.id, data);
        return {
          id: doc.id,
          ...data,
        };
        });
        setStories(storiesData);
      });
      
      return () => unsubscribe();
    }, []);


    const handlingSubmission = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!form.title.trim()) return;

      await addDoc(collection(db, "stories"), {
        title: form.title,
        content: form.content,
        imageUrl: form.imageUrl,
        createdAt: serverTimestamp(),
        UpdatedAt: serverTimestamp(),
        views: 0,
        authorEmail: wizard?.email,
      });

      setform({title: "", content: "", imageUrl: "", createdAt: null});
    };

      const handlingDeletion = async(id:string) => {
        await deleteDoc(doc(db, "stories", id));
      };


  // useEffect(() => {
  //   if (!hasNewsroomAccess) {
  //     navigate({ to: "/login" });
  //   }
  // }, [hasNewsroomAccess, navigate]);


    return (
    <main
      style={{
        minHeight: "100vh",
        padding: "3rem 1.5rem",
        background: "#e8e1d5",
      }}>
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
        }}>
        <section style={{ flex: "2 1 0" }}>
          <header style={{ marginBottom: "1.5rem" }}>
            <h1
              style={{
                margin: 0,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: "2rem",
                letterSpacing: "0.03em",
              }}>
              Breaking Stories
            </h1>
            <p style={{ marginTop: "0.4rem", color: "#4a4338" }}>
              Manage Daily Prophet headlines, Reporter: {wizard?.email}
            </p>
          </header>

          {stories.length === 0 ? (
            <p>No stories published yet. Write the first headline.</p>
          ) : (
            stories.map((story) => (
              <article
                key={story.id}
                style={{
                  background: "#f8f3e8",
                  border: "1px solid #b0a28f",
                  borderRadius: "8px",
                  padding: "1.25rem 1.1rem",
                  marginBottom: "1rem",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    fontSize: "1.4rem",
                  }}>
                  {story.id ? (
                    <Link to={`/app/stories/${story.id}`}>{story.title}</Link>
                  ) : (
                    story.title
                  )}
                </h2>

                <section
                  style={{
                    marginTop: "0.4rem",
                    paddingTop: "0.4rem",
                    borderTop: "1px solid #d4c6b2",
                    fontSize: "0.85rem",
                    color: "#6a5c4a",
                  }}>
                  <span>Views: {story.views ?? 0}</span>
                  <span style={{ marginLeft: "0.75rem" }}>• Status: Published</span>
                </section>

                <footer style={{ marginTop: "0.7rem" }}>
                  <button
                    style={{
                      color: "red",
                      marginRight: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => handlingDeletion(story.id)}>
                    Delete Story
                  </button>
                </footer>
              </article>
            ))
          )}
        </section>

        <aside
          style={{
            flex: "1 1 260px",
            maxWidth: "320px",
            background: "#f8f3e8",
            border: "2px solid #2f2a24",
            borderRadius: "10px",
            padding: "1.5rem 1.2rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
            position: "sticky",
            top: "2.5rem",
          }}>
          <h2
            style={{
              marginTop: 0,
              marginBottom: "1rem",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.3rem",
            }}>
            Add New Story
          </h2>

          <form
            onSubmit={handlingSubmission}
            style={{ display: "grid", gap: "1rem" }}>
            <label style={{ fontSize: "0.9rem", color: "#3d362e" }}>
              Headline
              <input
                placeholder="Headline (e.g. 'Voldemort Spotted in Diagon Alley!')"
                style={{
                  marginTop: "0.3rem",
                  padding: "0.55rem 0.7rem",
                  fontSize: "0.95rem",
                  borderRadius: "6px",
                  border: "1px solid #b0a28f",
                }}
                value={form.title}
                onChange={(e) =>
                  setform((prev) => ({ ...prev, title: e.target.value }))
                }/>
            </label>

            <label style={{ fontSize: "0.9rem", color: "#3d362e" }}>
              Story Content
              <textarea
                placeholder="Story Content Details..."
                style={{
                  marginTop: "0.3rem",
                  padding: "0.55rem 0.7rem",
                  fontSize: "0.95rem",
                  minHeight: "100px",
                  borderRadius: "6px",
                  border: "1px solid #b0a28f",
                  resize: "vertical",
                }}
                rows={4}
                value={form.content}
                onChange={(e) =>
                  setform((prev) => ({ ...prev, content: e.target.value }))
                }/>
            </label>

            <label style={{ fontSize: "0.9rem", color: "#3d362e" }}>
              Image URL (optional)
              <input
                placeholder="Image URL (optional)"
                style={{
                  marginTop: "0.3rem",
                  padding: "0.55rem 0.7rem",
                  fontSize: "0.95rem",
                  borderRadius: "6px",
                  border: "1px solid #b0a28f",
                }}
                value={form.imageUrl}
                onChange={(e) =>
                  setform((prev) => ({ ...prev, imageUrl: e.target.value }))
                }/>
            </label>

            <button
              type="submit"
              style={{
                background: "#2f6f3e",
                color: "white",
                padding: "0.7rem 1.2rem",
                border: "none",
                borderRadius: "999px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}>
              Publish Story
            </button>
          </form>
        </aside>
      </section>

      <footer
        style={{
          marginTop: "3rem",
          paddingTop: "2rem",
          borderTop: "1px solid #ccc",
          textAlign: "center",
        }}>
        <Link to="/app/dashboard" style={{ marginRight: "2rem" }}>
          Newsroom Dashboard
        </Link>
        <button
          onClick={async () => {
          await endShift();
          navigate({ to: "/" });
          }}
          style={{
            background: "#f44336",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}>
          Mischief Managed (Logout)
        </button>
      </footer>
    </main>
  );
}
