import express from "express";
import { createServer as createViteServer } from "vite";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to check configuration
  app.get("/api/config", (req, res) => {
    const groqApiKey = (process.env.GROQ_API_KEY || "").trim();
    res.json({ 
      hasGroq: !!groqApiKey
    });
  });

  // API Route for Brand Analysis
  app.post("/api/analyze-brand", async (req, res) => {
    const { brandName, industry, objective, description, targetAudience, tone } = req.body;

    const groqApiKey = (process.env.GROQ_API_KEY || "").trim();

    if (!groqApiKey) {
      return res.status(500).json({ 
        error: "Authentication Error", 
        message: "GROQ_API_KEY not found in environment variables." 
      });
    }

    const groq = new Groq({ apiKey: groqApiKey });
    
    const prompt = `
      Analyze the following brand details and generate a comprehensive brand strategy and 10 on-brand tweets.
      
      Brand Name: ${brandName || "Not specified"}
      Industry: ${industry || "Not specified"}
      Campaign Objective: ${objective}
      Product Description: ${description}
      Target Audience: ${targetAudience || "General audience"}
      Desired Tone: ${tone || "Balanced"}
      
      Respond ONLY with a valid JSON object matching this schema:
      {
        "brandVoiceSummary": ["bullet point 1", "bullet point 2"],
        "contentPillars": ["pillar 1", "pillar 2"],
        "keyKeywords": ["keyword1", "keyword2"],
        "audienceResonance": "A paragraph on audience resonance",
        "tweets": [
          { "content": "tweet text", "style": "Engaging" }
        ]
      }
      Generate exactly 10 tweets. Styles must be one of: "Engaging", "Promotional", "Witty", "Informative".
    `;

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are a professional brand strategist and social media expert. Always respond in valid JSON." },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error("No content from Groq");
      res.json(JSON.parse(content));
    } catch (error: any) {
      console.error("Groq API Error:", error);
      res.status(error.status || 500).json({ 
        error: "AI Service Error",
        message: error.message || "Unknown error occurred"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
