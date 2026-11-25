# Eclick AI Assistant: analysis and implementation contract

Analysis date: 2026-11-24. Prepared before chatbot implementation.

Current integration update: following the user's later request to reuse the site's form/API, the chatbot now opens the existing Let's Connect modal with a prefilled draft and also submits guided enquiries through its existing `schedule-a-call` API. The original dedicated backend contract below is retained as an optional future integration, not a prerequisite for website-form submissions. See `SETUP.md` for the current behavior and verification limits.

## Reference inspection

Opened https://modibuilders.com/ with headless Chrome through Playwright, waited for third-party scripts, inspected rendered DOM, frames and controls at desktop and mobile widths. Evidence: `reference-inspection.txt`, `reference-desktop.png`, `reference-mobile.png`. No enquiry was submitted.

The currently accessible integration is a SmatBot WhatsApp widget: company avatar, company title, greeting “How can i help you?”, a background image, and “Start Chat”. Its link hands off to WhatsApp. A separate SmatBot chatbot loader is present, but no accessible guided-question interface was rendered. Opening/closing the available launcher is inspectable. Nested questions, previous-step behavior, restart, typing, validation, contact collection and completion cannot be verified from this reference. These must not be represented as observed behavior. No reference business content will be used.

Observed reference map: floating WhatsApp icon → company greeting card → Start Chat → external WhatsApp handoff. No further stages inspected.

## Existing architecture

Next.js 16 App Router, React 19, TypeScript, CSS modules, Bootstrap, Instrument Sans / DM Sans / Inter. Primary blue `#1f58cb`. Root layout mounts an existing basic chatbot. Existing `/api/chat` uses Gemini REST and public CMS retrieval. Existing quote/call modals and contact forms POST to an external API. Public API: `https://admin.eclicksoftwares.com/api/v1/`; media URLs come from existing environment configuration.

There is no CMS server source, database driver/schema, admin route/authentication, role system, or mail transport in this checkout. Backend framework, database engine, role conventions and email configuration cannot be established by inspecting this frontend. Do not create an unrelated admin panel or assume a database dialect. Backend source location has been requested.

Verified public sources: `category/with-service`, `services/:slug`, `group`, `projects/group/:slug`, `category/with-projects`, `industry`, `location`, `site-setting`, `page/:slug`, blogs and projects. Six categories / 41 services were returned during analysis: AI Automations, Web Development, Digital Marketing & Growth, Graphics Design, Mobile App Solutions, Managed Services & Support. Preserve CMS hierarchy; never infer services from examples. Some CMS portfolio descriptions contain unrelated duplicated text and some fields contain “Test”; owner content review is required.

## Proposed Eclick flow map

WELCOME → MAIN_MENU

* Services → SERVICE_CATEGORY → SERVICE_DETAIL → related projects / enquiry / question / other services.
* Portfolio → PORTFOLIO_CATEGORY → PORTFOLIO_DETAIL → load more / select project / enquiry.
* About → verified overview, mission/vision where published, journey/process links.
* Technologies → technology records linked to verified service records.
* Contact → verified email/phone/location, existing consultation page.
* Question → grounded Gemini response with verified source links.
* Enquiry → SERVICE_CATEGORY (reuse previous service) → PROJECT_TYPE → BUSINESS_INDUSTRY → EXISTING_WEBSITE (conditional) → WEBSITE_URL (conditional) → PROJECT_REQUIREMENTS → PROJECT_BUDGET → PROJECT_TIMELINE → CONTACT_NAME → CONTACT_EMAIL → CONTACT_PHONE (optional) → CONTACT_COMPANY (optional) → CONTACT_PREFERENCE → PRIVACY_CONSENT → REVIEW_ENQUIRY → explicit confirm → backend receipt → ENQUIRY_SUCCESS.

Questions during collection suspend the step and offer Continue My Enquiry. Back restores previous step and answers. Edit Details allows choosing an individual field and returning to review. Main Menu preserves draft; restart clears draft and transcript. Personal data must not be persisted in local/session storage. Root-layout state survives client-side route navigation; durable server sessions require the backend integration below.

