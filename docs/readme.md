# DalilScan (دليل سكان) 🌿

**Your Bilingual AI Nutrition Guide | دليلك الغذائي الذكي**

DalilScan is a Progressive Web Application (PWA) designed to simplify nutrition tracking for users in the Middle East and beyond. By leveraging the power of Google's Gemini API, DalilScan allows users to snap a photo of their food to instantly receive nutritional analysis (calories, macros) and track their daily progress in either English or Arabic.

## ✨ Features

*   **📸 AI Food Analysis:** Snap a photo or upload an image. The app uses `gemini-2.5-flash` to identify food and estimate nutrition (Calories, Protein, Carbs, Fat).
*   **🌍 Bilingual Support:** Fully localized for English (LTR) and Arabic (RTL) interfaces.
*   **🏆 Gamification:** Earn badges and points for streaks and logging habits to stay motivated.
*   **💧 Water & Macro Tracking:** Log water intake and visualize macronutrient distribution with interactive charts.
*   **📱 PWA Ready:** Installable on mobile devices with offline capabilities via Service Workers.
*   **🔒 Privacy Focused:** Data is stored locally on the device (LocalStorage).

## 🚀 Getting Started

DalilScan is built as a **client-side only** application using ES Modules and Import Maps. It does not require a complex build step (like Webpack) to run locally, just a static file server.

### Prerequisites

*   A Google Gemini API Key. Get one [here](https://aistudio.google.com/app/apikey).
*   A local static file server (e.g., `http-server`, Python `http.server`, or VS Code Live Server).

### Installation & Running

1.  **Clone the repository** (or download the files).

2.  **Configure API Key:**
    *   *Note:* In a production environment, your hosting provider handles the API key injection.
    *   For local development, create a temporary script in the `<head>` of `index.html`:
    ```html
    <script>
      window.process = { env: { API_KEY: 'YOUR_ACTUAL_API_KEY_HERE' } };
    </script>
    ```

3.  **Start the Server:**

    Using Python 3:
    ```bash
    python3 -m http.server 8080
    ```

    Using Node.js `http-server`:
    ```bash
    npx http-server .
    ```

4.  **Open the App:**
    Navigate to `http://localhost:8080` in your browser.

## 🛠️ Tech Stack

*   **Core:** React 19, TypeScript
*   **AI:** Google Gemini API (`@google/genai`)
*   **State Management:** React Context API
*   **Routing:** React Router DOM v6+
*   **Styling:** Tailwind CSS (via CDN)
*   **Animations:** Framer Motion
*   **Charts:** Recharts

## 🤝 Contributing

Contributions are welcome! Please ensure any changes support both LTR and RTL layouts.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License.
