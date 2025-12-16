import axios from "axios"
import dotenv from "dotenv";
dotenv.config();

// Uses OpenWeatherMap Current Weather API
// Requires: OPENWEATHER_API_KEY in .env
export async function getWeatherSummary(location, units = "metric") {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey || !location) return null;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${apiKey}&units=${units}`;

    // Node 18+ has global fetch
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();

    const name = data.name ?? location;
    const weather = data.weather?.[0]?.description ?? "N/A";
    const temp = Math.round(data.main?.temp ?? 0);
    const feels = Math.round(data.main?.feels_like ?? temp);
    const humidity = data.main?.humidity ?? "N/A";
    const wind = Math.round((data.wind?.speed ?? 0) * 10) / 10;

    return `Location: ${name}
Conditions: ${weather}
Temperature: ${temp}°C (feels like ${feels}°C)
Humidity: ${humidity}%
Wind: ${wind} m/s`;
  } catch {
    return null;
  }
}

// naive extraction from free-text like "weather in Paris"
export function extractLocationFromText(text) {
  if (!text) return null;
  const match = text.match(/\b(?:in|at|for)\s+([A-Za-z][A-Za-z\s,'-]{1,40})$/i);
  if (match) return match[1].trim();
  // fallback: look for a single capitalized word (simple heuristic)
  const cap = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/);
  return cap ? cap[1] : null;
}

export const getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.query

    if (!city) {
      return res.status(400).json({ error: "City is required" })
    }

    const apiKey = process.env.OPENWEATHER_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`

    const response = await axios.get(url)
    const data = response.data

    const weather = {
      city: data.name,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      windSpeed: data.wind.speed,
    }

    res.json(weather)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: "Failed to fetch weather data" })
  }
}
