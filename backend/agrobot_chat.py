# agrobot_chat.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Create chat model
model = genai.GenerativeModel("gemini-2.5-flash")
chat = model.start_chat(history=[])

system_prompt = """
You are a friendly AI farming assistant who talks with farmers in a simple and natural way.
IMPORTANT: Always respond in ENGLISH only, regardless of the language of the question.
Always give short, clear, and direct answers using plain everyday words in English.
Avoid asking questions back unless it is absolutely necessary to give a correct answer.
Speak in a natural, human-like tone that sounds good when spoken aloud.
Do not use markdown, lists, or any formatting.
Keep replies brief and conversational, as if chatting with a farmer face to face.

Only talk about farming, crops, soil, irrigation, fertilizers, pests, livestock, 
or related topics. If the question is not about farming, politely say that you only talk about farming.

Remember: Your response must be in ENGLISH. The translation to other languages will happen separately.
"""





def get_agro_response(user_input: str) -> str:
    """
    Takes user query as input, returns agriculture advice text.
    """
    prompt = f"{system_prompt}\n\nUser question: {user_input}"

    if not user_input.strip():
        return "Please enter a valid question."

    
    response = chat.send_message(prompt)
    return response.text.strip()
