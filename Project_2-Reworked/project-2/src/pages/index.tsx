import { createRootRoute, Link, Outlet } from "@tanstack/react-router"; 
import page1 from "./page1";
import page2 from "./page2";
import blog from "./blog";
import { createTree } from "../router";
import { AuthProvider, useMyAuth } from "../context/AuthContext";
import landingPage from "./landingPage";
import loginPage from "./loginPage";
import signUpPage from "./signUpPage";
import appRoute from "./app";

export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => {
    return (
      <div>
        <p>Not found!</p>
        <Link to="/">Go to Daily Prophet</Link>
      </div>
    )
  },
});

// Wrappiung all pages with Auth and nav
function RootLayout() {
  return (
    <AuthProvider>
      <div style={{ padding: "20px" }}>
        <Navigation />
        <main style={{ marginTop: "20px" }}>
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  );
}

function Navigation()
{
  const { isAuthenticated} = useMyAuth();

  return (
    <nav>
      <Link to ="/">The Daily Prophet</Link>
      {!isAuthenticated && 
      (
        <>
          {" | "}
          <Link to ="/login">Present your Wand</Link>
          {" | "}
          <Link to ="/signup">Go to Ollivander's</Link>
        </>
      )}
        
      </nav>
  )
}
export const routeTree = createTree(rootRoute,
  landingPage,
  loginPage,
  signUpPage,
  appRoute,
  page1,
  page2,
  blog
)
