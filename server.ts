import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Set up Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API routes FIRST
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { prompt, reports, vitals, nodes } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured. Please define it in Settings > Secrets.",
      });
    }

    // Summarize datasets to avoid exceeding token limits and keep it clean
    const reportsSummary = (reports || []).map((r: any) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      status: r.status,
      votes: r.votes,
      location: r.location,
      latitude: r.latitude,
      longitude: r.longitude,
      priority: r.priority,
      reportedAt: r.reportedAt,
    }));

    const vitalsSummary = (vitals || []).map((v: any) => ({
      name: v.name,
      value: v.value,
      unit: v.unit,
      status: v.status,
      category: v.category,
    }));

    const nodesSummary = (nodes || []).map((n: any) => ({
      name: n.name,
      type: n.type,
      status: n.status,
      metricName: n.metricName,
      metricValue: n.metricValue,
    }));

    const contextPrompt = `
You are the CityMind Decision Intelligence Core, a premium AI executive assistant built to analyze real-time municipal data and assist city leadership in urban management, policy, and dispatch coordination.

Here is the current state of the city:
1. Community Reports / Incidents:
${JSON.stringify(reportsSummary, null, 2)}

2. City Vitals (Key Performance Indicators):
${JSON.stringify(vitalsSummary, null, 2)}

3. Municipal Infrastructure Nodes:
${JSON.stringify(nodesSummary, null, 2)}

The user has submitted the following inquiry or scenario simulation request:
"${prompt}"

Using this context, analyze the issues and answer the query. You MUST respond with a structured JSON object complying with the following schema:
- executiveSummary: A highly polished, authoritative executive level synthesis of the situation and analytical findings (2-3 sentences).
- keyInsights: Array of 3-4 specific, data-backed insights or patterns/anomalies identified from the reports, location correlations, or priority levels.
- priorityRanking: Array of 3-5 items of concern (areas, incidents, or specific issues) ranked by priority. Each must have:
  * title: A title for the item.
  * category: The category (e.g., Mobility, Safety, Water, etc.).
  * location: Landmark or area of concern.
  * priorityScore: Numeric score (1-100) indicating urgency/severity.
  * reason: Specific diagnostic reason for this ranking.
- recommendedActions: Array of 3-4 concrete actions to execute immediately. Each must have:
  * action: Description of the action (e.g., dispatch crews, trigger batteries, route emergency response).
  * department: The responsible municipal department.
  * urgency: Urgency level ('Immediate', 'Scheduled', 'Routine').
- reasoning: Core technical and logical reasoning behind these recommendations, including any multi-system cross-dependencies (e.g., water leaks causing potential structural/traffic hazards).
- confidenceScore: Integer between 0 and 100 indicating the AI's confidence in this analysis.
- expectedCommunityImpact: A descriptive statement of the positive outcomes for citizens if the recommended actions are taken.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contextPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            keyInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            priorityRanking: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  location: { type: Type.STRING },
                  priorityScore: { type: Type.INTEGER },
                  reason: { type: Type.STRING },
                },
                required: ["title", "category", "location", "priorityScore", "reason"],
              },
            },
            recommendedActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  action: { type: Type.STRING },
                  department: { type: Type.STRING },
                  urgency: { type: Type.STRING },
                },
                required: ["action", "department", "urgency"],
              },
            },
            reasoning: { type: Type.STRING },
            confidenceScore: { type: Type.INTEGER },
            expectedCommunityImpact: { type: Type.STRING },
          },
          required: [
            "executiveSummary",
            "keyInsights",
            "priorityRanking",
            "recommendedActions",
            "reasoning",
            "confidenceScore",
            "expectedCommunityImpact",
          ],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response text from Gemini");
    }

    const data = JSON.parse(resultText.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Gemini Analyze Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze data via Gemini AI" });
  }
});

// Serve frontend build and dev middleware
async function startVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

startVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to start Vite middleware", err);
});
