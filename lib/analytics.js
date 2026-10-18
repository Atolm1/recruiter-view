// Plausible events, using the same predefined names as the main site
// (its lib/analytics.ts): tool_completed when a scan comes back, and
// subscribe with location "tool" after a Career Intel signup. The script
// only loads on production, so elsewhere this does nothing.
export function trackEvent(name, props) {
  if (typeof window === 'undefined' || typeof window.plausible !== 'function') return;
  window.plausible(name, props ? { props } : undefined);
}
