# CityAuction

CityAuction is an Indian auction discovery and buyer assistance application.
The active implementation is in `src/`, with a MySQL schema in `prisma/schema.prisma`.

## Current implementation

- Public marketing pages, auction discovery and location pages.
- Database-backed enquiries, newsletter subscribers, verified email/password login and admin tools.
- Buyer portal work: email OTP registration/recovery, saved properties, requirements,
  suggested matches, inspection/support requests and marketing preferences.
- The buyer portal requires the corresponding working Prisma schema in the database.
  A generated Prisma client does not establish that the database has been updated.

Online bidding, EMD/payment collection, KYC submission/review and document uploads
are **not available**. Their legacy API routes return HTTP 503 with
`FEATURE_NOT_AVAILABLE`. The bidding page and auction detail controls explain this
and direct visitors to the team. Legacy demo services/components remain in the
repository for reference; do not reconnect them to live routes.

Public discovery and the sitemap use database records only. Listings must have a
publication date, a source reference and a recorded source check. Drafts, deleted
records and inactive institutions are excluded. Sample seed records have no source
check and are not published by these queries. An empty search stays empty; a database
outage is reported as an error, never replaced by sample listings. Source checks do
not certify legal title or suitability.
Auction publishing from the admin panel is not implemented.

## Stack

- Next.js 16.3.6 App Router and React 19.2.8
- TypeScript and Tailwind CSS 4
- Prisma 6.19.3 with MySQL
- `jose` JWT sessions in HTTP-only cookies, bcrypt password hashing, Zod validation
- Nodemailer SMTP transport for email-only OTP delivery

Read `AGENTS.md` and the relevant installed Next.js guides in
`node_modules/next/dist/docs/` before modifying framework code.

## Local setup

Use Node.js 20.9 or newer and npm. Install the locked dependencies with `npm ci`.
Copy `.env.example` to `.env`, then configure a development MySQL database,
a random `AUTH_SECRET` of at least 32 characters, and `NEXT_PUBLIC_APP_URL`.
Never commit real environment credentials.

Generate the Prisma client with `npx prisma generate`. Before running database
schema commands, review the schema against the target database. There is currently
no committed migration history; do not run schema push, reset or seed commands
against production as a setup shortcut.

Run `npm run dev` and open http://localhost:3000.

Email verification defaults to Phone.Email with public client ID
`11716953482701480507`. The widget loads only on verification forms and passes
`user_json_url` to CityAuction's backend. The backend fetches the provider's JSON
and reads `user_email_id`; it never trusts an email supplied by the browser callback.
No SMTP or MSG91 credentials are needed for this default flow.

Set `NEXT_PUBLIC_PHONE_EMAIL_CLIENT_ID` to change the public client ID. The SMTP
implementation remains an optional fallback selected by
`NEXT_PUBLIC_EMAIL_OTP_PROVIDER=smtp`, using the company mailbox configuration
below. Provider prices/quotas are outside the application's control.

Phone.Email result URLs are bearer credentials under the provider's documented
JSON flow. CityAuction allows only HTTPS `user.phone.email/user_*.json`, refuses
redirects and oversized responses, checks the intended email, and exchanges each
URL once into a short-lived, browser- and action-bound receipt. An HttpOnly signed
intent cookie and same-origin checks protect the exchange. The documented email
JSON format does not promise a signed expiry or mandatory client-ID claim, so
CityAuction cannot independently attest the age or client binding of a previously
unseen provider URL. If the response includes `client_id`, it must match. Never
log result URLs or provider JSON bodies.

The local receipt expires after five minutes and is consumed once. It uses the
same email OTP table described below. Recovery/email changes consume the receipt
and update the account in a transaction. Live widget behavior and result payloads
must be verified against the configured Phone.Email account before deployment.

The additive SQL in `scripts/sql/20261030-email-otp.sql` creates the new email OTP
table. Review the target database and apply it through your normal database change
process before enabling email verification. Client generation alone does not
create this table. The legacy mobile OTP table is retained and unused.

