# Setup and current delivery status

Use the existing Next.js project; no independent application or admin panel was created. Reference inspection and the proposed schema/flow are documented in [IMPLEMENTATION.md](IMPLEMENTATION.md). The reference currently exposes a WhatsApp handoff, so its described multi-step flow could not be verified.

## Run locally

1. Use Node 22+ and `npm ci`.
2. Merge the chatbot variables from `.env.example` into the existing environment. Preserve all other existing website settings. Do not replace the current `.env` wholesale or commit it.
3. Set server-only `GEMINI_API_KEY` and an accessible stable model in `GEMINI_MODEL`. The default is `gemini-3.8-flash`, listed as stable in Google's [model documentation](https://ai.google.dev/gemini-api/docs/models) on 2026-11-24. The existing local model override is respected. The integration uses the [official Google Gen AI JavaScript SDK](https://googleapis.github.io/js-genai/) and [structured output](https://ai.google.dev/gemini-api/docs/structured-output).
4. `npm run dev`; open the printed local URL. Do not start a second dev instance against the same checkout.
5. `npm run test:chatbot`, `npx tsc --noEmit`, `npm run test:chatbot:browser`. The browser script uses system Chrome on Windows by default; set `CHROME_PATH` and `CHATBOT_TEST_URL` elsewhere. Test screenshots are ignored under `test-results/`.
6. `npm run build` before normal deployment through the website's existing pipeline. This task does not publish a separate Site or deploy to the public website.

`CHATBOT_ENABLED=false` removes the launcher and disables its routes after restart. The assistance bubble appears after `CHATBOT_WELCOME_DELAY` (default 5000 ms); only its dismissed flag is stored in sessionStorage. The heavy panel is dynamically imported on first open. Existing SVG avatar is reused. CSS is scoped; viewport/safe-area handling and reduced-motion styling are included. Consultation uses the website's existing scheduling modal.

## Public content

The main menu also includes **View Case Studies**. Published `project` records appear as portfolio-style cards in batches of three. Visitors can open in-chat detail cards with expandable objectives, scope, challenges, approach and results, view published technologies, follow the full case-study link, or discuss a similar project. Detail fields are allowlisted and rendered as plain text; unpublished/deleted detail records are rejected. Listing pagination is followed and records are deduplicated. The selected case-study title is carried into the enquiry draft.

Catalogue reads use the existing CMS's public endpoints, cached for five minutes with a short HTTP cache. Knowledge retrieval reuses the existing public-content index, refreshing after ten minutes. CMS changes therefore propagate within these cache windows, rather than requiring a separate static catalogue. Missing public data returns an explicit fallback. Some CMS records contain inconsistent or test descriptions; correcting those records requires the content owner/admin.

Grounded responses send up to six relevant chunks (at most 2000 characters each), at most six dedicated question turns (1500 characters each), and a 2000-character question. Contact form answers and the guided transcript are never used as AI history. Common email/phone/credential patterns are redacted server-side. Visitors are told AI processes questions and asked to leave personal information out of them; regex redaction is not a guarantee for arbitrary PII. No AI output is rendered as HTML. Source links are resolved from retrieved public records. Navigation and submission remain deterministic; generated actions are allowlisted and schema checked. Gemini has a 20-second HTTP timeout and at most two attempts. Output tokens are bounded to 256–2048 with a default of 1024. Guided navigation remains available when AI fails.

## Existing website enquiry integration

At the user's request, chatbot enquiries now default to the site's existing **Let's Connect** form and **`schedule-a-call` API**. No separate chatbot endpoint/token is needed for this mode. `Open Enquiry Form` and `Use Website Form` open the real existing modal, prefilled from the chat draft in React memory. Visitors can review/edit the information, give privacy consent and send using the form's existing API/thank-you flow.

Guided `Confirm & Submit` uses the Next.js validation adapter, which maps to the same `service`, `sc_full_name`, `sc_business_email`, `sc_phone_number`, `sc_message`, `sc_flag` payload. Both paths share `utils/chatbot/websiteEnquiry.ts`. Company, budget, timeline, project/case-study inspiration, source page and UTM context are included in the message; no newsletter opt-in is inferred. Phone and company are required in website mode to match the existing form. API success requires HTTP success plus `status: "success"`, as in the site's existing form. A reference is displayed only if the API returns one. The chatbot does not claim separate email delivery status when this endpoint does not provide it.

