# GDGC-Winter-Hackathon-Project
The main repository for code used in the GDGC Winter term hackathon

Based on the app template provided by GDGC officers in week 4
Link:
https://github.com/purelyKai/App-Demo-for-GDGoC
Alteration testing

Second Change

# 🏀 CourtCall — NBA Prediction Arena

A mobile app where users predict NBA game outcomes, earn Fan IQ points, and compete on leaderboards. Powered by a real-time ML engine that projects player stats using scikit-learn and live NBA data.

Built for the **GDGC Winter Hackathon**.

---

## Architecture

┌─────────────────────┐ ┌─────────────────────┐
│ React Native App │ HTTP │ ML Service │
│ (Expo / TypeScript)│───────▶│ (Python / FastAPI) │
│ Port: 8081 │◀───────│ Port: 8001 │
└────────┬────────────┘ └──────────┬──────────┘
│ Supabase SDK │ nba_api
▼ ▼
┌─────────────────────┐ ┌─────────────────────┐
│ Supabase │ │ stats.nba.com │
│ (Auth + PostgreSQL)│ │ (Live NBA stats) │
└─────────────────────┘ └─────────────────────┘


| Layer | Tech | Purpose |
|-------|------|---------|
| Mobile App | React Native, Expo, TypeScript | UI, navigation, game picks |
| ML Service | Python 3, FastAPI, scikit-learn, nba_api | Player projections via Linear Regression |
| Database | Supabase (PostgreSQL) | Auth, profiles, games, picks |
| Backend (optional) | Go, Gin | REST API (not active — app uses Supabase directly) |

---

## Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **Xcode** (for iOS simulator) or **Android Studio** (for Android emulator)
- macOS recommended for iOS builds

---

## Quick Start

### 1. Clone the repo

```sh
git clone https://github.com/Alex-V-SGDGC-Winter-Hackathon-Project.git
cd GDGC-Winter-Hackathon-Project


110 x 15
6 Hidden Terminals
Let me check the current READMEs and project setup files:

Now I have everything. I'll rewrite the root README:

File editing is disabled. Here's the full README — replace the content of README.md with this:

┌─────────────────────┐ ┌─────────────────────┐
│ React Native App │ HTTP │ ML Service │
│ (Expo / TypeScript)│───────▶│ (Python / FastAPI) │
│ Port: 8081 │◀───────│ Port: 8001 │
└────────┬────────────┘ └──────────┬──────────┘
│ Supabase SDK │ nba_api
▼ ▼
┌─────────────────────┐ ┌─────────────────────┐
│ Supabase │ │ stats.nba.com │
│ (Auth + PostgreSQL)│ │ (Live NBA stats) │
└─────────────────────┘ └─────────────────────┘


### 1. Clone the repo

cd ml_service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001


### Verify it's running:
curl http://localhost:8001/
# → {"status":"ML Engine is online and ready."}

### Note: The ML service fetches real NBA data from stats.nba.com. First requests may take a few seconds.


### 3. Start the React Native App
###         Open a new terminal:

cd sports_prediction
npm install
npm run ios
# or: npm run android

#       Project Structure

├── sports_prediction/       # React Native (Expo) mobile app
│   ├── src/
│   │   ├── screens/         # LoginScreen, HomeScreen, GameDetailsScreen,
│   │   │                    # BattleScreen, LeaderboardScreen, ProfileScreen
│   │   ├── components/      # GlassCard, GameCard, CoinBadge, etc.
│   │   ├── navigation/      # Stack + Tab navigators
│   │   ├── services/        # supabase.ts (DB client), api.ts (ML + scoring)
│   │   ├── store/           # AppContext (global state)
│   │   ├── theme/           # Colors (dark glassmorphism theme)
│   │   └── types/           # TypeScript interfaces
│   └── package.json
│
├── ml_service/              # Python ML microservice
│   ├── main.py              # FastAPI app + Linear Regression model
│   └── requirements.txt     # fastapi, uvicorn, scikit-learn, nba_api, pandas
│
├── backend/                 # Go REST API (optional, not connected to app)
│   ├── main.go
│   ├── handlers/
│   ├── models/
│   └── routes/
│
└── README.md



#   How It Works
    Login — user signs in via Supabase Auth → profile loaded from profiles table
    Home — today's games fetched from games table, displayed as cards
    Game Details — AI projections for star players (from ML service), performance chart, Quick Analysis
    Battle — user picks a winner → saved to picks table
    Scoring — when a game ends, scorePicks() checks results: ✅ +10 Fan IQ, ❌ streak resets
    Leaderboard — players ranked by Fan IQ
    Profile — shows Fan IQ, streak, coins, pick accuracy, and logout




