## Implementation phases and files

1. Reference evidence and this analysis (`docs/chatbot/*`, `scripts/inspect-reference.mjs`).
2. CMS adapters and public catalogue endpoint (`utils/chatbot/catalogue.ts`, `app/api/chatbot/catalogue/route.ts`), reuse `utils/chatbotKnowledge.ts`.
3. Lazy launcher, responsive panel and scoped styles (`components/chatbot/Chatbot.tsx`, `ChatPanel.tsx`, `Chatbot.module.css`, `public/assets/images/ai-assistant.svg`).
4. Declarative step definitions and central state (`data/chatbotFlow.ts`, `utils/chatbot/flow.ts`).
5. Dynamic services, portfolio, company and technology branches; no static invented catalogue.
6. Knowledge records with source, category, keywords, observed/updated date and active status; cached CMS refresh.
7. Official Google Gen AI SDK, bounded context/output, schema validation, safe source resolution (`app/api/chat/route.ts`, `utils/chatbot/security.ts`).
8. Sequential collection, consent, summary, field edits and confirmed submission adapter (`app/api/chatbot/enquiry/route.ts`).
9–10. Existing CMS database, mail notifications and admin integration require missing backend source. Adapter remains unavailable until a compatible backend is configured; never show a successful enquiry without a durable backend receipt.
11–12. Security, unit/browser checks, `.env.example`, deployment/setup documentation. No external deployment is configured in this task.

## Proposed database structure (apply in existing backend only)

Use backend-native migrations with up/down and its current primary key, date and foreign-key conventions:

| Table | Fields and indexes |
|---|---|
| chatbot_sessions | opaque id, mode, step_id, encrypted draft/context, language, source_page, UTM, status, expires_at, timestamps; expiry/status indexes |
| chatbot_messages | session FK, role, redacted content, sources, created_at; session+date index |
| chatbot_leads | unique reference, unique idempotency_key, session FK, encrypted contact fields, service/project refs, project type/industry/site/requirements/budget/timeline/contact preference, deterministic summary, consent_at/version, status, notes, notification_status, timestamps; service/status/date indexes |
| chatbot_settings | unique key, validated JSON value, updated_by FK, timestamps; never expose credentials |
| chatbot_flows | stable unique key, title, version, active, timestamps |
| chatbot_flow_steps | flow FK, unique flow+step_id, order, message, input_type, options, validation, conditions, next/back rules, active |
| chatbot_knowledge_base | unique source+record key, title, category, content, keywords, source_url, source_updated_at, synced_at, active, search index |
| chatbot_api_usage | session FK (nullable), model, input/output tokens, result code, date; model/date indexes |

Lead creation transaction must verify consent and complete validation, insert with a unique idempotency key, enqueue an email outbox event, and return the persisted reference. Retry must return the original receipt. Mail failure updates notification status, never deletes the saved lead. Notifications use existing mail configuration and configured recipient. Apply existing RBAC to dashboard, flow/settings/KB editors, search/date/service/status lead filters, history, notes, status changes, CSV export (formula escaping), deletion. Schedule expiry/deletion jobs using configurable retention; do not retain abandoned PII indefinitely. Rollback removes chatbot tables in reverse FK order after operator-controlled data export.

## Backend enquiry API contract

Configure `CHATBOT_ENQUIRY_API_URL` only after backend implementation. It must be an HTTPS server endpoint, accept server bearer credential, `Idempotency-Key`, validated JSON `{draft, sourcePage, utm, consentAt}` and return `{stored:true, reference:string, notificationStatus:"sent"|"queued"|"failed"}` only after commit. On a repeated key return the same result. This checkout does not assume the existing contact endpoint can meet this contract. Never test against real production enquiry endpoints with fake leads.

Production sign-off remains blocked on backend source/integration, durable server sessions and distributed rate limits, existing-admin management, configured Gemini access, mail verification and full end-to-end testing. Browser and unit tests must use intercepted local endpoints, never submit test leads to either public site.
