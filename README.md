# 🌾 AgroBot - AI Farming Assistant

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Flask-3.0.0-000000?style=for-the-badge&logo=flask" alt="Flask" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google" alt="Gemini" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</div>

<br/>

<div align="center">
  <h3>🎯 Your Smart Farming Companion</h3>
  <p><strong>Talk, Type, or Upload for Instant AI-Powered Agricultural Advice</strong></p>
</div>

---

## 📋 Overview

**AgroBot** is a modern, AI-powered farming assistant with a beautiful **Gemini-style unified chat interface**. Built for project expos and real-world agricultural applications, it provides farmers with instant, multilingual advice on crops, soil, irrigation, pest control, and plant disease detection.

### ✨ Key Features

#### 🎤 **Unified Chat Interface**
- Single conversation thread like ChatGPT/Gemini
- Voice, text, and image inputs work seamlessly in one chat
- **Chat persistence** - Messages saved across page refreshes
- Audio playback with **pause/resume/stop controls**
- Professional landing page with smooth navigation

#### 🗣️ **Voice Interaction**
- Speak in **English, Hindi (हिंदी), or Telugu (తెలుగు)**
- Voice transcription displayed in chat
- **Automatic audio response** for voice inputs
- Multi-language speech synthesis

#### ⌨️ **Text Chat**
- Type farming queries for instant AI answers
- Powered by **Google Gemini 2.5 Flash**
- Responses translated to selected language
- Optional audio playback (manual control)

#### 🖼️ **Image Analysis**
- Upload plant/crop photos for disease detection
- **Gemini Vision AI** powered analysis
- Treatment recommendations included
- Visual feedback with image preview

#### 🌦️ **Weather-aware Guidance**
- Optional “Local weather” button fetches live conditions via OpenWeather
- AgroBot blends temperature, humidity, wind, and rain signals into its prompt
- Advice dynamically adapts (irrigation, disease pressure, wind protection tips)

#### 🌐 **Modern UI/UX**
- **Landing page** with hero section and features
- Gemini-style **bottom toolbar** with all tools
- Language selector integrated in chat
- **Back button** to return to home
- Responsive design for all devices
- Smooth animations with Framer Motion

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│      React Frontend (Port 3000)         │
│  ┌───────────────────────────────────┐  │
│  │  Landing Page                     │  │
│  │  • Hero Section                   │  │
│  │  • Features Showcase              │  │
│  │  • CTA Buttons                    │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  Chat Interface (Gemini-style)    │  │
│  │  • Unified conversation view      │  │
│  │  • Voice/Text/Image tools         │  │
│  │  • Audio controls (pause/resume)  │  │
│  │  • Chat persistence (localStorage)│  │
│  │  • Language selector in toolbar   │  │
│  └───────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │
               │ REST API (HTTP/JSON)
               │
