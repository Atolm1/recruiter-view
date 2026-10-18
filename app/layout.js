import localFont from 'next/font/local';
import Script from 'next/script';
import { SITE_URL } from '../lib/site';
import './globals.css';

// The main site's fonts, self-hosted (SIL Open Font License, copies in
// public/fonts): Fraunces for headings, Public Sans for everything else.
const fraunces = localFont({
  src: [
    { path: '../public/fonts/fraunces-latin.woff2', weight: '400 600', style: 'normal' },
    { path: '../public/fonts/fraunces-italic-latin.woff2', weight: '400 600', style: 'italic' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
});

const publicSans = localFont({
  src: [{ path: '../public/fonts/public-sans-latin.woff2', weight: '400 700', style: 'normal' }],
  variable: '--font-public-sans',
  display: 'swap',
  adjustFontFallback: 'Arial',
});

// Plausible, the main site's script, so tool visits and events land in
// the same dashboard. Production deployments only; Dan's own devices opt
// out at /dev-exclude.
const PLAUSIBLE_SCRIPT_SRC = 'https://plausible.io/js/pa-8wsZiXxm1WSqWvEwcAngk.js';
const loadAnalytics = process.env.VERCEL_ENV === 'production';

export const metadata = {
  title: "Recruiter View Simulator | Dan's Career Corner",
  description:
    'Paste in your LinkedIn headline, About section, and recent roles to see how they might read to a recruiter in a quick first pass, with specific fixes to make. Free, no sign-up.',
};

export default function RootLayout({ children }) {
  const year = new Date().getFullYear();
  return (
    <html lang="en" className={`${fraunces.variable} ${publicSans.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <header className="site-header">
          <div className="container">
            <a href={SITE_URL} className="wordmark">
              Dan&rsquo;s Career Corner
            </a>
            <a href={SITE_URL} className="header-link">
              Visit the main site
            </a>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <p>
              The Recruiter View Simulator is a free tool from{' '}
              <a href={SITE_URL}>Dan&rsquo;s Career Corner</a>, Dan Lopez&rsquo;s independent
              professional practice.
            </p>
            <p>&copy; {year} Dan&rsquo;s Career Corner</p>
          </div>
        </footer>
        {loadAnalytics ? (
          <>
            <Script id="plausible-init" strategy="afterInteractive">
              {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
            </Script>
            <Script src={PLAUSIBLE_SCRIPT_SRC} strategy="afterInteractive" />
          </>
        ) : null}
      </body>
    </html>
  );
}
