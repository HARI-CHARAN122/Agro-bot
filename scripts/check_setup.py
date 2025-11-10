#!/usr/bin/env python3
"""
Quick validation script to check if AgroBot is ready to run
"""
import os
import sys

def check_file(path, name):
    """Check if a file exists"""
    # Adjust path if running from scripts directory
    if not os.path.exists(path) and not path.startswith('..'):
        path = os.path.join('..', path)
    
    if os.path.exists(path):
        print(f"✓ {name} found")
        return True
    else:
        print(f"✗ {name} MISSING!")
        return False

def check_env_var(var_name):
    """Check if environment variable is set"""
    from dotenv import load_dotenv
    load_dotenv()
    
    value = os.getenv(var_name)
    if value and value != f"your_{var_name.lower()}_here":
        print(f"✓ {var_name} is set")
        return True
    else:
        print(f"✗ {var_name} NOT SET or using placeholder!")
        return False

def main():
    print("=" * 50)
    print("  AgroBot Pre-Flight Check")
    print("=" * 50)
    print()
    
    all_good = True
    
    # Check backend files
    print("📁 Checking Backend Files...")
    all_good &= check_file("backend/backend_api.py", "Backend API")
    all_good &= check_file("backend/agrobot_chat.py", "Chat Module")
    all_good &= check_file("backend/universal_stt.py", "STT Module")
    all_good &= check_file("backend/tts_engine.py", "TTS Module")
    all_good &= check_file("requirements.txt", "Requirements")
    print()
    
    # Check frontend files
    print("📁 Checking Frontend Files...")
    all_good &= check_file("frontend/package.json", "Package.json")
    all_good &= check_file("frontend/vite.config.js", "Vite Config")
    all_good &= check_file("frontend/src/App.jsx", "App Component")
    print()
    
    # Check environment
    print("🔑 Checking Environment Variables...")
    env_path = ".env" if os.path.exists(".env") else "../.env"
    if check_file(env_path, ".env file"):
        # Load from correct location
        from dotenv import load_dotenv
        load_dotenv(env_path)
        all_good &= check_env_var("GOOGLE_API_KEY")
        all_good &= check_env_var("GROQ_API_KEY")
    else:
        print("⚠️  Run: copy .env.example .env")
        print("⚠️  Then add your API keys to .env")
        all_good = False
    print()
    
    # Check Python packages
    print("📦 Checking Python Packages...")
    try:
        import flask
        print("✓ Flask installed")
    except ImportError:
        print("✗ Flask NOT installed - Run: pip install -r requirements.txt")
        all_good = False
    
    try:
        import google.generativeai
        print("✓ Google GenAI installed")
    except ImportError:
        print("✗ Google GenAI NOT installed - Run: pip install -r requirements.txt")
        all_good = False
    print()
    
    # Check Node modules
    print("📦 Checking Node Modules...")
    if os.path.exists("frontend/node_modules"):
        print("✓ Node modules installed")
    else:
        print("✗ Node modules NOT installed")
        print("  Run: cd frontend && npm install")
        all_good = False
    print()
    
    # Final verdict
    print("=" * 50)
    if all_good:
        print("✅ ALL CHECKS PASSED! Ready to launch! 🚀")
        print()
        print("Start the app with:")
        print("  1. cd scripts && start.bat")
        print("  OR manually:")
        print("     - python backend/backend_api.py")
        print("     - cd frontend && npm run dev")
        print("  2. Open http://localhost:3000")
    else:
        print("❌ SOME CHECKS FAILED - Please fix the issues above")
        print()
        print("Quick fix: Run setup.bat (Windows)")
    print("=" * 50)
    
    return 0 if all_good else 1

if __name__ == "__main__":
    sys.exit(main())
