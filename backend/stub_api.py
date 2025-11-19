from flask import Flask, request, jsonify, make_response
import base64

app = Flask(__name__)


@app.after_request
def add_cors_headers(response: 'flask.wrappers.Response'):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
    return response


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "AgroBot Stub API", "version": "stub-1.0"})


@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json or {}
    message = data.get('message', '')
    if not message:
        return jsonify({"error": "Message is required"}), 400
    # Provide a helpful, realistic response when user asks about tomato diseases
    lower = message.lower()
    if 'tomato' in lower:
        reply = (
            "Common tomato diseases: Early blight (Alternaria), Late blight (Phytophthora), "
            "Septoria leaf spot, Fusarium wilt, Verticillium wilt, Bacterial spot/speck, Tomato mosaic virus, "
            "Powdery mildew, and Blossom end rot (physiological).\n\n"
            "Short remedies: For fungal leaf spots (early/late blight, Septoria): remove infected leaves, improve air flow, "
            "avoid overhead watering, rotate crops, and use organic fungicides like copper or neem if needed.\n\n"
            "For wilts (Fusarium/Verticillium): plant resistant varieties, solarize soil if possible, remove severely infected plants, "
            "and avoid planting tomatoes in the same spot for several seasons.\n\n"
            "For bacterial diseases: remove and destroy infected plants, avoid working when plants are wet, use clean seed and tools.\n\n"
            "For blossom end rot: ensure even calcium in soil and consistent watering; mulch and avoid over-fertilizing.\n\n"
            "If you want, upload a clear photo of the affected plant and I can give a more specific diagnosis."
        )
        return jsonify({"response": reply})

    # Default echo-ish response
    reply = f"(stub) I received your message: {message[:200]}"
    return jsonify({"response": reply})


@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    # Return a fixed transcription for testing
    return jsonify({"text": "this is a stub transcription", "language": "en"})


@app.route('/api/tts', methods=['POST'])
def tts():
    data = request.json or {}
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "Text is required"}), 400
    # For the stub, return only translated text and no audio so frontend can use browser TTS
    return jsonify({"audio": None, "translated_text": text, "format": None})


@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    # Return a stub analysis
    return jsonify({"analysis": "(stub) Plant looks healthy. No disease detected."})


@app.route('/api/weather', methods=['GET'])
def weather():
    return jsonify({
        "context": "Local weather for demo farm: Clear sky, 30°C, humidity 55%, wind 8 km/h. Soil moisture is moderate, irrigate lightly tonight.",
        "details": {
            "location": "Demo Farm",
            "temperature": 30,
            "humidity": 55,
            "feels_like": 31,
            "pressure": 1008,
            "wind_speed": 8,
            "description": "Clear sky",
            "rain_mm": 0,
            "soil_moisture_hint": "Soil moisture is moderate, check before irrigating"
        }
    })


if __name__ == '__main__':
    print('Starting AgroBot stub API on http://localhost:5000')
    app.run(host='0.0.0.0', port=5000, debug=True)
