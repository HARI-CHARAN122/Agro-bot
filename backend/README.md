# 🔧 Backend - AgroBot API Server# AgroBot Backend



Flask-based REST API providing AI-powered farming assistance.Flask REST API backend for the AgroBot farming assistant.



## 🚀 Quick Start## Files



```bash- **backend_api.py** - Main Flask application with REST endpoints

# From root- **agrobot_chat.py** - Gemini AI chat integration

npm run backend- **universal_stt.py** - Groq Whisper speech-to-text

- **tts_engine.py** - Text-to-speech with gTTS

# Or directly- **image.py** - Plant disease image analysis

cd backend

python backend_api.py## API Endpoints

```

### GET /api/health

Server: **http://localhost:5000**Health check endpoint



## 📁 Structure### POST /api/chat

Chat with AI for farming advice

``````json

backend/{

├── backend_api.py       # Main Flask server ⭐  "message": "How to grow tomatoes?"

├── agrobot_chat.py      # Gemini AI chat}

├── universal_stt.py     # Groq Whisper STT```

├── tts_engine.py        # gTTS + Translation

├── image.py             # Gemini Vision### POST /api/transcribe

└── temp/                # Temp audio filesTranscribe audio to text

```- Form data: `audio` (file), `language` (en/hi/te)



## 🔌 API Endpoints### POST /api/tts

Convert text to speech

### `/api/chat` (POST)```json

AI farming advice{

  "text": "Your text here",

```json  "language": "en"

Request: {"message": "How to plant tomatoes?"}}

Response: {"response": "To plant tomatoes..."}```

```

### POST /api/analyze-image

### `/api/transcribe` (POST)Analyze plant disease from image

Speech-to-text- Form data: `image` (file)



```## Running

FormData: {audio: file, language: "en|hi|te"}

Response: {"text": "transcribed text"}```bash

```python backend_api.py

```

### `/api/tts` (POST)

Text-to-speech + translationServer runs on http://localhost:5000



```json## Environment Variables

Request: {"text": "Hello", "language": "hi"}

Response: {"audio": "base64...", "translated_text": "नमस्ते", "format": "mp3"}Required in `.env`:

```- `GOOGLE_API_KEY` - Google Gemini API key

- `GROQ_API_KEY` - Groq API key

### `/api/analyze-image` (POST)- `PORT` - Server port (default: 5000)

Plant disease detection

```
FormData: {image: file}
Response: {"analysis": "...", "translated_analysis": "..."}
```

## 🛠️ Tech Stack

- Flask 3.0.0
- Google Gemini 2.5 Flash
- Groq 0.9.0 (Whisper)
- gTTS + Deep Translator
- Pillow

## 🔑 Environment

```env
GOOGLE_API_KEY=your_key
GROQ_API_KEY=your_key
```

## 📦 Dependencies

```bash
pip install -r requirements.txt
```

⚠️ **Important:** Use `groq==0.9.0` (not 0.11.0)

## 🚀 Production

```bash
gunicorn -w 4 -b 0.0.0.0:5000 backend_api:app
```

---

Made with ❤️ for farmers
