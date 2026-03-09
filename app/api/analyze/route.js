import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a senior technical recruiter with 15+ years of experience. You're known for your brutal honesty and strategic insight. Scan the provided profile text and return ONLY valid JSON in this exact structure:
{
  "firstImpression": "A 2-3 sentence gut reaction.",
  "clearElements": ["3-5 clear things"],
  "confusingElements": ["2-4 confusing things"],
  "perceivedTarget": "The role/level this person APPEARS to be targeting",
  "skipTriggers": ["2-4 dealbreakers"],
  "positioning": [
    {"issue": "Problem", "fix": "Recommendation"}
  ],
  "overallGrade": "A/B/C/D/F",
  "oneLineSummary": "One sharp sentence on what they need most"
}`;

export async function POST(request) {
  try {
    const { profileText } = await request.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: 'Analyze this LinkedIn profile:\n\n' + profileText }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API Error:', errorData);
      return NextResponse.json({ error: 'Analysis service unavailable' }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content[0].text;
    const result = JSON.parse(text.replace(/```json|```/g, '').trim());
    return NextResponse.json(result);
  } catch (err) {
    console.error('Analysis error:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
