import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getWeatherSummary, extractLocationFromText } from "./weatherController.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateReply(req, res) {
  try {
    const { prompt, location, units = "metric", systemPrompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // Figure out a location: body.location > extracted from prompt > none
    const inferredLocation = location || extractLocationFromText(prompt);
    const weatherBlock = await getWeatherSummary(inferredLocation, units);

    // A lightweight default system instruction if none provided
    const baseSystem =
      systemPrompt ||
      [
        "You are a friendly, proactive weather assistant.",
        "If the user's location is missing, ask for it and clarify preferred units (°C/°F).",
        "Use the current weather context (provided below) to:",
        "- Suggest practical activities and places to visit today (local outdoor/indoor options).",
        "- Recommend what to wear (layers, footwear) and extras to carry (umbrella, sunscreen, water, jacket, hat).",
        "- Advise good times of day (morning/afternoon/evening) based on temperature, wind, and precipitation.",
        "Guidelines:",
        "- Be concise and specific to the location and conditions.",
        "- Prefer bullet points with short sentences.",
        "- Avoid emojis unless the user asks for them.",
        "- If weather context is missing, ask for the location before giving advice.",
      ].join("\n");

    // Build full prompt with weather context if available
    const contextPart = weatherBlock
      ? `Weather context:\n${weatherBlock}\n\n`
      : "";
    const fullPrompt = `${baseSystem}\n\n${contextPart}User:\n${prompt}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(fullPrompt);

    res.json({
      reply: result.response.text(),
      meta: {
        usedLocation: inferredLocation || null,
        hasWeatherContext: Boolean(weatherBlock),
        units,
      },
    });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
