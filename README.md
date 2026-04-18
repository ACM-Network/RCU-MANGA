# RCPU

RCPU (Realm Cinematic Publishing Universe) is a cinematic manga publishing platform built with Next.js App Router, TypeScript, Tailwind CSS, and Firebase. The product is designed around a Webtoon-style reader experience with a connected-universe layer, lore navigation, real-time chapter discussions, and reader personalization.

## Features

- Dark cinematic UI with neon red and deep-purple accents
- Home page with featured hero, Continue Reading, trending, and latest updates
- Searchable manga library with genre, universe, and status filters
- Manga detail pages with chapter lists and bookmarking
- Vertical chapter reader with cinematic fullscreen mode
- Reading progress persistence
- Optional ambient background music toggle
- Firebase Authentication-ready login and signup flows
- Real-time comments with likes
- Universe lore page with timeline, character cards, organizations, and story-map layout
- SEO helpers via metadata, `sitemap.xml`, and `robots.txt`
- Local demo fallback if Firebase env vars are not configured

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Firebase Auth
- Firestore
- Next/Image

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

3. Start the app:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Firebase Setup Guide

1. Create a Firebase project in the Firebase console.
2. Add a Web App to the project.
3. Copy the Firebase web config values into `.env.local`.
4. Enable Authentication:
   - Go to `Authentication`
   - Enable `Email/Password`
5. Enable Firestore:
   - Go to `Firestore Database`
   - Create the database in production or test mode
6. Add security rules based on your production needs.

### Suggested Firestore Collections

`users/{userId}`

```json
{
  "name": "Reader Name",
  "email": "reader@example.com",
  "bookmarks": ["eclipse-protocol"],
  "likedChapters": ["ep-003"],
  "readingHistory": {
    "eclipse-protocol": {
      "mangaSlug": "eclipse-protocol",
      "chapterId": "ep-003",
      "progress": 0.75,
      "updatedAt": "2026-04-16T10:00:00.000Z"
    }
  }
}
```

`comments/{commentId}`

```json
{
  "userId": "abc123",
  "userName": "Reader Name",
  "chapterId": "ep-003",
  "text": "That reveal ties directly into Ember Veil.",
  "likes": 3,
  "likedBy": ["user-a", "user-b"],
  "createdAt": "server timestamp"
}
```

## Project Structure

```text
app/
components/
hooks/
lib/
public/
styles/
```

## Notes

- If Firebase is not configured, the site still works in a local demo mode using browser storage.
- The content layer is seeded with original RCPU universe data so the platform feels coherent immediately.
- The SVG assets in `public/` are lightweight and optimized for fast local development and Vercel deployment.
