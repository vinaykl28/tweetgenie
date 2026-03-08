export interface BrandAnalysis {
  brandVoiceSummary: string[];
  contentPillars: string[];
  keyKeywords: string[];
  audienceResonance: string;
  tweets: {
    content: string;
    style: 'Engaging' | 'Promotional' | 'Witty' | 'Informative';
  }[];
}

export async function generateBrandTweets(data: {
  brandName?: string;
  industry?: string;
  objective: string;
  description: string;
  targetAudience?: string;
  tone?: string;
}): Promise<BrandAnalysis> {
  try {
    const response = await fetch('/api/analyze-brand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Failed to generate brand analysis');
    }

    return await response.json();
  } catch (e: any) {
    console.error("AI Service Error:", e);
    throw new Error(e.message || "Failed to generate brand analysis. Please check your connection.");
  }
}
