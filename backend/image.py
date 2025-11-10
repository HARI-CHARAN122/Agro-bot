import sys
import google.generativeai as genai
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()

def analyze_image(image_path: str = "plant.jpg"):
    # Configure API key from environment variable
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

    # Initialize the Gemini model
    model = genai.GenerativeModel("gemini-2.5-flash")

    image = Image.open(image_path)

    # Prompt for the model
    prompt = """
    Analyze the uploaded plant image.
    Identify the plant name, disease name, and the level of infection (mild, medium, or severe).
    Give a short, simple, and friendly reply using plain everyday words that sound natural when spoken aloud.
    Explain the problem in one short line and give an organic solution only — no chemical fertilizers unless the user asks for chemical treatment.
    Keep the answer short, crisp, and clear so a farmer can understand it easily.
    Write the response with no symbols or markdown. Keep it plain text.
    
    """

    # Generate response
    response = model.generate_content([prompt, image])
    text = getattr(response, "text", str(response))

    print("\nGenerated text:\n")
    print(text)


if __name__ == "__main__":
    # Allow optional image path argument
    args = sys.argv[1:]
    image_path = args[0] if len(args) >= 1 else "plant.jpg"
    analyze_image(image_path)
