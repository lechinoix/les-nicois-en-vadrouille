# Les Nicois en Vadrouille

A Next.js App Router blog with TypeScript, Neon Postgres, Drizzle, Milkdown, Cloudinary, and Google Photos Picker.

## Development

Use Node 24. Run `npm ci`, copy `.env.example` to `.env.local`, configure the values, then run `npm run dev`.

Next loads `.env.local`; command-line tools need exported variables or `node --env-file=.env.local --import tsx scripts/<script>.ts`. Never commit credentials. Apply the checked-in database schema with `npm run db:migrate`. Drizzle schema history is retained; no legacy content importer or export endpoint is included in the app.

## Editor and drafts

Generate a scrypt password hash with `node scripts/password-hash.mjs` (password on stdin). Configure `EDITOR_PASSWORD_HASH`, a random `SESSION_SECRET` of at least 32 characters, and the exact `APP_ORIGIN`. Editor sessions are signed, HttpOnly, SameSite=Lax, and Secure in production. Login throttling is shared in Postgres. Mutations require an editor session and a matching Origin header.

Draft edits autosave to Neon while online. Local recovery copies retain unsaved edits and their base revision. There are no browser-draft import or local/Neon export controls.

`drafts` holds private working copies, `publications` holds public snapshots, and `published_snapshots` retains publication history. Each save checks the expected revision atomically. Two-tab conflicts return 409 and preserve the current work. Compare the server content, explicitly keep your edits on the newer revision and save, or confirm replacing them with the server version. The save queue serializes requests and retains edits made during a save. Publishing invalidates the public content cache; draft-only saves do not change the public blog.

## Email accounts

Public email/password accounts use Neon's Managed Better Auth through `@neon/auth`. `/auth/sign-up` and `/auth/sign-in` provide the forms; `/account` and `/api/account` verify sessions on the server. Email verification codes are supported when enabled on the branch. These accounts do not grant access to the shared-password editor or private drafts.

`neon.ts` declares Managed Auth. Configure the branch's `NEON_AUTH_BASE_URL` and a separate random `NEON_AUTH_COOKIE_SECRET` of at least 32 characters. Add the frontend origin to Neon Auth's trusted domains.

With a local Next server running, `npm run auth:test:live` explicitly creates or reuses a real test account, checks the current user through SDK and server API, and tests sign-in/out, session restoration, wrong-password errors, and editor isolation. Credentials and receipts stay in ignored `.auth-test/` files with mode 0600. Set `AUTH_TEST_EMAIL` to a mailbox you control before the first run if verification is required; the script never disables verification. `AUTH_TEST_ORIGIN` defaults to `http://localhost:3000` and accepts only local servers. This test is not part of `npm test`.

## Deployment

Keep Vercel's Root Directory blank. `vercel.json` selects Next.js and the npm build commands; `package.json` and `.nvmrc` select Node 24. Set the variables from `.env.example` for Production. Merges to Vercel's tracked production branch deploy the root application; environment changes take effect in a new deployment.

The application no longer uses `EDITOR_WRITES_ENABLED`, `MIGRATION_MAINTENANCE`, or `MIGRATION_MAINTENANCE_TOKEN`. Stale values do not block public pages, saves, or Google Photos authorization. Editor authentication and same-origin protection remain mandatory.

## Photos

Enable Google Photos Picker API and create an OAuth Web application client with callback `${APP_ORIGIN}/api/photos/google/callback`. Add the editor's Google account as a test user while the consent app is in Testing. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Only the `photospicker.mediaitems.readonly` scope is requested.

Connect Google from the editor, create a selection, open the official Picker, select photos, then import. Authorization opens a separate tab so the draft remains open. Google tokens are encrypted in HttpOnly cookies bound to the editor session and used only for importing. Selected image bytes are retrieved server-side and uploaded immediately to Cloudinary. Viewing published photos requires no Google authorization.

Photo imports are deduplicated in Postgres and by deterministic Cloudinary asset IDs. The browser keeps the pagination cursor for the current selection. After a page reload, resume replays the selection using the already imported assets rather than uploading duplicates. An expired Google session requires authorization again. Finish/cancel clears the Picker session and Google authorization. Use one active selection per browser profile.

Local JPEG/PNG/WebP/AVIF uploads are also supported (4 MB per request). Imported images are decoded, rotated, and resized to at most 2,560 pixels. Videos are skipped. Cloudinary serves responsive automatic-quality/format images directly; originals remain with their owner. `npm run usage` checks Cloudinary usage.

## Tests

`npm test` runs model/save-queue tests. `npm run check` runs TypeScript; `npm run build` creates the production build.

Database tests require `TEST_DATABASE_DISPOSABLE=true` and a `DATABASE_URL` pointing to a disposable database with the schema applied. Never use production: these tests create synthetic articles. After a build, also set `TEST_PRODUCTION_HTTP=true` to exercise the production server's authentication, private drafts, revision conflicts, repeated publishing, and cache invalidation. The Google authorization-start/cancellation regression uses a local server and fake OAuth credentials without calling Google or writing to a database.

Real Google consent/selection and visual layout still need interactive checks; HTTP tests do not substitute for them.
