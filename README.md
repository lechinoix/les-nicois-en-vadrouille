# Next.js replacement

The repository root is the Next.js App Router application. It replaces the old Svelte app; the previous implementation remains available in Git history. The migration allows unlimited downtime: stop the old site's writers, import and verify the saved S3 data, then deploy this application. No production content is changed by checking out this branch.

Uses Node 24 and npm. Run these commands from the repository root:

```sh
npm ci
cp .env.example .env.local
npm run dev
npm run check
npm test
npm run build
```

Next loads `.env.local`; command-line tools require exported environment variables (or `node --env-file=.env.local --import tsx scripts/<script>.ts`). Never commit credentials or snapshot exports. Generate a scrypt password hash with `node scripts/password-hash.mjs`, supplying the password on stdin; set a random `SESSION_SECRET` of at least 32 characters. Sessions are signed, HttpOnly, SameSite=Lax and Secure in production. Change the session secret to revoke all sessions. Login throttling is shared in Postgres (30 attempts per 15 minutes). Mutation routes require same-origin requests and authenticated sessions. `EDITOR_WRITES_ENABLED=false` is the default.

Apply the checked-in Drizzle SQL with `npm run db:migrate`. The database stores JSON metadata and Cloudinary references, never image bytes. `drafts` is the working copy; `publications` holds the current public snapshot; `published_snapshots` retains publication history. All updates check the revision under a transaction-scoped article lock. New articles expect revision 0; imported articles begin at 1. A conflict returns 409 with the current private draft. Browser recovery copies retain the base revision. The conflict UI offers export, comparison and explicit reconciliation. A save queue layers edits made during a request over the canonical response; it never blindly replaces newer typing. A lost successful response may surface as a recoverable conflict on retry.

Public content uses the Next data cache for one hour; publish immediately expires the `publications` tag and affected route tree. Public route HTML is rendered per request against that cache. Editor routes and API responses are private and uncached. Public queries only read `publications`. Markdown is rendered without executable raw HTML.

## Email accounts (Neon Managed Better Auth)

`/auth/sign-up` and `/auth/sign-in` use `@neon/auth`; `/account` and `/api/account` check the session on the server. Email verification codes are supported when enabled on the branch. Accounts do not grant editor privileges: `/login`, the editor APIs, drafts and exports still require the separate shared editor password.

From the repository root, authenticate with `neon login`, then link the requested project:

```sh
neon init -y --project-id nameless-moon-46656370 --branch production --services postgres,auth
neon deploy
```

`neon.ts` declares Managed Auth. Deploy pulls the branch's `DATABASE_URL` and `NEON_AUTH_BASE_URL` into `.env.local` (or existing `.env`). Add a separately generated `NEON_AUTH_COOKIE_SECRET` of at least 32 random characters. Never commit these files. Auth requires an AWS project without IP Allow or Private Networking; keep any existing protections in place. No Better Auth database adapter or application migration is needed.

The migration maintenance proxy guards the application during cutover. Account protection is enforced inside the page and API handler; public blog pages remain public. Configure trusted origins for the deployed frontend in Neon before launch.

## Vercel deployment

Keep Vercel's Root Directory at the repository root (blank in the dashboard). `vercel.json` selects Next.js and overrides the old framework, install, build, development, and output settings. `package.json` and `.nvmrc` select Node 24. There is no nested application directory or Svelte build.

Set the production environment variables listed in `.env.example` in Vercel; local `.env.local` is never committed. The Neon Auth URL and cookie secret are separate from the editor password/session secret. Add the final website origin to Neon Auth's trusted domains and register the Google callback. Finish and verify the S3 article import before switching production to this application. Keep `EDITOR_WRITES_ENABLED=false` until the migration is verified. Merging into Vercel's tracked production branch then deploys the root application.

With the configured local Next server running, run `npm run auth:test:live`. This explicitly creates a real test account in the configured Neon Auth service, reads it back via SDK and server API, tests session restoration, wrong-password errors, sign-out/sign-in, and verifies it cannot access the editor or exports. It retains one account per Auth endpoint for repeat runs; its generated password and receipt stay in ignored `migration-data/auth-test/` files with mode 0600. The default email is unique under `example.com`; set `AUTH_TEST_EMAIL` to a mailbox you control before the first run if email verification is required. The script never disables verification. `AUTH_TEST_ORIGIN` defaults to `http://localhost:3000` and accepts only local servers. This live test does not run with `npm test`.

## Photos

Enable Google Photos Picker API and configure an OAuth web client with the exact callback `${APP_ORIGIN}/api/photos/google/callback`; add permitted test users while the consent app is in testing. Only `photospicker.mediaitems.readonly` is requested. Google login is initiated from the editor in a separate tab, without navigating away from unsaved work. Credentials are kept in an encrypted HttpOnly cookie bound to the editor session, for the import only. No Google login is used to view the blog.

Connect Google, create a selection, open its official Picker link, complete selection, then Import / resume. Import processes one selected image per request, paginates and persists the cursor by selection ID. Each image is immediately fetched with the bearer token and uploaded to Cloudinary. Successful uploads are deduplicated using a stable source hash in Postgres and a deterministic Cloudinary public ID with `overwrite:false`, including recovery after a crash between upload and database insertion. Expired sessions require reauthorization/reselection; successful assets remain reusable. Finish / cancel cleans up the Picker session and local authorization. Do not run multiple selections concurrently in the same browser profile (one active Google import session).

Local JPEG/PNG/WebP/AVIF files are a fallback (4 MB per request, below Vercel's request limit). Both paths decode/rotate images and resize to a maximum dimension of 2,560 before upload. Videos are skipped explicitly. Originals remain with the owner. Cloudinary serves responsive `f_auto,q_auto` images directly, without Vercel image transformations. Existing Cloudinary assets are never uploaded by article migration.

Use [AUTOMATION.md](AUTOMATION.md) to run the staged migration with secure credentials. See [MIGRATION.md](MIGRATION.md) for the simplified maintenance-window migration. It uses one target Neon database; a separate rehearsal is optional.

## Validation

`npm test` runs data-validation and save-queue tests. Database tests only run when `TEST_DATABASE_DISPOSABLE=true` and `DATABASE_URL` points at a disposable Postgres database whose schema has been migrated. They create synthetic records. Never enable this flag for production. Tests cover two-tab conflicts, publication isolation, repeat publishing, independent articles, migration no-op reruns preserving edits, checksum tampering, and rollback after a mid-import target conflict.

Set `TEST_PRODUCTION_HTTP=true` after `npm run build` to also test a temporary production server on port 33179 against the disposable database, including authentication, draft privacy, conflicts, publication cache invalidation and export.

External acceptance gates remain: frozen S3 export and source-data cleanup; verified import into the target Neon database; real Google consent, cancellation and expiry; Cloudinary usage; visual checks on mobile and desktop; and Vercel production cache behavior. A successful local build is not evidence these external gates have passed.
