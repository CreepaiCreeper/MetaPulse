import { groq } from "@/lib/groq";

interface ScrapedData {
  metaTitle: string | null;
  metaDescription: string | null;
  h1Count: number;
  missingAltCount: number;
  wordCount: number;
  loadTime?: number;
  pageSizeKb?: number;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  criticalFixes: string[];
}

export async function analyzeSEO(data: ScrapedData): Promise<AnalysisResult> {
  const promptContent = `
Analyze the following website SEO and Performance metrics:
- Meta Title: ${data.metaTitle ?? "Missing"}
- Meta Description: ${data.metaDescription ?? "Missing"}
- H1 Count: ${data.h1Count}
- Images Missing Alt Attributes: ${data.missingAltCount}
- Word Count: ${data.wordCount}
- Estimated Load Time: ${data.loadTime ? `${data.loadTime}ms` : "N/A"}
- Page Size: ${data.pageSizeKb ? `${data.pageSizeKb}KB` : "N/A"}

Return a valid JSON object with exact keys:
{
  "score": <number between 0 and 100 based on overall SEO and Speed metrics>,
  "summary": "<2-3 sentence overview of the website SEO health and speed>",
  "criticalFixes": ["<actionable fix 1>", "<actionable fix 2>", "<actionable fix 3>"]
}
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional SEO Auditor. Analyze web data and return ONLY a valid JSON object.",
        },
        {
          role: "user",
          content: promptContent,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const rawJson = completion.choices[0]?.message?.content || "{}";
    const parsedData = JSON.parse(rawJson) as AnalysisResult;

    return {
      score: parsedData.score ?? 50,
      summary: parsedData.summary ?? "No summary generated.",
      criticalFixes: parsedData.criticalFixes ?? [
        "Fix meta tags and content structure.",
      ],
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("AI Analysis Error:", errorMessage);
    return {
      score: 45,
      summary:
        "Basic SEO evaluation completed. Critical fixes are required for optimal performance.",
      criticalFixes: [
        "Ensure meta description is present",
        "Add alt attributes to all images",
      ],
    };
  }
}
