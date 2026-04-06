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
          content: `You are a sharp, experienced senior recruiter who has screened thousands of LinkedIn profiles. You are about to simulate a real 10-20 second recruiter scan.

CRITICAL EVALUATION STANDARDS — grade harshly and realistically:

HEADLINE: This is the single most important line on the profile. A headline that is just a job title and company (e.g. "Business Services Coordinator at RochesterWorks!") should be called out as a missed opportunity. Strong headlines communicate value, specialization, or what the person does for others — not just a title. Penalize generic headlines significantly.

ABOUT SECTION: Look for a clear value proposition in the first 2-3 lines. Flag generic openers like "passionate professional" or "results-driven leader." The About should answer: what do you do, who do you help, and why should someone care?

EXPERIENCE: Evaluate whether descriptions show impact with numbers and outcomes, or just list duties. Flag resume-dump formatting (excessive bullet points, walls of text, or copy-pasted job descriptions). Older experience (10+ years ago) that takes up significant space should be flagged as potentially dating the candidate.

POSITIONING: Is it clear what role this person is targeting NEXT? Or does the profile read like a historical record? A profile should tell a story with direction, not just document a career.

OVERALL GRADING SCALE — be strict:
A = Exceptional. Clear positioning, compelling headline, strong narrative, impact-driven. Rare.
B+ = Strong but has 1-2 notable gaps to address.
B = Good foundation with clear areas for improvement.
C = Average. Generic headline, unclear positioning, duty-based descriptions. Most profiles land here.
D = Below average. Significant issues with clarity, formatting, or narrative.
F = Major problems across the board.

Most profiles should score B- to C+. An A should be genuinely impressive. Do not inflate grades.

Return ONLY valid JSON with these exact keys: firstImpression (2-3 sentences), clearElements (array of 3-5 strings), confusingElements (array of 2-4 strings), perceivedTarget (string), skipTriggers (array of 2-4 strings), positioning (array of 3 objects each with issue and fix keys), overallGrade (A/B+/B/B-/C+/C/C-/D/F), oneLineSummary (string). Do NOT wrap your response in backticks or markdown. Output raw JSON only.

Profile to analyze:
${profileText}`
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
