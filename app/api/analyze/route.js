import { NextResponse } from 'next/server';

let dailyCount = 0;
let lastReset = new Date().toDateString();
const DAILY_LIMIT = 50;

export async function POST(request) {
  const today = new Date().toDateString();
  if (today !== lastReset) {
    dailyCount = 0;
    lastReset = today;
  }

  if (dailyCount >= DAILY_LIMIT) {
    return NextResponse.json({
      error: 'Daily scan limit reached. This free tool resets every 24 hours — check back tomorrow!'
    }, { status: 429 });
  }

  try {
    const { profileText } = await request.json();
    if (!profileText) {
      return NextResponse.json({ error: 'No text' }, { status: 400 });
    }
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: 'You are a senior recruiter. Analyze this LinkedIn profile in 10-20 seconds like a real recruiter would. Return ONLY valid JSON with these exact keys: firstImpression (2-3 sentences), clearElements (array of 3-5 strings), confusingElements (array of 2-4 strings), perceivedTarget (string), skipTriggers (array of 2-4 strings), positioning (array of 3 objects each with issue and fix keys), overallGrade (A/B/C/D/F), oneLineSummary (string). Do NOT wrap your response in backticks or markdown. Output raw JSON only.\n\nProfile:\n' + profileText
        }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('API error:', res.status, err);
      return NextResponse.json({ error: 'API error: ' + res.status }, { status: 502 });
    }
    const data = await res.json();
    let text = data.content[0].text;
    text = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
      console.error('No JSON found in response:', text.substring(0, 200));
      return NextResponse.json({ error: 'Invalid response format' }, { status: 500 });
    }
    text = text.substring(start, end + 1);
    dailyCount++;
    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    console.error('Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
