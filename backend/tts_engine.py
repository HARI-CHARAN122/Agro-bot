# -*- coding: utf-8 -*-
"""
TTS Engine for AgroBot
----------------------
Converts text responses to speech using gTTS.
Supports translation to Indian languages via Deep Translator.
Returns playable audio bytes for Streamlit + saves MP3 file locally.
"""

from gtts import gTTS
from deep_translator import GoogleTranslator
import os
import io

def text_to_speech(text: str, lang_code: str = "en", filename: str = "speech.mp3"):
    """
    Converts text into speech audio.
    Returns (filename, audio_bytes) for playback.
    """

    try:
        # Create temp directory if it doesn't exist
        temp_dir = os.path.join(os.path.dirname(__file__), 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        
        # Update filename to include temp directory path
        filename = os.path.join(temp_dir, os.path.basename(filename))
        
        # Validate input
        if not text or not text.strip():
            print("[TTS] No text provided for speech.")
            return None, None

        print(f"[TTS] Requested language: {lang_code}")
        print(f"[TTS] Original text (first 50 chars): {text[:50]}...")

        # Language mapping - ensure consistency
        # Map common codes to what GoogleTranslator and gTTS both support
        lang_map = {
            'en': 'en',  # English
            'hi': 'hi',  # Hindi
            'te': 'te',  # Telugu  
            'ta': 'ta',  # Tamil
            'mr': 'mr',  # Marathi
            'bn': 'bn',  # Bengali
            'gu': 'gu',  # Gujarati
        }
        
        # Get normalized language code
        normalized_lang = lang_map.get(lang_code.lower(), 'en')
        print(f"[TTS] Normalized language: {normalized_lang}")

        # Step 1: Translate text if needed
        translated_text = text
        if normalized_lang != "en":
            try:
                # Explicitly translate from English to target language
                print(f"[TTS] Translating from 'en' to '{normalized_lang}'...")
                translated_text = GoogleTranslator(source="en", target=normalized_lang).translate(text)
                # Use safe encoding for Windows console
                try:
                    print(f"[TTS] Translated to {normalized_lang}: {translated_text[:50]}...")
                except UnicodeEncodeError:
                    print(f"[TTS] Translation completed to {normalized_lang}")
            except Exception as e:
                try:
                    print(f"[TTS] Translation failed ({str(e)}), using original English text.")
                except UnicodeEncodeError:
                    print("[TTS] Translation failed, using original text.")
                # Keep original text and use English for TTS
                translated_text = text
                normalized_lang = "en"

        # Step 2: Generate TTS
        print(f"[TTS] Generating speech in language: {normalized_lang}")
        tts = gTTS(text=translated_text, lang=normalized_lang, slow=False)
        tts.save(filename)
        print(f"[TTS] Audio saved as '{filename}'")

        # Step 3: Return audio bytes and translated text for playback
        with open(filename, "rb") as f:
            audio_bytes = f.read()

        return filename, audio_bytes, translated_text

    except Exception as e:
        print(f"[TTS ERROR] Error in TTS: {e}")
        return None, None, None
