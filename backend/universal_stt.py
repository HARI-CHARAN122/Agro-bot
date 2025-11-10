# -*- coding: utf-8 -*-
"""
Universal Speech-to-Text (Groq)
-------------------------------
Transcribes speech using Groq Whisper API.
"""

from groq import Groq
from dotenv import load_dotenv
import tempfile
import os

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

def transcribe_audio_groq(audio_bytes: bytes, lang: str = "en"):
    """Transcribe audio using Groq Whisper API"""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name
        
        with open(tmp_path, "rb") as audio_file:
            lang_names = {"en": "English", "hi": "Hindi", "te": "Telugu"}
            lang_name = lang_names.get(lang, lang)
            transcription = client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-large-v3-turbo",
                language=lang,
                prompt=f"Farming conversation in {lang_name}."
            )
        
        os.unlink(tmp_path)
        text = transcription.text.strip()
        print(f"[STT] Language: {lang}")
        try:
            print(f"[STT] Text: {text}")
        except UnicodeEncodeError:
            print(f"[STT] Done")
        return {"original_text": text, "language_used": lang}
    except Exception as e:
        try:
            print(f"[STT ERROR] {e}")
        except:
            print("[STT ERROR] Error occurred")
        return {"original_text": "", "language_used": lang}
