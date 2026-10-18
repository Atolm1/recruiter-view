'use client';
import { useState } from 'react';
import { SECTIONS, buildPlainText, buildStyledReport, gradeBand } from '../lib/report';
import { AlertIcon, CheckIcon, QuestionIcon } from './Icons';

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h3 className="panel-title">{title}</h3>
      <div className="panel-body">{children}</div>
    </section>
  );
}

function ItemList({ items, icon: Icon, tone }) {
  return (
    <ul className="item-list">
      {items?.map((item, i) => (
        <li key={i}>
          <Icon className={tone} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ScanResults({ result, elapsed, headingRef, onReset }) {
  const [feedback, setFeedback] = useState('');
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const fileDate = new Date().toISOString().slice(0, 10);

  function flash(text) {
    setFeedback(text);
    setTimeout(() => setFeedback(''), 2500);
  }

  // The report opens as its own page (a blob URL) rather than being
  // written into a blank window, where its fonts can stall loading.
  function savePdf() {
    const html = buildStyledReport(result, dateStr, window.location.origin);
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    const report = window.open(url, '_blank');
    if (!report) {
      URL.revokeObjectURL(url);
      flash('Your browser blocked the report window. Allow pop-ups for this site, then try again.');
      return;
    }
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  async function copyText() {
    const text = buildPlainText(result, dateStr);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.className = 'sr-only';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    flash('Copied your scan to the clipboard.');
  }

  function downloadText() {
    const blob = new Blob([buildPlainText(result, dateStr)], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `recruiter-view-${fileDate}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    flash('Downloaded your scan as a text file.');
  }

  return (
    <div className="results">
      <h2 ref={headingRef} tabIndex={-1} className="section-title results-heading">
        Your scan
      </h2>

      <div className="grade-block">
        <p className={`grade-ring grade-${gradeBand(result.overallGrade)}`}>
          <span className="sr-only">Grade: </span>
          {result.overallGrade || '?'}
        </p>
        <div>
          <p className="label-rule">{SECTIONS.readiness}</p>
          <p className="grade-summary">{result.oneLineSummary}</p>
        </div>
      </div>

      <div className="result-grid">
        <Panel title={SECTIONS.firstImpression}>
          <p className="first-impression">{result.firstImpression}</p>
        </Panel>
        <div className="result-pair">
          <Panel title={SECTIONS.clear}>
            <ItemList items={result.clearElements} icon={CheckIcon} tone="icon-success" />
          </Panel>
          <Panel title={SECTIONS.confusing}>
            <ItemList items={result.confusingElements} icon={QuestionIcon} tone="icon-neutral" />
          </Panel>
        </div>
        <Panel title={SECTIONS.target}>
          <p>{result.perceivedTarget}</p>
        </Panel>
        <Panel title={SECTIONS.skip}>
          <ItemList items={result.skipTriggers} icon={AlertIcon} tone="icon-error" />
        </Panel>
        <Panel title={SECTIONS.positioning}>
          <ol className="fixes">
            {result.positioning?.map((item, i) => (
              <li key={i}>
                <dl className="fix-pair">
                  <div>
                    <dt>Issue</dt>
                    <dd>{item.issue}</dd>
                  </div>
                  <div>
                    <dt>Fix</dt>
                    <dd>{item.fix}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="actions">
        <div className="actions-group">
          <button type="button" className="button button-primary" onClick={savePdf}>
            Save as PDF
            <span className="sr-only"> (opens a printable report in a new window)</span>
          </button>
          <button type="button" className="button button-secondary" onClick={copyText}>
            Copy the text
          </button>
          <button type="button" className="button button-secondary" onClick={downloadText}>
            Download as text
          </button>
        </div>
        <button type="button" className="button button-secondary" onClick={onReset}>
          Scan another profile
        </button>
      </div>
      <p className="small muted elapsed" role="status" aria-live="polite">
        {feedback || `Scan finished in ${(elapsed / 1000).toFixed(1)} seconds.`}
      </p>
    </div>
  );
}
