/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The tool's home is recruiter-view.danscareercorner.com. Visits to the
  // old recruiter-view.vercel.app address are sent there, path and query
  // kept. Only that exact host matches, so branch previews are untouched.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "recruiter-view.vercel.app" }],
        destination: "https://recruiter-view.danscareercorner.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
