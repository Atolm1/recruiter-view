import { NextResponse } from 'next/server';

let dailyCount = 0;
let lastReset = new Date().toDateString();
const DAILY_LIMIT = 50;

// Dan's Career Corner never uses em or en dashes. The prompt asks the
// model not to; this is the safety net for any that slip through.
// Number ranges keep a plain hyphen ("10-20"); any other dash becomes a
// comma.
function fixDashes(value) {
  return value
    .replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, '$1-$2')
    .replace(/\s*[\u2013\u2014]\s*/g, ', ')
    .replace(/^,\s*/, '')
    .replace(/,\s*([.,;:!?])/g, '$1');
}

function withoutDashes(value) {
  if (typeof value === 'string') return fixDashes(value);
  if (Array.isArray(value)) return value.map(withoutDashes);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withoutDashes(item)]));
  }
  return value;
}

export async function POST(request) {
  const today = new Date().toDateString();
  if (today !== lastReset) {
    dailyCount = 0;
    lastReset = today;
  }

  if (dailyCount >= DAILY_LIMIT) {
    return NextResponse.json({
      error: 'Daily scan limit reached. This free tool resets every 24 hours, so check back tomorrow!'
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
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: `You are a sharp, experienced senior recruiter who has screened thousands of LinkedIn profiles. You are about to simulate a real 10-20 second recruiter scan for someone who asked for honest feedback.

EVALUATION STANDARDS: grade honestly and realistically, and do not soften the grade.

HEADLINE: This is the single most important line on the profile. A headline that is just a job title and company (e.g. "Program Coordinator at Regional Health System") should be called out as a missed opportunity. Strong headlines communicate value, specialization, or what the person does for others, not just a title. Penalize generic headlines significantly.

ABOUT SECTION: Look for a clear value proposition in the first 2-3 lines. Flag generic openers like "passionate professional" or "results-driven leader." The About should answer: what do you do, who do you help, and why should someone care?

EXPERIENCE: Evaluate whether descriptions show impact with numbers and outcomes, or just list duties. Flag resume-dump formatting (excessive bullet points, walls of text, or copy-pasted job descriptions). Older experience (10+ years ago) that takes up significant space should be flagged as potentially dating the candidate.

POSITIONING: Is it clear what role this person is targeting NEXT? Or does the profile read like a historical record? A profile should tell a story with direction, not just document a career.

OVERALL GRADING SCALE (be strict):
A = Exceptional. Clear positioning, compelling headline, strong narrative, impact-driven. Rare.
B+ = Strong but has 1-2 notable gaps to address.
B = Good foundation with clear areas for improvement.
C = Average. Generic headline, unclear positioning, duty-based descriptions. Most profiles land here.
D = Below average. Significant issues with clarity, formatting, or narrative.
F = Major problems across the board.

Most profiles should score B- to C+. An A should be genuinely impressive. Do not inflate grades.

TONE: Be blunt about the profile and respectful to the person. Many people using this tool are between jobs, and the feedback is only useful if they can act on it.
- Critique what the text says or fails to say. Never guess at the person's effort, intelligence, skill with LinkedIn, or self-awareness.
- No insults, sarcasm, or mocking labels (for example "career-killing," "cliche," "invisible," "filler," "wall of buzzwords"). Say plainly what is missing and why it matters to a recruiter.
- Every criticism should point toward what to do instead.
- Write in plain, everyday English. Never use em dashes or en dashes; use commas, colons, or periods instead.

Return ONLY valid JSON with these exact keys: firstImpression (2-3 sentences), clearElements (array of 3-5 strings), confusingElements (array of 2-4 strings), perceivedTarget (string), skipTriggers (array of 2-4 strings), positioning (array of 3 objects each with issue and fix keys), overallGrade (A/B+/B/B-/C+/C/C-/D/F), oneLineSummary (one honest sentence that names the biggest gap and one thing that is already working). Do NOT wrap your response in backticks or markdown. Output raw JSON only.

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
    return NextResponse.json(withoutDashes(JSON.parse(text)));
  } catch (err) {
    console.error('Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
