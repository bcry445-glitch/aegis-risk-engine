# AEGIS Investigator UI & Risk Engine 🛡️

A comprehensive, full-stack threat intelligence and fraud investigation command center. AEGIS is designed to ingest device telemetry, cluster related threat footprints dynamically, and perform real-time Anti-Money Laundering (AML) sanctions screening.

## 🌟 Core Features

- **Live Telemetry Dashboard:** An auto-polling data command center that continuously fetches, evaluates, and displays active device sessions and their assigned threat statuses.
- **Dynamic Network Clustering:** A custom SVG-based visualization engine that maps dense device networks. It utilizes a staggered trigonometric orbital algorithm to organize heavily linked Canvas Hashes, entirely preventing node collisions.
- **AML & PEP Sanctions Screening:** A dedicated risk pipeline utilizing Levenshtein distance calculations to execute fuzzy-string matching, successfully catching watchlist hits even when suspect profiles contain typos or aliases.
- **Integrated Telemetry Simulator:** A built-in ingestion form that allows developers and investigators to inject raw device footprints and network IP signals directly into the SQLite backend for real-time cluster testing.

## 🏗️ Architecture & Tech Stack

### Frontend (Client UI)

- **Core:** React, JavaScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Dark-mode optimized analytical theme)
- **Data Management:** Native Fetch API with background polling intervals

### Backend (Risk Engine API)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite3 (Serverless, local persistence)
- **Algorithms:** `fast-levenshtein` (Fuzzy matching resolution)

## 🚀 Installation & Setup

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your local environment.

### 1. Backend Initialization

The backend serves the REST API and manages the SQLite database.
\`\`\`bash

# Navigate to the backend directory

cd backend

# Install necessary dependencies

npm install express sqlite3 cors fast-levenshtein

# Start the Node.js server (Defaults to Port 5000)

node server.js
\`\`\`
_Upon successful startup, the server will initialize `aegis.db` and log the database connection status._

### 2. Frontend Initialization

The frontend serves the React application and Investigator UI.
\`\`\`bash

# Open a new terminal tab and navigate to the frontend directory

cd frontend

# Install the React environment dependencies

npm install

# Start the Vite development server

npm run dev
\`\`\`
_Navigate to `http://localhost:5173` in your web browser to access the dashboard._

## 📂 Project Structure

\`\`\`text
aegis-risk-engine/
│
├── backend/
│ ├── server.js # Express API, SQLite integration, Levenshtein logic
│ ├── aegis.db # Auto-generated SQLite database
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── App.jsx # Application router and state wrapper
│ │ ├── DashboardLayout.jsx # Global UI shell and sidebar navigation
│ │ ├── Dashboard.jsx # Auto-polling Overview grid
│ │ ├── NetworkGraph.jsx # Staggered orbital SVG clustering engine
│ │ └── AmlScreening.jsx # Sanctions screening interface
│ ├── package.json
│ ├── tailwind.config.js
│ └── vite.config.js
│
└── README.md
\`\`\`

## 👤 Author

**Muhammad Fazeel Khan**
