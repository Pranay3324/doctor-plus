🏥 Doctor Plus - AI-Powered Personal Health Partner

Doctor Plus is a comprehensive, full-stack web application designed to be your 24/7 personal health companion. Leveraging the power of Google's Gemini AI, OpenStreetMap, and Firebase, it provides real-time medical guidance, health tracking, and multimodal analysis.

🚀 Features

🤖 AI Health Chat & Wellness

Symptom Checker: Chat with an AI assistant to analyze symptoms and get preliminary advice.

First-Aid Guidance: Instant, step-by-step instructions for emergencies (e.g., snake bites, burns).

Mood Journal: Log your feelings and receive empathetic, AI-driven mindfulness suggestions.

Recipe Generator: Input available ingredients to get healthy, nutritional recipe ideas.

📍 Hospital Locator

Real-Time Location: Automatically detects your location using browser Geolocation API.

Nearby Search: Finds hospitals and clinics within a 5km radius using OpenStreetMap (Overpass API).

Direct Navigation: Provides direct links to Google Maps for directions.

🍎 Personal Health Tracker

Activity & Food Logging: Log daily meals and physical activities.

AI Insights: Generates personalized health reports and suggestions based on your log history using Gemini AI.

Cloud Storage: Securely stores your health history in Firebase Firestore.

📷 Multimodal Analysis

Food Vision: Upload a photo of your meal to get an estimated nutritional breakdown (Calories, Protein, Carbs, Fat).

Skin Condition Analysis: Upload a photo of a skin issue for a preliminary analysis and visual description (Beta).

🛠️ Tech Stack

Frontend

Framework: React (Vite)

Styling: Tailwind CSS

Authentication: Firebase Auth (Google & Anonymous)

HTTP Client: Fetch API

Backend

Runtime: Node.js

Framework: Express.js

AI Integration: Google Generative AI SDK (Gemini 2.5 Flash)

Database: Firebase Admin SDK (Firestore)

Maps Integration: Axios (querying Overpass API)

⚙️ Installation & Setup

Follow these steps to run the project locally.

1. Prerequisites

Node.js (v18 or higher recommended)

npm (Node Package Manager)

A Firebase Project

A Google Cloud Project with Gemini API enabled

2. Clone the Repository

git clone [https://github.com/your-username/doctor-plus.git](https://github.com/your-username/doctor-plus.git)
cd doctor-plus


3. Backend Setup

Navigate to the server directory and install dependencies.

cd server
npm install


Configuration:

Create a .env file in the server/ directory.

Add your API keys and configuration path:

PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_SERVICE_ACCOUNT_PATH=./config/your-firebase-key-file.json


Download your Firebase Service Account Key (JSON) from the Firebase Console -> Project Settings -> Service Accounts.

Create a config folder inside server/ and place the JSON file there.

4. Frontend Setup

Open a new terminal, navigate to the client directory, and install dependencies.

cd client
npm install


Configuration:

Open client/src/config/firebase.js (or App.jsx if using the single-file version).

Replace the firebaseConfig object with your web app credentials from the Firebase Console.

🏃‍♂️ Running the Application

You need to run both the backend and frontend servers simultaneously.

Terminal 1 (Backend):

cd server
node server.js


Output should say: Server listening on port 5000

Terminal 2 (Frontend):

cd client
npm run dev


Open your browser to the URL shown (usually http://localhost:5173)

📂 Project Structure

doctor-plus/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI & Feature Components
│   │   │   ├── auth/       # Login logic
│   │   │   ├── common/     # Header, Footer, Spinners
│   │   │   └── features/   # Chat, Tracker, Map, Image Analysis
│   │   ├── config/         # Firebase & API config
│   │   └── App.jsx         # Main Component
│   └── ...
└── server/                 # Node.js Backend
    ├── config/             # JSON Key & Config files
    ├── server.js           # Express App & API Routes
    └── .env                # Secrets


🛡️ Security & Privacy

Data: User data is stored securely in Firebase Firestore, restricted by user ID.

Disclaimer: This application is for informational purposes only. It does not provide medical diagnosis. Always consult a professional.

🤝 Contributing

Contributions