New sign-ups enter a password and matching confirmation, then verify their email
with an OTP. The password is stored as a bcrypt hash only after verification.
Verified accounts subsequently sign in with email and password without another
OTP. Login remains rate-limited and rejects disabled, deleted or unverified accounts.
Phone is optional contact information. Existing verified OTP-only accounts can
use Forgot password to set their first password; unverified or mobile-only legacy
accounts require assisted recovery. Old OTP endpoints are retained for compatibility
but are no longer offered as the normal sign-in interface.

Forgot password uses three steps: email, OTP verification, then new password and
matching confirmation. `/api/auth/reset-password/verify` exchanges the email proof
for a five-minute, single-use reset grant in `email_otp_challenges`, bound to an
HttpOnly browser cookie and the current account/session version. No database
schema change is needed. Resetting a password consumes the grant and revokes
older sessions/codes atomically. Password confirmation fields stay masked and
never show an eye toggle; primary password fields provide the toggle.

Changing a sign-in email requires OTP verification of the new address and signs
out other devices. Profile edits cannot silently change the sign-in email.
Password recovery resets the password and invalidates older sessions and codes.

Without any SMTP settings, local development shows a test code on screen and
sends no email. Production and partial SMTP configurations fail closed; no code
is exposed when delivery is unavailable. No SMTP credentials are included here.
Newsletter/requirement preferences are stored, but scheduled opportunity delivery
is not implemented.

## Validation

```bash
npm test
npx tsc --noEmit --incremental false
npm run lint
npm run build
```

The security tests run the actual handlers with isolated infrastructure mocks;
they do not access a database or send messages. They cover disabled transaction
routes, session validation, password-change/reset session revocation, public listing
visibility, search filters, pagination and property-linked buyer requests.
They do not replace staging tests or payment-provider certification.

ESLint excludes nested Claude worktrees. Existing lint errors in legacy components
and content remain to be resolved. The build generates Prisma and runs Next.js
with webpack; Google font fetching may require network access.

## Administration and deployment

`scripts/bootstrap-admin.ts` provisions an administrator and issues a private,
one-time password link. Running it changes the selected database; review the
target environment before use. `prisma/seed.ts` creates demo users with known
passwords and sample data and is not a production provisioning procedure.

Production authentication requires `AUTH_SECRET`; no production fallback secret
is accepted. Database-backed session validation denies access when the database
cannot be checked. Password changes/reset invalidate older session versions.

Before deployment, establish reviewed migrations, verify real data and filtering,
resolve lint failures, configure secrets/SMTP and validate workflows in staging.
No current deployment target, deployed commit or live database state is established
by the repository alone. The worker limit in `next.config.ts` reflects an earlier
Hostinger build constraint.

## License

Proprietary and confidential. All rights reserved.

## Homepage maintenance

The homepage is a server component in `src/app/(public)/page.tsx`; only the search
and enquiry forms hydrate in the browser. Service/category copy and destinations
are in `src/content/homepage.ts`. Search uses the shared marketplace categories,
channels and buyer budget ranges through `src/lib/home-search.ts`.

`src/components/home/home-enquiry.tsx` owns the enquiry form, with short labels,
inline validation and a full-width message field. It keeps the existing homepage
lead source and subject values so admin reports remain consistent. The newsletter
appears once, in the footer. No inventory totals or response-time commitments
are hard-coded into the homepage.

The hero at `public/images/cityauction-architecture.webp` is generated illustrative
architecture, not an auction listing photograph. It is served locally through
Next Image; the original generation is kept separately. The admin sidebar is
fixed to the viewport, with only its navigation scrolling; the mobile drawer
uses the common focus/scroll-lock helper.

### Auction discovery maintenance

The marketplace filter form submits a complete draft once with **Apply filters**. Keep URL parsing in `src/lib/auction-search.ts` and URL/display helpers in `src/lib/auction-discovery-ui.ts`; chips and sorting must preserve unrelated filters and reset pagination. City and district are distinct fields. Date filters and card times use IST. The “Ending soon” sort includes only open-status notices with a future end time; historical notices remain available through other sorts and explicit status filters.

Cards show exact INR reserve/EMD amounts and all three notice deadlines in grid and list views. Missing or broken images use a labelled placeholder. A database outage must display retry guidance without claiming the inventory is empty. Guest save actions return through sign-in to the selected listing; never nest the save button inside its link. Regression coverage lives in `tests/auction-listing-ui.test.mjs`, `tests/auction-discovery.test.mjs` and `tests/property-actions.test.mjs`.

