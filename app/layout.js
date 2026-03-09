export const metadata = {
  title: "Recruiter View Simulator | Dan's Career Corner",
  description: "See your LinkedIn profile through a recruiter's eyes. Get instant, strategic feedback on your first impression, positioning, and what might cause a recruiter to move on.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
