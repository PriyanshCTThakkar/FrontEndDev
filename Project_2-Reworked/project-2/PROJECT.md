# Daily Prophet Newsroom

I've built a full-stack newsroom app styled as The Daily Prophet from Harry Potter. Users sign up as wizards, log in to a protected dashboard, and manage news articles. They can create, list, delete stories, and view individual articles with image support and view counters. All data saves to Firebase in real-time.

# How It Complies with Project Requirements

- Component Design: Dashboard (stats cards), StoriesPage (list + sidebar form), StoryArticlesPage (header + image + content) - reusable components with clear props/state
- State Management: AuthContext for global auth state, local useState for forms/stories - separates UI, cache, remote data
- Authentication: Email/password signup/login/logout, protected /app/\* routes, user-specific authorEmail data, Firebase session persistence
- Routing: TanStack Router with nested /app/stories/$storyId, navigation links, landing page
- Server Communication: Full CRUD via Firestore - onSnapshot (read), addDoc (create), deleteDoc (delete), updateDoc (views)

# Tech Stack

- React + TanStack Router
- Firebase Firestore (real-time database)
- Custom AuthContext

# Data Management

- Global: AuthContext tracks user login state
- Local: useState for form inputs and stories cache
- Remote: Firestore "stories" collection with title,content,image,views,authorEmail,timestamps

# Backend Strategy

Firebase Firestore handles all persistence. Stories save with serverTimestamp() and authorEmail. Views increment automatically. onSnapshot provides real-time updates across pages.

## AI Usage Disclosure

I used AI to:

- Clarify project requirements and break down components
- help with ideas for consistent newspaper styling (paper backgrounds, serif fonts)
- Debug routing bug where logout stayed on protected routes (fixed with auth guards + navigate to "/")
