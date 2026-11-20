This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Website assistant

The site-wide assistant includes service shortcuts, a quote form, and call booking.
Free-text AI replies use Google's Gemini API through the server-side `/api/chat`
route. Create a key at https://aistudio.google.com/apikey and set these variables
in `.env` locally, or in your hosting environment, then restart/redeploy:

```env
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Do not use a `NEXT_PUBLIC_` variable for the key. `CHATBOT_API_KEY` is no longer
used. The default model is Gemini 3.5 Flash-Lite, which supports Google's limited
free tier; actual access and quotas depend on your Google project. Quota errors
show a friendly message and never automatically switch to a paid model.

Without a valid key, service shortcuts and contact actions still work and the
chat explains that AI replies are unavailable. Business guidance is defined in
`app/api/chat/route.ts`. The server retrieves public CMS pages, all listed service
details, office locations, portfolio summaries, blog listings, products, careers,
testimonials and policies through `utils/chatbotKnowledge.ts`. The index refreshes
after 10 minutes. Relevant excerpts (up to 30,000 characters) and the last eight
chat messages are sent to Gemini for follow-up questions. Private enquiries,
applicants, payments and credentials are not indexed. Blog, project, product and
career listings follow pagination (up to 100 pages per collection, deduplicated).
Full article bodies, project/product details, job descriptions and all portfolio
groups are retrieved, not just listing summaries. Individual document text is
retained in the index; only the relevant excerpts are sent per question. Index
creation uses eight concurrent CMS reads and is shared between requests. A cold
index may take longer to load. Coverage is limited to available public CMS data;
unavailable sources are skipped and the assistant must acknowledge missing facts.
Chat messages remain in memory and clear on reload.
See https://ai.google.dev/gemini-api/docs/pricing for current quotas/pricing and
data-use terms. Google's free-tier content may be used to improve its products.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
