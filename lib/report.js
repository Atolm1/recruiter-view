// The scan's section names, shared by the page, the printable report,
// and the plain-text copy so all three read the same.
export const SECTIONS = {
  readiness: 'Recruiter readiness',
  firstImpression: 'First impression',
  clear: 'What reads clear',
  confusing: 'What feels confusing',
  target: 'The role you seem to be aiming for',
  skip: 'What might make a recruiter move on',
  positioning: 'How to sharpen your positioning',
};

export function gradeBand(grade) {
  if (/^[AB]/.test(grade || '')) return 'strong';
  if (/^C/.test(grade || '')) return 'middle';
  return 'weak';
}

export function buildPlainText(r, dateStr) {
  const rule = '-'.repeat(52);
  const section = (title, lines) => ['', rule, title.toUpperCase(), rule, ...lines];
  return [
    'RECRUITER VIEW SIMULATOR: YOUR SCAN',
    'Dan’s Career Corner, ' + dateStr,
    ...section(SECTIONS.readiness, ['Grade: ' + r.overallGrade, r.oneLineSummary]),
    ...section(SECTIONS.firstImpression, [r.firstImpression]),
    ...section(SECTIONS.clear, r.clearElements.map((item) => '- ' + item)),
    ...section(SECTIONS.confusing, r.confusingElements.map((item) => '- ' + item)),
    ...section(SECTIONS.target, [r.perceivedTarget]),
    ...section(SECTIONS.skip, r.skipTriggers.map((item) => '- ' + item)),
    ...section(
      SECTIONS.positioning,
      r.positioning.flatMap((p, i) => [(i + 1) + '. Issue: ' + p.issue, '   Fix: ' + p.fix, ''])
    ),
    rule,
    'Recruiter View Simulator, a free tool from danscareercorner.com',
  ].join('\n');
}

const esc = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// A standalone page for printing or saving as PDF, opened in a new
// window. It can't use the app's stylesheet, so it carries its own copy
// of the palette and loads the same self-hosted fonts from this origin.
export function buildStyledReport(r, dateStr, origin) {
  const band = gradeBand(r.overallGrade);
  const list = (items, mark) => items.map((item) => `<li><span class="mark">${mark}</span>${esc(item)}</li>`).join('');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Recruiter View Simulator: your scan</title>
<style>
@font-face{font-family:Fraunces;src:url(${origin}/fonts/fraunces-latin.woff2) format('woff2');font-weight:400 600;font-style:normal}
@font-face{font-family:Fraunces;src:url(${origin}/fonts/fraunces-italic-latin.woff2) format('woff2');font-weight:400 600;font-style:italic}
@font-face{font-family:'Public Sans';src:url(${origin}/fonts/public-sans-latin.woff2) format('woff2');font-weight:400 700}
:root{--paper:#FAF7F1;--cream:#F1EBE1;--ink:#22252B;--muted:#55585F;--teal:#145A5E;--success:#2F6B4F;--error:#A03A2E;--hairline:rgba(34,37,43,.12)}
*{box-sizing:border-box}
body{margin:0 auto;max-width:780px;padding:40px 32px;background:var(--paper);color:var(--ink);font:15px/1.6 'Public Sans',Arial,sans-serif}
h1,h2,p,ul{margin:0}ul{padding:0;list-style:none}
.toolbar{text-align:right;margin-bottom:24px}
.toolbar button{min-height:44px;padding:10px 20px;border:0;border-radius:6px;background:var(--teal);color:var(--paper);font:600 14px 'Public Sans',Arial,sans-serif;cursor:pointer}
.brand{font:500 18px Fraunces,'Times New Roman',serif}
.meta{color:var(--muted);font-size:13px;margin-top:2px}
h1{margin-top:20px;font:400 30px/1.2 Fraunces,'Times New Roman',serif;letter-spacing:-.02em}
h2{font:500 18px/1.3 Fraunces,'Times New Roman',serif;margin-bottom:8px}
.block{margin-top:18px;padding:16px 20px;border:1px solid var(--hairline);border-radius:8px;break-inside:avoid}
.grade{display:flex;gap:20px;align-items:center}
.ring{flex-shrink:0;width:72px;height:72px;border:4px solid currentColor;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 28px 'Public Sans',Arial,sans-serif}
.strong{color:var(--success)}.middle{color:var(--ink)}.weak{color:var(--error)}
.label{font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.summary{font:400 18px/1.4 Fraunces,'Times New Roman',serif;margin-top:4px}
.quote{padding-left:14px;border-left:3px solid var(--teal);font-family:Fraunces,'Times New Roman',serif;font-style:italic}
li{display:flex;gap:10px}li+li{margin-top:8px}.mark{flex-shrink:0;font-weight:700;color:var(--muted)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:18px}.two .block{margin-top:18px}
.fix{display:grid;grid-template-columns:1fr 1fr;gap:16px}.fix+.fix{margin-top:12px;padding-top:12px;border-top:1px solid var(--hairline)}
footer{margin-top:28px;padding-top:12px;border-top:1px solid var(--hairline);color:var(--muted);font-size:12px}
@media print{body{padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}.toolbar{display:none}}
</style></head><body>
<div class="toolbar"><button type="button" onclick="window.print()">Print or save as PDF</button></div>
<p class="brand">Dan&rsquo;s Career Corner</p>
<p class="meta">Recruiter View Simulator, ${esc(dateStr)}</p>
<h1>Your scan</h1>
<div class="block grade"><div class="ring ${band}">${esc(r.overallGrade)}</div>
<div><p class="label">${SECTIONS.readiness}</p><p class="summary">${esc(r.oneLineSummary)}</p></div></div>
<div class="block"><h2>${SECTIONS.firstImpression}</h2><p class="quote">${esc(r.firstImpression)}</p></div>
<div class="two"><div class="block"><h2>${SECTIONS.clear}</h2><ul>${list(r.clearElements, '+')}</ul></div>
<div class="block"><h2>${SECTIONS.confusing}</h2><ul>${list(r.confusingElements, '?')}</ul></div></div>
<div class="block"><h2>${SECTIONS.target}</h2><p>${esc(r.perceivedTarget)}</p></div>
<div class="block"><h2>${SECTIONS.skip}</h2><ul>${list(r.skipTriggers, '!')}</ul></div>
<div class="block"><h2>${SECTIONS.positioning}</h2>
${r.positioning.map((p) => `<div class="fix"><div><p class="label">Issue</p><p>${esc(p.issue)}</p></div><div><p class="label">Fix</p><p>${esc(p.fix)}</p></div></div>`).join('')}</div>
<footer>Recruiter View Simulator, a free tool from danscareercorner.com</footer>
</body></html>`;
}
