import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a senior technical recruiter. Analyze the profile and return ONLY valid JSON in this structure:
{
  "firstImpression": "A 2-3 sentence gut reaction.",
  "clearElements": ["3-5 clear things"],
  "confusingElements": ["2-4 confusing things"],
  "perceivedTarget": "The role/level this person APPEARS to be targeting",
  "skipTriggers": ["2-4 dealbreakers"],
  "positioning": [{"issue": "Problem", "fix": "Recommendation"}],
  "overallGrade": "A/B/C/D/F",
  "oneLineSummary": "One sharp sentence on what they need most"
}`;

export async function POST(request) {
  try {
    const { profileText } = await request.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) return NextResponse.json({ error: 'No API Key' }, { status: 500 });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: 'Analyze this profile:\n\n' + profileText }],
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    const text = data.content[0].text;
    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
