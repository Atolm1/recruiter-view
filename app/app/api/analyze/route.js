import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a senior technical recruiter with 15+ years of experience. Scan a profile in 10-20 seconds and form snap judgments. Be specific and psychologically sharp. Return ONLY valid JSON (no markdown, no backticks) in this structure:
{"firstImpression":"2-3 sentence gut reaction","clearElements":["3-5 clear things"],"confusingElements":["2-4 confusing things"],"perceivedTarget":"What role they appear to target","skipTriggers":["2-4 skip reasons"],"positioning":[{"issue":"problem","fix":"recommendation"},{"issue":"problem2","fix":"fix2"},{"issue":"problem3","fix":"fix3"}],"overallGrade":"A/B/C/D/F","oneLineSummary":"One sentence on what the profile needs most"}`;

export async function POST(request) {
  try {
    const { profileText } = await request.json();
    if (!profileText || profileText.trim().length === 0) {
      return NextResponse.json({ error: 'Profile text is required' }, { status: 400 });
    }
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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: 'Analyze this LinkedIn profile:\n\n' + profileText }],
      }),
    });
    if (!response.ok) {
      return NextResponse.json({ error: 'Analysis service unavailable' }, { status: 502 });
    }
    const data = await response.json();
    const text = data.content.map((b) => b.text || '').filter(Boolean).join('');
    return NextResponse.json(JSON.parse(text.replace(/```json|```/g, '').trim()));
  } catch (err) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
