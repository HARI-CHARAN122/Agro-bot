# 🚀 Quick Start Guide - AgroBot

## For Project Expo Demo

### ⚡ Super Quick Start

1. **Install Dependencies** (First time only):
   ```bash
   npm run setup
   ```

2. **Start Application**:
   ```bash
   npm start
   ```

3. **Open Browser**: http://localhost:3000

---

## 📋 Detailed Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key
- Groq API Key

### Step 1: API Keys Setup

1. Copy environment template:
   ```cmd
   copy .env.example .env
   ```

2. Edit `.env` and add your keys:
   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. Get API keys:
   - Google Gemini: https://makersuite.google.com/app/apikey
   - Groq: https://console.groq.com/keys

### Step 2: Install Dependencies

**All at once:**
```bash
npm run setup
```

**Or separately:**
```bash
# Python dependencies
pip install -r requirements.txt

# Node dependencies
npm run setup:frontend
```

### Step 3: Run Application

**Option 1: Both servers together (Recommended)**
```bash
npm start
```

**Option 2: Separately**

Terminal 1 - Backend:
```bash
npm run backend
```

Terminal 2 - Frontend:
```bash
npm run frontend
```

Then open: http://localhost:3000

---

## 🎯 Demo Features to Showcase

### 1. Voice Mode 🎙
- Click microphone
- Ask: "How do I control tomato pests organically?"
- Watch transcription → AI response → audio playback

### 2. Text Mode ⌨️
- Type: "What are signs of nitrogen deficiency?"
- Get instant response with voice

### 3. Image Analysis 🖼
- Upload plant disease photo
- Get diagnosis + treatment
- Hear solution in your language

---

## 💡 Presentation Tips

### Start Strong
1. Begin with **Voice Mode** (most impressive!)
2. Show **Language Switching**
3. Demo **Image Analysis**
4. Highlight **Professional Design**

### Key Points to Mention
- ✓ Multi-modal interaction (voice, text, image)
- ✓ Multi-language support for Indian farmers
- ✓ Real AI integration (Gemini 2.5 Flash)
- ✓ Production-ready React application

---

## 🐛 Troubleshooting

### Check Configuration
```bash
npm run check
```

### Common Issues

**Port Already in Use:**
- Change PORT in `.env`
- Kill process:
  - Windows: `netstat -ano | findstr :5000`
  - Mac/Linux: `lsof -ti:5000 | xargs kill -9`

**Microphone Not Working:**
- Allow browser permissions
- Try Chrome browser
- Check browser settings

**API Errors:**
- Verify API keys in `.env`
- Check API quotas
- Test internet connection

**Dependencies Issues:**
```bash
npm run setup  # Reinstall all dependencies
```

---

## 📁 Project Structure

```
practice/
├── backend/           # Python/Flask backend
├── frontend/          # React application
├── docs/             # Documentation
├── scripts/          # Setup & start scripts
├── .env              # API keys (create from .env.example)
└── requirements.txt  # Python dependencies
```

---

## ✅ Pre-Demo Checklist

- [ ] Backend running (port 5000)
- [ ] Frontend running (port 3000)
- [ ] API keys configured
- [ ] Microphone permissions granted
- [ ] Sample plant images ready
- [ ] Tested all three modes
- [ ] Browser cache cleared
- [ ] Practiced demo flow

---

## 🏆 Good Luck!

Your AgroBot is ready to impress! 🌾

**Remember:**
- Practice beforehand
- Test all features
- Show confidence
- Highlight social impact

For detailed presentation guide, see: `docs/PRESENTATION_GUIDE.md`
