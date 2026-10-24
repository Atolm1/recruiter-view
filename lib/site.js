// Where this tool meets the main Dan's Career Corner site.
//
// SITE_URL is where the header and footer send people. The Career Intel
// signup posts to the main site's /api/subscribe, so the site's one Kit
// connection stays the only path onto the list. That route allows this
// tool's origins (see its comment). Both moved to www.danscareercorner.com
// at launch (2026-10-24); www is the primary address, so no redirect.
export const SITE_URL = 'https://www.danscareercorner.com';
export const SUBSCRIBE_URL =
  process.env.NEXT_PUBLIC_SUBSCRIBE_URL || 'https://www.danscareercorner.com/api/subscribe';

export const TOOL_ID = 'recruiter-view';