┌──────────────▼──────────────────────────┐
│      Flask Backend (Port 5000)          │
├─────────────────────────────────────────┤
│  /api/chat        → Google Gemini AI    │
│  /api/transcribe  → Groq Whisper STT    │
│  /api/tts         → gTTS + Translation  │
│  /api/analyze-image → Gemini Vision     │
└─────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **Google Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)
- **Groq API Key** - [Get it here](https://console.groq.com/keys)

### Installation

#### 1️⃣ Setup Environment

```bash
# Copy environment template
copy .env.example .env
```

Edit `.env` and add your API keys:
```env
GOOGLE_API_KEY=your_google_api_key_here
GROQ_API_KEY=your_groq_api_key_here
# Optional but recommended for weather-aware tips
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

#### 2️⃣ Install Dependencies

**Option A - All at once (Recommended):**
```bash
npm run setup
```

**Option B - Separately:**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node dependencies
npm run setup:frontend
```

#### 3️⃣ Run the Application

**Option A - Both servers together (Recommended):**
```bash
npm start
# or
npm run dev
```

**Option B - Run separately:**

Terminal 1 - Backend:
```bash
npm run backend
```
Backend will run on `http://localhost:5000`

Terminal 2 - Frontend:
```bash
npm run frontend
```
Frontend will run on `http://localhost:3000`

#### 4️⃣ Open in Browser

Navigate to **http://localhost:3000** and start using AgroBot! 🎉

#### ✅ Local Run Verification (Nov 17 2025)

The latest local dry-run followed these exact steps:

1. `npm run setup` — installed the root, frontend, and Python dependencies in one go.
2. `npm start` — launched Flask + Vite together. Since port 3000 was already taken, Vite automatically served the UI at `http://localhost:3001/` (this happens automatically when the default port is busy).
3. `curl http://localhost:5000/api/health` — confirmed the Flask backend was healthy and responding.
4. Opened `http://localhost:3001/` — interacted with the React UI, which continued to proxy API calls to `http://localhost:5000`.

If you prefer separate terminals, you can still run `npm run backend` and `npm run frontend`, but the one-command workflow above mirrors the verified setup.

#### 🌦️ Local Weather Snapshot

1. Generate an API key at [OpenWeather](https://openweathermap.org/api) and add it to `.env`.
2. Start AgroBot and open the chat screen.
3. Click **Local weather**. Your browser will ask for location permission.
4. The latest field context appears at the top of the chat, and every new AI response automatically tailors recommendations using that snapshot.
5. Click **Clear** on the banner if you want to revert to general advice.

---

## 📦 NPM Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Install all dependencies (frontend + backend) |
| `npm start` or `npm run dev` | Start both backend and frontend servers |
| `npm run backend` | Start only Flask backend (port 5000) |
| `npm run frontend` | Start only React frontend (port 3000) |
| `npm run build` | Build frontend for production |
| `npm run check` | Validate setup configuration |

## 📁 Project Structure

```
practice/
│
├── 📁 backend/                # Python/Flask Backend
│   ├── backend_api.py             # Flask REST API server (MAIN)
│   ├── agrobot_chat.py            # Gemini chat logic
│   ├── universal_stt.py           # Groq Whisper STT
│   ├── tts_engine.py              # gTTS + translation
│   └── image.py                   # Image analysis module
│
├── 📁 frontend/               # React Application
│   ├── src/
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   ├── index.css              # Tailwind styles
│   │   └── components/
│   │       ├── Header.jsx             # App header with language selector
│   │       ├── TabNavigation.jsx      # Tab switcher
│   │       ├── VoiceMode.jsx          # Voice recording & STT
│   │       ├── TextMode.jsx           # Text chat interface
│   │       ├── ImageAnalysis.jsx      # Image upload & analysis
│   │       └── Footer.jsx             # Footer with info
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📁 docs/                   # Documentation
│   ├── QUICKSTART.md              # Quick setup guide for expo
│   ├── PRESENTATION_GUIDE.md      # Full presentation guide
│   ├── COMMANDS.md                # Command reference
│   └── PROJECT_SUMMARY.md         # Project overview
│
├── 📁 scripts/                # Setup & Automation
│   ├── setup.bat                  # One-click setup
│   ├── start.bat                  # One-click start
│   └── check_setup.py             # Pre-flight validation
│
├── 📄 Configuration
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # API keys (create from .env.example)
│   ├── .env.example               # Environment template
│   └── .gitignore                 # Git ignore rules
│
└── README.md                  # This file
```

## 🎨 Design Theme

AgroBot uses a **modern agricultural theme** with:

- **Primary Colors**: Green shades (🌿 #22c55e) representing growth and nature
- **Secondary Colors**: Earth tones (🌾 #bfa094) for warmth
- **Typography**: Inter font family for clarity
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile-first design approach

## 🔌 API Endpoints

### Backend REST API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/chat` | POST | Get farming advice |
| `/api/transcribe` | POST | Convert speech to text |
| `/api/tts` | POST | Convert text to speech |
| `/api/analyze-image` | POST | Analyze plant disease |

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Flask** - Web framework
- **Google Gemini** - AI chat & vision
- **Groq Whisper** - Speech-to-text
- **gTTS** - Text-to-speech
- **Deep Translator** - Multi-language support
- **Pillow** - Image processing

## 🌍 Supported Languages

- 🇬🇧 **English** (en)
- 🇮🇳 **Hindi** (hi - हिंदी)
- 🇮🇳 **Telugu** (te - తెలుగు)

## 📸 Screenshots

*Perfect for your project expo presentation!*

### Voice Mode
- Real-time audio recording with visual feedback
- Automatic transcription and AI response
- Voice playback in selected language

### Text Mode
- Clean, chat-like interface
- Example questions for quick start
- Instant AI responses with audio

### Image Analysis
- Drag-and-drop image upload
- Disease detection and identification
- Organic treatment recommendations

## 🎯 Use Cases

1. **Crop Management** - Get advice on planting, watering, and harvesting
2. **Disease Detection** - Identify plant diseases from photos
3. **Pest Control** - Learn organic and chemical pest management
4. **Soil Health** - Understand soil improvement techniques
5. **Irrigation Planning** - Optimize water usage

## 🔒 Security

- API keys stored in `.env` (not in version control)
- CORS enabled for frontend communication
- Input validation on all endpoints
- File size limits for uploads

## 🚀 Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Files in frontend/dist/
```

**Backend:**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 backend_api:app
```

### Deployment Options
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Heroku, Railway, or AWS EC2
- **Full Stack**: DigitalOcean, Render, or Docker

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

This project is for educational and demonstration purposes.

## 👨‍💻 Author

Built with 💚 for farmers and agriculture enthusiasts

---

<div align="center">
  <strong>⭐ Star this repo if you find it useful!</strong>
</div>
