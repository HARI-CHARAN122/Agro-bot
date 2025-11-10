# 🚀 AgroBot Setup Guide

Complete installation and configuration guide for AgroBot AI Farming Assistant.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Setup](#quick-setup)
3. [Detailed Setup](#detailed-setup)
4. [Configuration](#configuration)
5. [Troubleshooting](#troubleshooting)
6. [Verification](#verification)

---

## Prerequisites

### Required Software

#### 1. **Node.js & npm**
- **Version**: Node.js 18+ recommended
- **Download**: [nodejs.org](https://nodejs.org/)
- **Verify Installation**:
  ```bash
  node --version  # Should show v18.x or higher
  npm --version   # Should show 9.x or higher
  ```

#### 2. **Python**
- **Version**: Python 3.9 or higher
- **Download**: [python.org](https://www.python.org/downloads/)
- **Verify Installation**:
  ```bash
  python --version  # Should show 3.9.x or higher
  pip --version     # Should show pip version
  ```

#### 3. **Git** (Optional)
- **Download**: [git-scm.com](https://git-scm.com/)
- Required if cloning from repository

### Required API Keys

#### 1. **Google Gemini API Key**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"**
4. Create a new API key
5. Copy and save it securely

**Features:**
- Chat responses (Gemini 2.5 Flash)
- Image analysis (Gemini Vision)

#### 2. **Groq API Key**
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up / Sign in
3. Navigate to **"API Keys"**
4. Click **"Create API Key"**
5. Copy and save it securely

**Features:**
- Speech-to-text (Whisper)

---

## Quick Setup

### ⚡ One-Command Setup

```bash
# 1. Clone or download the project
git clone <repository-url>
cd practice

# 2. Copy environment template
copy .env.example .env

# 3. Edit .env and add your API keys
# (Use any text editor)

# 4. Install all dependencies
npm run setup

# 5. Start the application
npm start
```

**That's it!** 🎉 Your app will be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Detailed Setup

### Step 1: Get the Project

#### Option A: Clone from Git
```bash
git clone https://github.com/kanduri-adithya/agrobot.git
cd agrobot
```

#### Option B: Download ZIP
1. Download the project ZIP file
2. Extract to desired location
3. Open terminal in the extracted folder

#### Option C: Initialize Git in Existing Project
```bash
# If you already have the project files
git init
git remote add origin https://github.com/kanduri-adithya/agrobot.git
git branch -M main
git pull origin main
```

### Step 2: Environment Configuration

#### Create `.env` file

**Windows (Command Prompt):**
```cmd
copy .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Linux/Mac:**
```bash
cp .env.example .env
```

#### Edit `.env` file

Open `.env` in any text editor and add your API keys:

```env
# Google Gemini API Key (REQUIRED)
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Groq API Key (REQUIRED)
GROQ_API_KEY=gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ Important:**
- Replace the placeholder values with your actual API keys
- Do NOT share your `.env` file publicly
- Do NOT commit `.env` to Git (already in `.gitignore`)

### Step 3: Install Dependencies

#### Option A: Install Everything (Recommended)

```bash
npm run setup
```

This command will:
1. Install frontend Node.js dependencies
2. Install backend Python dependencies

#### Option B: Install Separately

**Backend (Python):**
```bash
pip install -r requirements.txt
```

**Frontend (Node.js):**
```bash
cd frontend
npm install
cd ..
```

### Step 4: Start the Application

#### Option A: Start Both Servers (Recommended)

```bash
npm start
```

or

```bash
npm run dev
```

This starts both backend and frontend concurrently.

#### Option B: Start Separately

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

### Step 5: Open in Browser

Navigate to **http://localhost:3000**

You should see the AgroBot landing page! 🌾

---

## Configuration

### Backend Configuration

#### Port Configuration
Default: **5000**

To change, edit `backend/backend_api.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  # Change port here
```

#### CORS Configuration
Default: Frontend origin allowed

To modify, edit `backend/backend_api.py`:
```python
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
```

#### Audio File Storage
Default: `backend/temp/`

Temporary TTS audio files are stored here and cleaned automatically.

### Frontend Configuration

#### Port Configuration
Default: **3000**

To change, edit `frontend/vite.config.js`:
```javascript
export default {
  server: {
    port: 3000  // Change port here
  }
}
```

#### API Proxy
Default: Proxies `/api` to `http://localhost:5000`

To modify, edit `frontend/vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:5000'  // Change backend URL here
  }
}
```

#### Environment Variables
Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000
```

---

## Troubleshooting

### Common Issues

#### 1. **Module Not Found Errors**

**Problem:** `ModuleNotFoundError` or `Cannot find module`

**Solution:**
```bash
# For Python
pip install -r requirements.txt

# For Node.js
cd frontend
npm install
```

#### 2. **Port Already in Use**

**Problem:** `Port 3000/5000 is already in use`

**Solution:**
- Kill the process using the port
- Or change the port in configuration (see above)

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:5000 | xargs kill -9
```

#### 3. **API Key Errors**

**Problem:** `Invalid API key` or `Unauthorized`

**Solution:**
- Verify API keys in `.env` file
- Ensure no extra spaces or quotes
- Check if keys are active on respective platforms

#### 4. **CORS Errors**

**Problem:** `CORS policy blocked`

**Solution:**
- Ensure backend is running on port 5000
- Check CORS configuration in `backend_api.py`
- Restart backend server

#### 5. **Groq Audio Errors**

**Problem:** `AttributeError: 'Audio' object has no attribute 'transcriptions'`

**Solution:**
```bash
# Downgrade to groq 0.9.0
pip uninstall groq
pip install groq==0.9.0
```

#### 6. **Unicode Console Errors (Windows)**

**Problem:** `UnicodeEncodeError` in console

**Solution:**
Already handled in code with `safe_print()` wrapper. If issues persist:
```cmd
chcp 65001  # Change console to UTF-8
```

#### 7. **Build Errors**

**Problem:** Frontend build fails

**Solution:**
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

---

## Verification

### Run Setup Check

```bash
npm run check
```

This verifies:
- Python installation
- Node.js installation
- Required dependencies
- Environment variables
- API key presence

### Manual Verification

#### 1. **Backend Health Check**
```bash
curl http://localhost:5000/api/health
```

Expected response: `{"status": "healthy"}`

#### 2. **Frontend Access**
Open browser: http://localhost:3000

You should see:
- ✅ Landing page loads
- ✅ "Start Chatting Now" button visible
- ✅ No console errors

#### 3. **Test Chat**
1. Click "Start Chatting Now"
2. Type: "What is farming?"
3. Should receive AI response

#### 4. **Test Voice**
1. Click microphone button
2. Speak a question
3. Should see transcription and response

#### 5. **Test Image**
1. Click image upload button
2. Upload a plant photo
3. Should receive analysis

---

## System Requirements

### Minimum

- **OS**: Windows 10, macOS 10.15, Ubuntu 20.04
- **RAM**: 4 GB
- **Storage**: 2 GB free space
- **Internet**: Required for API calls

### Recommended

- **OS**: Windows 11, macOS 12+, Ubuntu 22.04
- **RAM**: 8 GB
- **Storage**: 5 GB free space
- **Internet**: Broadband connection

---

## Next Steps

After successful setup:

1. **Explore Features** - Try voice, text, and image modes
2. **Read Documentation** - Check `/docs` folder
3. **Customize** - Modify colors, themes, languages
4. **Deploy** - Follow deployment guide for production

---

## Getting Help

### Resources

- **Documentation**: Check `/docs` folder
- **README**: See main `README.md`
- **Issues**: Check GitHub issues (if applicable)

### Support Checklist

Before asking for help:

1. ✅ Verified all prerequisites installed
2. ✅ API keys correctly set in `.env`
3. ✅ Dependencies installed (`npm run setup`)
4. ✅ Both servers running
5. ✅ Checked console for errors
6. ✅ Tried troubleshooting steps above

---

## Quick Reference

### Essential Commands

```bash
# Setup
npm run setup           # Install all dependencies

# Development
npm start              # Start both servers
npm run backend        # Start backend only
npm run frontend       # Start frontend only

# Build
npm run build          # Build frontend for production

# Verification
npm run check          # Verify setup
```

### Important Files

```
.env                   # API keys (DO NOT COMMIT)
requirements.txt       # Python dependencies
package.json          # Node.js dependencies
backend/backend_api.py # Backend entry point
frontend/src/App.jsx  # Frontend entry point
```

### Default URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Base**: http://localhost:5000/api

---

<div align="center">
  <h3>🎉 Setup Complete!</h3>
  <p>You're ready to use AgroBot AI Farming Assistant</p>
  <p><strong>Happy Farming! 🌾</strong></p>
</div>
