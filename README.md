# 🌍 CityMind AI
### AI-Powered Decision Intelligence Platform for Smarter Communities

> **Transforming fragmented urban data into intelligent, explainable, and actionable decisions using Google Gemini, Firebase, Google Maps, and Google Cloud.**

---

## 🚀 Live Demo

🌐 **Live Application:**  
(https://citymind-ai-814982496499.asia-southeast1.run.app)

# 📌 Problem Statement

Modern cities generate enormous volumes of data from citizens, transportation systems, environmental monitoring, utilities, and public services. However, this information often remains fragmented, making it difficult for authorities to prioritize issues, allocate resources efficiently, and make timely decisions.

Traditional reporting platforms simply collect complaints—they do not provide intelligent insights or decision support.

---

# 💡 Our Solution

**CityMind AI** is an AI-powered Decision Intelligence Platform that transforms community reports into actionable insights.

Instead of acting as a passive complaint portal, the platform combines **Google Gemini**, **Google Maps**, and **Firebase** to help governments and organizations:

- Analyze community incidents
- Prioritize issues intelligently
- Generate AI-powered recommendations
- Visualize reports geographically
- Support faster and data-driven decision making

---

# ✨ Key Features

## 🤖 AI Decision Assistant
- Powered by **Google Gemini**
- Natural language interaction
- Executive summaries
- Intelligent prioritization
- Explainable recommendations
- Confidence-based responses

---

## 🗺 Interactive Smart Map
- Google Maps integration
- GPS-based issue reporting
- Interactive location selection
- Geospatial visualization of incidents

---

## 🚨 Community Incident Reporting
Citizens can report:

- Potholes
- Garbage
- Flooding
- Water Leakage
- Public Safety
- Traffic Congestion
- Infrastructure Damage
- Pollution

Each report includes:

- Category
- Priority
- Description
- Timestamp
- Geographic Location

---

## 📊 Smart Analytics Dashboard

Provides real-time insights including:

- Community Health Metrics
- Incident Statistics
- Category Distribution
- Resolution Tracking
- Priority Monitoring
- AI-generated insights

---

## 🔐 Secure Authentication

Powered by Firebase Authentication

- Google Sign-In
- Email Authentication
- Protected Routes
- Secure User Sessions

---

# ☁ Google Technologies Used

| Technology | Purpose |
|------------|---------|
| **Google Gemini API** | AI-powered decision intelligence and recommendations |
| **Firebase Authentication** | Secure user authentication |
| **Cloud Firestore** | Real-time incident database |
| **Google Maps Platform** | Interactive maps and geospatial visualization |
| **Google Cloud Run** | Serverless deployment |
| **Google AI Studio** | Rapid AI development and Gemini integration |

---

# 🏗 System Architecture

```
                    Citizens

                        │

                        ▼

             Firebase Authentication

                        │

                        ▼

          Community Report Submission

                        │

                        ▼

              Cloud Firestore Database

                        │

          ┌─────────────┴─────────────┐

          ▼                           ▼

 Google Gemini API            Google Maps API

 Decision Intelligence        Geospatial Analysis

          │                           │

          └─────────────┬─────────────┘

                        ▼

            Executive Decision Dashboard
```

---

# 🛠 Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Firebase
- Cloud Firestore
- Google Cloud Run

### AI

- Google Gemini API

### Maps

- Google Maps Platform

### Authentication

- Firebase Authentication

---

# ⚙ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/CityMindAI.git
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
VITE_FIREBASE_API_KEY=

VITE_FIREBASE_AUTH_DOMAIN=

VITE_FIREBASE_PROJECT_ID=

VITE_FIREBASE_STORAGE_BUCKET=

VITE_FIREBASE_MESSAGING_SENDER_ID=

VITE_FIREBASE_APP_ID=

VITE_GOOGLE_MAPS_API_KEY=

VITE_GEMINI_API_KEY=
```

Run locally

```bash
npm run dev
```

---

# ☁ Deployment

CityMind AI is deployed using **Google Cloud Run**.

Deployment steps:

```bash
npm run build
```

Deploy

```bash
gcloud run deploy
```

---

# 📂 Project Structure

```
CityMindAI

├── src
│   ├── components
│   ├── pages
│   ├── services
│   ├── firebase
│   ├── hooks
│   ├── types
│   └── App.tsx
│
├── public
│
├── package.json
│
├── vite.config.ts
│
└── README.md
```

---

# 🔄 Workflow

```
Citizen Login

        │

        ▼

Report Community Issue

        │

        ▼

Store in Firestore

        │

        ▼

AI Analysis (Gemini)

        │

        ▼

Decision Intelligence

        │

        ▼

Executive Dashboard

        │

        ▼

Smarter Community Decisions
```

---

# 🌟 Innovation

Unlike traditional complaint management systems, **CityMind AI** transforms static reports into intelligent decision support.

Our platform combines:

- Generative AI
- Geospatial Intelligence
- Real-Time Analytics
- Explainable Recommendations

to enable authorities to make informed, proactive, and transparent decisions.

---

# 📈 Future Scope

- Vertex AI Integration
- BigQuery Analytics
- Google Calendar Integration
- Smart Traffic Prediction
- Disaster Early Warning
- IoT Sensor Integration
- AI Resource Allocation
- Citizen Mobile Application
- Multi-City Dashboard
- Digital Twin Visualization

---

# 👩‍💻 Developed By

**Ahana Amlan Sahoo**

B.Tech Information Technology  
Manipal Institute of Technology, Bengaluru

---

# 📄 License

Licensed under the **MIT License**.

---

## ⭐ CityMind AI

**Empowering communities through AI-powered decision intelligence, geospatial analytics, and responsible cloud-native innovation.**
