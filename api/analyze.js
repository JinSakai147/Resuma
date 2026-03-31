export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const { text } = await req.json();
    
    // In production, Vercel provides this via its Dashboard settings.
    const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing Server API Key' }), { status: 500 });
    }

    const systemPrompt = `EXTRACT THE CANDIDATE'S REAL NAME FROM THE TOP OF THE RESUME TEXT. Analyze the resume text and return a strict JSON object with this EXACT structure (overallScore as a number, candidateName as the extracted string of their actual name, categoryScores as 4 objects with category string and score number, keywordDistribution as up to 5 objects with name and count number, strengths as string array, skillGaps as string array, jobRoleFits as string array, suggestions as object array with text and type, detailedRecommendations as string array of detailed paragraphs): 
{
  "candidateName": "John Doe",
  "overallScore": 85,
  "categoryScores": [
    { "category": "Impact", "score": 88, "fullMark": 100 },
    { "category": "Format", "score": 90, "fullMark": 100 },
    { "category": "Brevity", "score": 75, "fullMark": 100 },
    { "category": "Skills", "score": 95, "fullMark": 100 }
  ],
  "keywordDistribution": [
    { "name": "Management", "value": 3 }
  ],
  "strengths": ["Clear structure"],
  "skillGaps": ["Kubernetes", "AWS"],
  "jobRoleFits": ["Senior Software Engineer", "Tech Lead"],
  "suggestions": [
    { "text": "Add metrics", "type": "warning" }
  ],
  "detailedRecommendations": [
    "Your project section lacks measurable impact. Rewrite your experience bullets to quantify the scale of your work.",
    "Consider condensing the objective statement to focus specifically on your target role."
  ]
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please analyze this text exactly as instructed in JSON format: ${text.slice(0, 3000)}` }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: `Groq HTTP Error: ${errText}` }), { status: response.status });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
