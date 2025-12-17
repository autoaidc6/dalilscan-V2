# Architecture & Technical Design
## DalilScan (دليل سكان)

### 1. High-Level Overview

DalilScan is a **Client-Side Single Page Application (SPA)**. It is built using React and TypeScript, but unlike standard modern workflows, it does **not** use a bundler (like Webpack or Vite) for the runtime. Instead, it relies on modern browser capabilities: **ES Modules** and **Import Maps**.

This architecture allows the app to be highly portable, edit-friendly, and require zero compile-time steps to view changes locally, provided dependencies are served via CDN.

### 2. Core Components

#### 2.1 The "No-Bundler" Setup
*   **`index.html`**: The entry point. It defines an `<script type="importmap">` block. This maps bare module imports (e.g., `import React from 'react'`) to CDN URLs (e.g., `https://esm.sh/react`).
*   **`index.tsx`**: The JavaScript entry point. It imports the root `App` component.

#### 2.2 State Management (Context API)
The app avoids external state libraries (Redux/Zustand) in favor of React Context for simplicity and reduced bundle size:

1.  **`UserContext`**: Stores profile data (Name, Goals, Weight) and gamification stats (Points, Streaks). Persists to `localStorage`.
2.  **`LogContext`**: Stores the array of `Meal` and `WaterLog` entries. Handles calculation of daily totals and chart data. Persists to `localStorage`.
3.  **`I18nContext`**: Handles the active language (`en` vs `ar`) and text direction (`ltr` vs `rtl`). It provides the `t()` translation function.
4.  **`UIContext`**: Manages global UI states like Modal visibility (Scan Modal, Manual Entry Modal).
5.  **`AuthContext`**: Manages the "Authenticated" state (Guest login) to protect routes.

#### 2.3 AI Integration (`GeminiService`)
*   **Service:** `services/geminiService.ts`
*   **Model:** `gemini-2.5-flash`
*   **Flow:**
    1.  User captures image (Canvas/Video API).
    2.  Image is converted to Base64.
    3.  Service constructs a payload with a specific system prompt requesting JSON output.
    4.  Gemini returns a JSON object with `{ name, calories, protein, carbs, fat }`.
    5.  Result is parsed and presented to the user for confirmation.

#### 2.4 Routing & Navigation
*   **Library:** `react-router-dom` (HashRouter is used for better compatibility with static file hosting).
*   **Structure:**
    *   `/`: Onboarding
    *   `/dashboard`: Main hub
    *   `/scan`: Image processing view
    *   `/history`: Log list
    *   `/goals`: Profile settings
    *   `/insights`: Charts & Leaderboard

### 3. Directory Structure

```text
/
├── components/         # Reusable UI components (Sidebar, BottomNav, Toast)
│   └── icons/          # SVG Icon components
├── context/            # React Context providers (State logic)
├── docs/               # Documentation (Readme, PRD, Arch)
├── gamification/       # Logic for Badges and Challenges
├── i18n/               # Localization (Translation files and logic)
├── images/             # Static assets (thumbnails)
├── pages/              # Main Route Views (Dashboard, Scan, History...)
├── services/           # External API interactions (Gemini)
├── App.tsx             # Main Layout & Routing logic
├── index.tsx           # Entry point
├── index.html          # HTML Shell & Import Maps
├── manifest.json       # PWA Configuration
├── metadata.json       # Project metadata/permissions
├── sw.js               # Service Worker (Caching)
└── types.ts            # TypeScript Interfaces
```

### 4. Data Persistence
Data is stored in the browser's `localStorage` using the following keys:
*   `dalilscan-user`: JSON object of user profile & gamification.
*   `dalilscan-log`: JSON array of all logged meals.
*   `dalilscan-lang`: String ('en' or 'ar').
*   `dalilscan-auth`: Boolean flag.

### 5. PWA (Progressive Web App)
*   **Service Worker (`sw.js`)**: Caches critical assets (HTML, Icons) to allow the app to load even if the network is flaky or offline.
*   **Manifest (`manifest.json`)**: Defines the app name, icons, and theme colors, allowing it to be "Installed" to the home screen on iOS and Android.
