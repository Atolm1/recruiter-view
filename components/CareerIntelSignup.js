'use client';
import { useId, useState } from 'react';
import { SUBSCRIBE_URL } from '../lib/site';
import { trackEvent } from '../lib/analytics';
import { AlertIcon, CheckIcon } from './Icons';

// The optional Career Intel invitation, shown only below a finished scan
// and never in the way of it (CLAUDE.md §10). Copy and behavior mirror
// the main site's SubscribeModule; the signup itself goes through the
// main site's /api/subscribe, which handles Kit and double opt-in.
export default function CareerIntelSignup() {
  const fieldId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [verifyUrl, setVerifyUrl] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setMessage('');
    setVerifyUrl('');
    try {
      const response = await fetch(SUBSCRIBE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, location: 'tool' }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error || 'Something went wrong. Please try again.');
      if (typeof body?.verifyUrl === 'string') {
        setStatus('verify');
        setVerifyUrl(body.verifyUrl);
        setMessage('One more step:');
        return;
      }
      setStatus('success');
      setMessage('Check your inbox to confirm your subscription.');
      trackEvent('subscribe', { location: 'tool' });
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error && error.message !== 'Failed to fetch' ? error.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <section className="subscribe" aria-labelledby={`${fieldId}-title`}>
      <p className="label-rule">Career Intel with Dan</p>
      <h2 id={`${fieldId}-title`} className="subscribe-title">
        Stay curious. Stay current.
      </h2>
      <p className="muted">Career Intel with Dan: a weekly, practical read on AI and the workplace. Free.</p>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor={fieldId} className="sr-only">
          Email address
        </label>
        <input
          id={fieldId}
          className="email-input"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby={message ? `${fieldId}-status` : undefined}
        />
        <button type="submit" className="button button-primary" aria-disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      <div id={`${fieldId}-status`} role="status" aria-live="polite">
        {message ? (
          <p className={`message ${status === 'error' ? 'message-error' : status === 'success' ? 'message-success' : ''}`}>
            {status === 'success' ? <CheckIcon /> : <AlertIcon />}
            <span>
              {message}
              {status === 'verify' && verifyUrl ? (
                <>
                  {' '}
                  <a href={verifyUrl} target="_blank" rel="noopener noreferrer">
                    complete a quick security check
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  , then check your inbox to confirm.
                </>
              ) : null}
            </span>
          </p>
        ) : null}
      </div>
      <p className="small muted fine-print">
        One email a week. No automated sequences, no spam. Unsubscribe anytime.
      </p>
    </section>
  );
}
