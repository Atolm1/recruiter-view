'use client';
import { useEffect, useRef, useState } from 'react';
import CareerIntelSignup from '../components/CareerIntelSignup';
import ScanResults from '../components/ScanResults';
import { AlertIcon } from '../components/Icons';
import { trackEvent } from '../lib/analytics';
import { TOOL_ID } from '../lib/site';

const PLACEHOLDER = `Headline: Program Coordinator | Community health | Open to operations roles

About: I keep programs running smoothly for the people who depend on them...

Experience:
Program Coordinator, Regional health system, 2021 to present
- Scheduled and staffed 40 community events a year...`;

const WHAT_YOU_GET = [
  { title: 'A quick first pass', body: 'How your profile reads in the first 10 to 20 seconds.' },
  { title: 'Your apparent target', body: 'The role a recruiter would think you are going for.' },
  { title: 'What to fix', body: 'What might make a recruiter move on, and what to change.' },
];

export default function Home() {
  const [profileText, setProfileText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const resultsHeadingRef = useRef(null);
  const inputRef = useRef(null);

  const words = profileText.split(/\s+/).filter(Boolean).length;

  useEffect(() => () => clearInterval(timerRef.current), []);

  // Results replace the form, so move focus to their heading; after
  // "Scan another profile," send it back to the empty field.
  useEffect(() => {
    if (result) resultsHeadingRef.current?.focus();
  }, [result]);

  async function analyze(event) {
    event.preventDefault();
    if (loading) return;
    if (!profileText.trim()) {
      setError('Paste your profile text into the box first.');
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    setError('');
    setAnnouncement('Scanning your profile. This takes about 10 seconds.');
    setElapsed(0);
    const started = Date.now();
    timerRef.current = setInterval(() => setElapsed(Date.now() - started), 100);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileText }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'The scan didn’t finish. Please try again.');
      setElapsed(Date.now() - started);
      setResult(data);
      setAnnouncement(`Scan finished. Your grade is ${data.overallGrade}.`);
      trackEvent('tool_completed', { tool: TOOL_ID });
    } catch (err) {
      setError(err.message || 'The scan didn’t finish. Please try again.');
      setAnnouncement('');
    } finally {
      clearInterval(timerRef.current);
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setProfileText('');
    setError('');
    setAnnouncement('');
    setElapsed(0);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="container">
      <section className="intro" aria-labelledby="page-title">
        <p className="label-rule">Free tool</p>
        <h1 id="page-title" className="page-title">
          Recruiter View Simulator
        </h1>
        <p className="lead">
          Paste in your LinkedIn headline, About section, and recent roles to see how they might read
          to a recruiter in a quick first pass, with specific fixes to make.
        </p>
        <div className="notes small muted">
          <p>Free. No sign-up required. Fair warning: it&rsquo;s blunt. That&rsquo;s the point.</p>
          <p>What you paste is sent to an AI service to create your scan. The simulator doesn&rsquo;t store it.</p>
        </div>
      </section>

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      {!result ? (
        <>
          <form className="scan-form" onSubmit={analyze} noValidate>
            <label htmlFor="profile-text" className="field-label">
              Your profile text
            </label>
            <p id="profile-hint" className="field-hint small muted">
              Copy your headline, your About section, and your two or three most recent roles. Plain
              text is fine.
            </p>
            <textarea
              id="profile-text"
              ref={inputRef}
              className="profile-input"
              value={profileText}
              onChange={(event) => setProfileText(event.target.value)}
              placeholder={PLACEHOLDER}
              readOnly={loading}
              aria-describedby={error ? 'profile-hint scan-error' : 'profile-hint'}
              aria-invalid={error && !profileText.trim() ? true : undefined}
            />
            <div className="form-row">
              <p className="status-line" aria-hidden="true">
                {loading ? (
                  <>
                    <span className="spinner" />
                    Scanning, {(elapsed / 1000).toFixed(1)}s
                  </>
                ) : words > 0 ? (
                  `${words} words`
                ) : null}
              </p>
              <button type="submit" className="button button-primary button-wide-mobile" aria-disabled={loading}>
                {loading ? 'Scanning your profile…' : 'Run the scan'}
              </button>
            </div>
            {error ? (
              <p id="scan-error" className="message message-error" role="alert">
                <AlertIcon />
                <span>{error}</span>
              </p>
            ) : null}
          </form>

          <ul className="features">
            {WHAT_YOU_GET.map((item) => (
              <li key={item.title}>
                <h2>{item.title}</h2>
                <p className="small muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <ScanResults result={result} elapsed={elapsed} headingRef={resultsHeadingRef} onReset={reset} />
          <CareerIntelSignup />
        </>
      )}
    </div>
  );
}
