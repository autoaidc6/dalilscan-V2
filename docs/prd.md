# Product Requirements Document (PRD)
## Project: DalilScan (دليل سكان)

### 1. Introduction
DalilScan is a nutrition tracking application designed to lower the friction of food logging. Traditional apps require tedious manual searching and weighing. DalilScan solves this by using AI to analyze food photos, estimating nutrition instantly. It is built with a specific focus on bilingual usability (Arabic/English) to serve a broader demographic often overlooked by major fitness apps.

### 2. User Personas
*   **The Busy Professional:** Wants to track calories but doesn't have time to search databases. Needs a "snap and go" solution.
*   **The Health Conscious Local:** Prefers an interface in their native language (Arabic) and wants an app that supports RTL layouts naturally.
*   **The Gamified Learner:** Needs motivation (badges, streaks) to stick to a new diet routine.

### 3. Functional Requirements

#### 3.1 Onboarding & User Profile
*   **Language Selection:** User must select English or Arabic on first launch.
*   **Goal Setting:** Users input weight, height, age, and activity level to calculate initial goals (Calories, Water).
*   **Guest Mode:** App functions fully without forced login/account creation.

#### 3.2 Food Logging (The Core Loop)
*   **Camera Integration:** Access device camera to capture food.
*   **Image Upload:** Option to upload existing photos from the gallery.
*   **AI Analysis:** Send image to Gemini API to retrieve Name, Calories, Protein, Carbs, and Fat.
*   **Edit before Log:** User can modify AI estimates before saving to history.
*   **Manual Entry:** Fallback form to log food manually if AI fails or isn't needed.

#### 3.3 Dashboard
*   **Daily Summary:** Visual progress bars for Calories and Water.
*   **Macro Chart:** Pie chart showing Protein/Carbs/Fat breakdown.
*   **Daily Challenge:** A rotating challenge (e.g., "Drink 2L Water") based on the day of the year.

#### 3.4 Gamification
*   **Streaks:** Track consecutive days of logging.
*   **Badges:** Unlockable achievements (e.g., "First Scan", "7 Day Streak").
*   **Points:** Earn points for every action to visualize "leveling up".

#### 3.5 History & Insights
*   **Log View:** List of all meals and water entries, filterable by meal type (Breakfast, Lunch, etc.).
*   **Weekly Reports:** Bar charts comparing calorie intake over the last 7 days.
*   **Leaderboard:** A mock leaderboard to foster a sense of community competition.

### 4. Non-Functional Requirements
*   **Performance:** App should load under 2 seconds (using PWA caching).
*   **Privacy:** All user data stays in `localStorage`. No remote database is used for user profiles.
*   **Accessibility:** Semantic HTML and ARIA labels. High contrast colors. Focus management for modals.
*   **Responsiveness:** Mobile-first design that adapts to desktop/tablet views.

### 5. Technical Constraints
*   **No Build Step:** The architecture utilizes `importmap` and ES Modules to run directly in the browser without a bundler (Webpack/Vite) for simplicity and portability in specific environments.
*   **API Limits:** Handling of Gemini API quotas and graceful error messages if limits are reached.

### 6. Future Roadmap
*   **v1.1:** Barcode Scanner integration.
*   **v1.2:** Arabic Voice command support for logging ("I ate an apple").
*   **v2.0:** Cloud Sync and Social Features (Real friends lists).
