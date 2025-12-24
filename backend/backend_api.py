# -*- coding: utf-8 -*-
"""
AgroBot Flask Backend API
--------------------------
RESTful API for React frontend integration
Endpoints: /chat, /transcribe, /analyze-image, /tts
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from agrobot_chat import get_agro_response
from tts_engine import text_to_speech
from universal_stt import transcribe_audio_groq
from weather_service import fetch_weather_summary, WeatherServiceError
import google.generativeai as genai
from PIL import Image
import tempfile
import os
from dotenv import load_dotenv
import base64
from io import BytesIO

# Load environment variables
load_dotenv()

# Helper function for safe printing on Windows console
def safe_print(message):
    """Print message safely, handling Unicode encoding errors on Windows"""
    try:
        print(message)
    except UnicodeEncodeError:
        # Fallback: print ASCII-safe version
        safe_message = message.encode('ascii', errors='ignore').decode('ascii')
        if safe_message.strip():
            print(safe_message)
        else:
            print("[Output contains non-ASCII characters]")

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configure Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# -------------------------------------------------------
# 💬 CHAT ENDPOINT
# -------------------------------------------------------
@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Text-based farming query endpoint
    Body: {"message": "farming question"}
    Returns: {"response": "AI response"}
    """
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({"error": "Message is required"}), 400
        
        weather_context = data.get('weatherContext')
        response = get_agro_response(user_message, weather_context=weather_context)
        
        # Debug: Check what language the AI is responding in
        safe_print(f"[CHAT] User message: {user_message[:50]}...")
        safe_print(f"[CHAT] AI response (first 100 chars): {response[:100]}...")
        
        return jsonify({"response": response})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------------------------------
# 🌦 WEATHER SNAPSHOT ENDPOINT
# -------------------------------------------------------
@app.route('/api/weather', methods=['GET'])
def weather():
    """
    Fetch localized weather/soil conditions using OpenWeather.
    Query params:
      - lat & lon (preferred)
      - or city (fallback)
    """
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        city = request.args.get('city')

        if not (lat and lon) and not city:
            return jsonify({"error": "Provide latitude/longitude or a city name"}), 400

        summary = fetch_weather_summary(lat=lat, lon=lon, city=city)
        safe_print(f"[WEATHER] Context ready for {summary['details']['location']}")
        return jsonify(summary)

    except WeatherServiceError as exc:
        safe_print(f"[WEATHER ERROR] {str(exc)}")
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        safe_print(f"[WEATHER ERROR] Unexpected failure: {str(exc)}")
        return jsonify({"error": "Failed to fetch weather data"}), 500


# -------------------------------------------------------
# SPEECH-TO-TEXT ENDPOINT
# -------------------------------------------------------
@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    """
    Transcribe audio to text using Groq Whisper
    Body: FormData with 'audio' file and 'language' field
    Returns: {"text": "transcribed text", "language": "lang_code"}
    """
    try:
        if 'audio' not in request.files:
            return jsonify({"error": "Audio file is required"}), 400
        
        audio_file = request.files['audio']
        language = request.form.get('language', 'en')
        
        safe_print(f"[API] Received audio file: {audio_file.filename}, language: {language}")
        
        # Read audio bytes
        audio_bytes = audio_file.read()
        safe_print(f"[API] Audio size: {len(audio_bytes)} bytes")
        
        if len(audio_bytes) == 0:
            return jsonify({"error": "Audio file is empty"}), 400
        
        # Transcribe
        result = transcribe_audio_groq(audio_bytes, lang=language)
        
        if not result or not result.get("original_text"):
            return jsonify({"error": "Transcription returned empty result"}), 500
        
        safe_print(f"[API] Transcription successful: {result['original_text'][:50]}...")
        
        return jsonify({
            "text": result["original_text"],
            "language": result["language_used"]
        })
    
    except Exception as e:
        safe_print(f"[API ERROR] Transcription failed: {str(e)}")
        import traceback
        try:
            traceback.print_exc()
        except UnicodeEncodeError:
            safe_print("[API ERROR] Stack trace contains non-ASCII characters")
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------
# 🔊 TEXT-TO-SPEECH ENDPOINT
# -------------------------------------------------------
@app.route('/api/tts', methods=['POST'])
def tts():
    """
    Convert text to speech and return both audio and translated text
    Body: {"text": "text to speak", "language": "en"}
    Returns: {"audio": "base64", "translated_text": "text in target language"}
    """
    try:
        data = request.json
        text = data.get('text', '').strip()
        language = data.get('language', 'en')
        
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        # Generate unique filename
        filename = f"speech_{os.urandom(4).hex()}.mp3"
        
        # Get translated text from TTS function
        result = text_to_speech(text, lang_code=language, filename=filename)
        
        if result and len(result) == 3:  # Returns (filename, audio_bytes, translated_text)
            _, audio_bytes, translated_text = result
            
            if audio_bytes:
                # Return audio as base64 and translated text
                audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
                return jsonify({
                    "audio": audio_base64,
                    "translated_text": translated_text,
                    "format": "mp3"
                })
        
        return jsonify({"error": "Failed to generate audio"}), 500
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------
# 🖼 IMAGE ANALYSIS ENDPOINT
# -------------------------------------------------------
@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    """
    Analyze plant disease from uploaded image
    Body: FormData with 'image' file
    Returns: {"analysis": "AI analysis text"}
    """
    try:
        if 'image' not in request.files:
            return jsonify({"error": "Image file is required"}), 400
        
        image_file = request.files['image']
        
        # Save temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            image_file.save(tmp.name)
            tmp_path = tmp.name
        
        # Open image
        image = Image.open(tmp_path)
        
        # Analyze with Gemini
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        prompt = """
        Analyze the uploaded plant image.
        Identify the plant name, disease name, and the level of infection (mild, medium, or severe).
        Give a short, simple, and friendly reply using plain everyday words that sound natural when spoken aloud.
        Explain the problem in one short line and give an organic solution only — no chemical fertilizers unless the user asks for chemical treatment.
        Keep the answer short, crisp, and clear so a farmer can understand it easily.
        Write the response with no symbols or markdown. Keep it plain text.
        """
        
        response = model.generate_content([prompt, image])
        analysis = getattr(response, "text", str(response))
        
        # Clean up
        os.unlink(tmp_path)
        
        return jsonify({"analysis": analysis})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------
# 🏥 HEALTH CHECK
# -------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "AgroBot API",
        "version": "1.0.0"
    })


# -------------------------------------------------------
# RUN SERVER
# -------------------------------------------------------
if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    print(f"AgroBot API running on http://localhost:{port}")
    app.run(debug=False, host='0.0.0.0', port=port)