The adapter has process-local duplicate/in-flight protection for 30 minutes, using the request ID and a payload fingerprint. Uncertain responses are not automatically retried, because the existing endpoint's durable idempotency behavior is unknown. Multi-instance/durable deduplication and separate chatbot admin/session analytics remain backend work. All development tests intercept/mock enquiry writes; no fake enquiry is sent to the live API.

## Optional dedicated enquiry adapter

The CMS server/admin/database/mail source is absent from this checkout. Existing website submissions are supported as described above. A richer separate chatbot receipt/notification contract remains optional and requires implementing it in the CMS backend.

Implement the contract in `IMPLEMENTATION.md` in the existing CMS. Configure `CHATBOT_ENQUIRY_API_URL` (HTTPS only) and `CHATBOT_BACKEND_TOKEN` on the Next.js server. Its `/api/chatbot/enquiry` adapter performs origin/content-type/body-limit checks, field validation, CMS service verification, required consent, confirmation and idempotency-key checks before forwarding. The backend must use the key transactionally and return `{stored:true,reference,notificationStatus}` only after commit. An unconfirmed/failed request never shows success. The original request key is kept for retries. Notification failure is displayed independently from stored lead success. Do not enable the endpoint against an unrelated form handler or test it by submitting fake production leads.

The CMS must implement its own authenticated, role-protected chatbot management section, migrations and rollback, email outbox/template, knowledge/flow/settings editors, lead filters/status/notes/export/deletion, analytics/usage capture and scheduled retention. `CHATBOT_NOTIFICATION_EMAIL` and retention values in the example are reserved backend configuration; the Next.js adapter does not send mail or run retention jobs. All backend acceptance tests remain pending.

## Session and infrastructure limitations

Drafts and transcript are in React memory, preserved across same-origin Next.js client navigation, minimise and reopen. They clear on full reload/new tab and are never persisted as browser storage. Server sessions and Continue Previous Conversation after reload are pending backend integration. Do not claim durable persistence or retention enforcement yet. Limit access to conversation histories according to the existing admin roles when that feature is implemented.

Rate limiting and in-flight AI deduplication are process-local guards. By default rate limiting uses a conservative shared per-endpoint bucket because Next.js does not supply a verified client address. Enable `CHATBOT_TRUST_PROXY` only behind a trusted proxy that strips and replaces client-supplied forwarded headers. A shared limiter/session store, edge body/rate limits and backend transactional deduplication are required for multiple instances. No visitor-specific AI answers are shared-cached. Public KB and catalogue are cached; general AI-answer caching and persistent token usage reporting remain pending.

## Verified so far

* Public CMS catalogue and nested service detail retrieval; six categories and 41 services observed.
* TypeScript check passed.
* Twelve flow/security/API unit tests passed, including website payload mapping, success acknowledgement and process-local duplicate protection, case-study retrieval, confirmation/receipt validation, optional AI followup preservation and graphic-portfolio schema support.
* Production build passed.
* Chrome browser run passed: real CMS content, collection through review, invalid email, field edits, company/portfolio/technology/contact branches, optional requirement refinement, AI outage and resume, intercepted submission failure/retry/receipt, restart, delayed launcher/dismissal, preservation across a client-side service-page visit, resume during service selection, and widths 300/375/768/1920; no page errors. No test enquiries were sent to a real backend.
* One real configured Gemini call returned a grounded CMS development answer and a verified service source link.
* `node scripts/chatbot-catalogue.mjs` checked every listed service and all eight portfolio groups. The CMS has one menu entry without a detail record (`mvp-app-development`); its chatbot branch explains the gap and links to `/solutions`. Returned portfolio cards: Logo Design 32, Website Design 6, Graphics Design 9, Business Card 13, T-Shirt Design 9. Mobile App Design, Packaging Design and Illustration currently return no items. The chatbot reports empty categories honestly.

Not yet verified: real database receipt/idempotency, email, existing-admin/RBAC integration, refresh persistence, every full conversation/AI language/adversarial branch, real mobile soft keyboard, multi-instance limits, production deployment and before/after Core Web Vitals. These limitations prevent calling the overall 32-step brief production-complete.
