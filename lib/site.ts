// Set NEXT_PUBLIC_SITE_URL once a custom domain exists. Until then, use the host's own
// production URL: Vercel exposes VERCEL_PROJECT_PRODUCTION_URL, Netlify exposes URL.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.URL ?? "http://localhost:3000");

export const SITE_NAME = "Nidesh Kaarthik";
export const SITE_TITLE = "Nidesh Kaarthik — Founder who builds";
export const SITE_DESCRIPTION =
  "Nidesh Kaarthik designs and ships AI products end to end, from agent architecture to the pitch deck.";