### Property detail maintenance

Property details use the canonical `DetailedAuction` type, recorded INR amounts and IST schedule values. Never invent an EMD percentage, increment, inspection date, unit of area or fixed auction hours. Availability is derived from explicit terminal statuses and the recorded schedule in `src/lib/auction-detail.ts`; it is not a guarantee from the selling authority. Contact enquiries and saved-reference access remain available for historical notices, while both UI and API block unavailable inspection requests and dates after the submission day.

`PropertyGallery` handles missing/broken images, photo selection and a keyboard-contained enlarged viewer. Public documents remain visible outside tabs and open only usable HTTPS or site-relative links. Empty records show explicit guidance. Sharing copies the canonical listing path without account action queries, and handles permission denial. Detail-route not-found and error views distinguish missing notices from retrieval failures. See `tests/auction-detail-ui.test.mjs` and the inspection cases in `tests/auction-discovery.test.mjs`.

### Admin property and auction publishing

Admins can add/edit properties at `/admin/properties`, add institutions in the property form, and choose an existing location or create a state/city hierarchy. Categories are created from the selected supported type when needed. The first photo is the cover. Auction drafts at `/admin/auctions` require the core property, amount and schedule fields; source checks are needed only for publication. Saved previews are admin-only and disable buyer actions.

Publishing requires an active institution, a complete property, valid rupee amounts and IST dates, an official source reference, a public document classified `NOTICE`, and the admin’s explicit source confirmation. No seed record is automatically verified or published. Saving a property withdraws linked notices pending review. Saving an auction draft also removes publication/source-verification flags; withdrawal preserves history and records. Record versions prevent stale edits, property row locks serialize publication with property changes, and audit writes commit with each change. Notices/properties with recorded bids are protected from editing here.

Admin uploads use `/api/admin/media` and the public file gateway `/api/media/[key]`. JPG/PNG/WebP photos are limited to 5 MB and PDF documents to 10 MB, with signature checks, bounded request bodies and a 100-file daily admin limit. The Next.js proxy buffer allows 11 MB so a 10 MB PDF plus multipart framing is not truncated. Files use generated names and private permissions. In Hostinger's `.../domains/<domain>/hbuilds/versions/...` layout they are stored at `.../domains/<domain>/private_storage/cityauction_media`, outside replaceable builds. Alternatively set `CITYAUCTION_UPLOAD_DIR` to an absolute persistent directory. Other production layouts fail explicitly until this is configured. Back up this directory with the database. Local development uses ignored `.local/media`. Removing attachments detaches their references; files are retained for audit/recovery rather than automatically deleted.

An uploaded file is accessible only to a freshly authenticated admin or through a currently published, source-checked notice that references it (documents must additionally be public). Unattached files and drafts have no guest access. Upload failures retain the form and allow attaching existing HTTPS URLs instead. Existing long external URLs must fit the database's 191-character URL fields; uploading creates short URLs. The legacy public/KYC upload endpoint remains unavailable. Tests in `admin-publishing.test.mjs`, `admin-media.test.mjs` and `admin-editor.test.mjs` use isolated data and do not publish live notices.

### My profile and account security

`/dashboard/profile` exposes personal details, an optional company profile, address and contact preferences. Company names/GSTINs use the existing incomplete bidder/business-profile record; they are self-declared, not institution verification. Reviewed/approved company fields are read-only and server-protected. Profile edits use `updatedAt` and session-version checks, with a separate conditional update for company-review races. Email changes still require OTP; contact-phone edits clear its prior verification. Mobile OTP is unavailable and the UI says so.

The change-password form and API share validation, require confirmation, keep confirmation masked without an eye button, protect against repeated submissions and concurrent resets, consume outstanding email challenges, and revoke other device sessions. The current device receives a replacement session only on success. Failed saves keep form contents. When another account action changes the profile version, the user can explicitly reload saved details rather than silently losing edits.

Institution access uses the same authentication system: `/financial-institution-login` already redirects to the common sign-in page. A company profile is not an institution membership and grants no roles or access to lender records. A future institution portal needs independently approved, institution-scoped memberships and invitations before exposing any bank's records; the CityAuction admin area remains restricted to platform admins. No institution portal or automatic bank access is enabled by profile editing.
