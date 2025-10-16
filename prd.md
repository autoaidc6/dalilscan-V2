# DalilScan (دليل سكان) - AI Nutrition Guide

DalilScan is a bilingual (English/Arabic), AI-powered nutritional tracking Progressive Web App (PWA). It allows users to snap a photo of their meal, and instantly analyzes the food's nutritional content using the Google Gemini API. This data is logged to help users track their daily intake against personal health goals.

The application is designed to be simple, intuitive, and culturally adapted for users in the Middle East and beyond, solving the complexity of traditional food logging with a fast, engaging, and modern experience.

---

## ✨ Key Features

*   **🤖 AI-Powered Meal Analysis:** Snap a photo or upload an image, and let the Gemini API instantly identify the food and estimate its calories, protein, carbs, and fat.
*   **🌐 Bilingual (English & Arabic):** Full support for both languages, including a native Right-to-Left (RTL) interface for Arabic users.
*   **📊 Daily Dashboard:** Get an at-a-glance summary of your day, including calorie progress, macronutrient distribution, and water intake.
*   **🥗 Meal & Water History:** A chronological log of everything you've consumed, with the ability to filter by meal type and edit past entries.
*   **🎯 Customizable Goals:** Set personal targets for calories, macronutrients, water intake, and track personal info like weight and activity level.
*   **💾 Persistent Local Data:** Your entire session, including goals and meal history, is saved in your browser. Pick up right where you left off, even after closing the tab.
*   **📱 PWA Installability:** Install DalilScan to your mobile home screen for a fast, app-like experience with offline access.
*   **🚀 Modern & Responsive:** A clean, fast, and mobile-first user interface built with modern web technologies.

---

## 🛠️ Technology Stack

*   **Frontend:** [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
*   **AI:** [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash`) for image-to-nutrition analysis.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) for utility-first design.
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) for smooth page transitions and UI animations.
*   **Routing:** [React Router](https://reactrouter.com/)
*   **State Management:** React Context API
*   **Charting:** [Recharts](https://recharts.org/) for the macronutrient pie chart.

---

## 🚀 Getting Started

This project uses modern web platform features (`importmap`) and does **not** require a traditional build step with `npm` or `yarn`. You can run it directly by serving the files locally.

### Prerequisites

*   A local web server. You can use the `http-server` package from npm, the Live Server extension in VS Code, or Python's built-in server.
*   A Google Gemini API Key.

### Configuration

1.  **Set up the API Key:**
    The application is configured to read the API key from `process.env.API_KEY`. In a development or hosted environment, you need a way to make this key available. A simple method is to add a script tag in `index.html` **before** the main module script.

    Open `index.html` and add the following line inside the `<head>` tag:
    ```html
    <script>
      // WARNING: This is for development only. Do not expose your key in a public repository.
      window.process = { env: { API_KEY: 'YOUR_GEMINI_API_KEY' } };
    </script>
    ```
    Replace `YOUR_GEMINI_API_KEY` with your actual key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Running Locally

1.  **Start a local server:**
    If you have Node.js, you can use `http-server`:
    ```bash
    npx http-server .
    ```
    Or, if you have Python 3:
    ```bash
    python3 -m http.server
    ```

2.  **Open the application:**
    Navigate to the local URL provided by your server (e.g., `http://localhost:8080`) in your web browser. The app should now be running.

---

## 📦 Deployment

DalilScan is a static client-side application. Deployment is as simple as uploading the project files to any static site hosting service.

**Important:** The method you use to provide the `API_KEY` will depend on your hosting provider. You must **never** commit your API key directly into your `index.html` file in a public repository. Use your hosting provider's "Environment Variables" or "Secrets" feature.

### Hosting Platforms

Popular platforms for deploying static apps include:
*   [Vercel](https://vercel.com/)
*   [Netlify](https://www.netlify.com/)
*   [Firebase Hosting](https://firebase.google.com/docs/hosting)
*   [GitHub Pages](https://pages.github.com/)

**Deployment Steps:**

1.  Upload all project files (`index.html`, `index.tsx`, `App.tsx`, etc.) to the root of your hosting service.
2.  Configure your environment variable (`API_KEY`) in your hosting provider's settings.
3.  Deploy! Your site is now live.

---

## 🗺️ Future Roadmap

*   **Full User Authentication:** Implement a secure backend system (e.g., Firebase Auth) to store user data across devices.
*   **Barcode Scanning:** Allow scanning of barcodes on packaged foods for precise nutritional data.
*   **Manual Food Entry:** Add a search feature to log foods without taking a picture.
*   **Deeper Insights:** Provide weekly/monthly reports and trend analysis.
*   **Recipe Analysis:** Allow users to input a recipe URL or ingredients list for a full nutritional breakdown.

---

## 📄 License

This project is licensed under the MIT License.