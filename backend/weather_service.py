import os
from typing import Optional, Dict, Any, Tuple

import httpx
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


class WeatherServiceError(Exception):
    """Raised when the weather service cannot fulfill the request."""


def _build_params(lat: Optional[str], lon: Optional[str], city: Optional[str]) -> Dict[str, Any]:
    if city:
        return {"q": city, "appid": OPENWEATHER_API_KEY, "units": "metric"}

    if lat is None or lon is None:
        raise WeatherServiceError("Latitude and longitude or a city name are required.")

    return {"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "metric"}


def _build_context(details: Dict[str, Any]) -> str:
    temperature = details["temperature"]
    humidity = details["humidity"]
    wind_speed = details["wind_speed"]
    description = details["description"]
    rain = details.get("rain_mm", 0)

    advice_parts = []

    if temperature < 18:
        advice_parts.append("conditions are cool, consider monitoring cold-sensitive crops")
    elif temperature > 32:
        advice_parts.append("heat stress likely, irrigate during early morning or evening")

    if humidity > 80:
        advice_parts.append("fungal pressure is high, keep foliage dry where possible")
    elif humidity < 30:
        advice_parts.append("air is dry, mulching helps retain soil moisture")

    if wind_speed > 30:
        advice_parts.append("strong winds expected, protect young plants and tunnels")

    if rain > 5:
        advice_parts.append("recent rain detected, delay irrigation to avoid waterlogging")

    advice_text = "; ".join(advice_parts) if advice_parts else "conditions look stable, follow your regular schedule"

    context = (
        f"Local weather for {details['location']}: {description}, "
        f"{temperature}°C, humidity {humidity}%, wind {wind_speed} km/h. "
        f"Soil moisture hint: {details['soil_moisture_hint']}. "
        f"Action: {advice_text}."
    )
    return context


def _extract_details(weather_json: Dict[str, Any]) -> Tuple[Dict[str, Any], str]:
    main = weather_json.get("main", {})
    wind = weather_json.get("wind", {})
    sys = weather_json.get("sys", {})
    weather_desc = (weather_json.get("weather") or [{}])[0]
    rain = weather_json.get("rain", {})

    details = {
        "location": f"{weather_json.get('name', 'your area')}, {sys.get('country', '')}".strip(", "),
        "temperature": round(main.get("temp", 0), 1),
        "humidity": main.get("humidity", 0),
        "feels_like": round(main.get("feels_like", 0), 1),
        "pressure": main.get("pressure", 0),
        "wind_speed": round(wind.get("speed", 0) * 3.6, 1),  # m/s to km/h
        "description": weather_desc.get("description", "").capitalize(),
        "rain_mm": round(rain.get("1h") or rain.get("3h") or 0, 1),
    }

    if details["rain_mm"] > 0:
        soil_hint = "Topsoil is moist from recent rain"
    elif details["temperature"] > 32 and details["humidity"] < 40:
        soil_hint = "Soil dries quickly in these hot, dry conditions"
    else:
        soil_hint = "Soil moisture is moderate, check before irrigating"

    details["soil_moisture_hint"] = soil_hint

    context = _build_context(details)
    return details, context


def fetch_weather_summary(lat: Optional[str] = None, lon: Optional[str] = None, city: Optional[str] = None) -> Dict[str, Any]:
    """
    Fetch weather data from OpenWeather and convert it into a concise summary.
    """
    if not OPENWEATHER_API_KEY:
        raise WeatherServiceError("OPENWEATHER_API_KEY is missing. Please add it to your .env file.")

    params = _build_params(lat, lon, city)

    try:
        response = httpx.get(OPENWEATHER_BASE_URL, params=params, timeout=10)
        response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        raise WeatherServiceError(f"Weather API error: {exc.response.text}") from exc
    except httpx.RequestError as exc:
        raise WeatherServiceError(f"Connection to weather service failed: {str(exc)}") from exc

    details, context = _extract_details(response.json())
    return {
        "context": context,
        "details": details,
    }

