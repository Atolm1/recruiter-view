import ExcludeFromAnalytics from '../../components/ExcludeFromAnalytics';

// Visit once per device and browser to keep Dan's own use of the tool
// out of Plausible, like the main site's /dev-exclude. The flag lives in
// localStorage, which is per site, so the main site's page doesn't cover
// this tool. Not linked anywhere.
export const metadata = {
  title: 'Analytics exclusion',
  robots: { index: false, follow: false },
};

export default function DevExcludePage() {
  return (
    <div className="container plain-page">
      <ExcludeFromAnalytics />
      <h1 className="page-title">Analytics exclusion</h1>
      <p className="muted">This browser is now excluded from the Recruiter View Simulator&rsquo;s analytics.</p>
      <p className="small muted">
        The setting is saved in this browser only. Visit this page once on every device and browser you
        use to try the tool.
      </p>
    </div>
  );
}
