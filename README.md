# Les Nicois en Vadrouille

A Next.js App Router blog with TypeScript, Neon Postgres, Drizzle, Milkdown, Cloudinary, and Google Photos Picker.

## Development

Use Node 24. Run `npm ci`, copy `.env.example` to `.env.local`, configure the values, then run `npm run dev`.

Next loads `.env.local`; command-line tools need exported variables or `node --env-file=.env.local --import tsx scripts/<script>.ts`. Never commit credentials. Apply the checked-in database schema with `npm run db:migrate`. Drizzle schema history is retained; no legacy content importer or export endpoint is included in the app.

## Editor and drafts

Generate a scrypt password hash with `node scripts/password-hash.mjs` (password on stdin). Configure `EDITOR_PASSWORD_HASH`, a random `SESSION_SECRET` of at least 32 characters, and the exact `APP_ORIGIN`. Editor sessions are signed, HttpOnly, SameSite=Lax, and Secure in production. Login throttling is shared in Postgres. Mutations require an editor session and a matching Origin header.

Draft edits autosave directly to Neon every two seconds while online. There are no localStorage draft copies, browser-draft imports, or local/Neon export controls. Changes waiting for a successful save exist only in the open page's memory. Offline or failed requests retain those edits and retry; keep the page open until it reports success. Closing or refreshing before a successful save can lose unsaved changes, so the editor warns before leaving.

`drafts` holds private working copies, `publications` holds public snapshots, and `published_snapshots` retains publication history. Each save checks the expected revision atomically. Two-tab conflicts return 409 and preserve the current in-memory work. Compare the server content, explicitly keep your edits on the newer revision and save, or confirm replacing them with the server version. The save queue serializes requests and retains edits made during a save. Publishing invalidates the public content cache; draft-only saves do not change the public blog.

## UI components

### Editor choices and deployment

Participants, places, and periods use multi-selectors backed by the private `editor_options` table. Editors manage the three catalogs at `/editor/options` (also linked from the draft list). Choices can be added, renamed, archived, and reactivated. Renames and archives do not rewrite existing articles: old selected labels remain visible and can be removed explicitly. Returning from the management tab refreshes the choices without replacing unsaved article edits.

Before deploying this version, apply `0001_legal_mikhail_rasputin.sql` and `0002_soft_blob.sql` through the normal Drizzle migrator against the intended database. With a private environment file containing its direct `DATABASE_URL`:

```sh
node --env-file=.env.local --import tsx scripts/db-migrate.ts
```

These additive migrations create the catalog, seed distinct nonempty labels from both drafts and publications, and create the private `photo_imports` progress table. They do not change article content or revisions; subsequent migration runs are no-ops. Apply it before merging/deploying the editor changes, because the new editor reads this table. Existing public pages and the previous application remain compatible with the added tables.

The editor date field uses the device's native calendar picker and saves `YYYY-MM-DD` dates. A visible photo legend explains insertion, cover selection, reordering, and removal. When no cover is stored, article pages, listing cards, and the editor use the first gallery photo at the center position. Explicit covers retain their position. The editor uses shrinking grid columns and a wrapping photo grid to fit narrow screens without horizontal page scrolling.

The editor uses the official [shadcn/ui Base UI components](https://ui.shadcn.com/docs/components) in `components/ui`, with Tailwind v4 and Lucide. `components.json` records the style and aliases. The blog styles live in `app/blog.css`; Tailwind preflight is omitted to preserve the public design. Roboto is self-hosted through Fontsource, alongside the original Abadi font and article pictograms.

The header uses Base UI Menu for outside-click dismissal, Escape, keyboard navigation, and closing after selection. Its DOM regression test runs with `npm test`.

## Email accounts

Public email/password accounts use Neon's Managed Better Auth through `@neon/auth`. `/auth/sign-up` and `/auth/sign-in` provide the forms; `/account` and `/api/account` verify sessions on the server. Email verification codes are supported when enabled on the branch. These accounts do not grant access to the shared-password editor or private drafts.

`neon.ts` declares Managed Auth. Configure the branch's `NEON_AUTH_BASE_URL` and a separate random `NEON_AUTH_COOKIE_SECRET` of at least 32 characters. Add the frontend origin to Neon Auth's trusted domains.

With a local Next server running, `npm run auth:test:live` explicitly creates or reuses a real test account, checks the current user through SDK and server API, and tests sign-in/out, session restoration, wrong-password errors, and editor isolation. Credentials and receipts stay in ignored `.auth-test/` files with mode 0600. Set `AUTH_TEST_EMAIL` to a mailbox you control before the first run if verification is required; the script never disables verification. `AUTH_TEST_ORIGIN` defaults to `http://localhost:3000` and accepts only local servers. This test is not part of `npm test`.

## Deployment

Keep Vercel's Root Directory blank. `vercel.json` selects Next.js and the npm build commands; `package.json` and `.nvmrc` select Node 24. Set the variables from `.env.example` for Production. Merges to Vercel's tracked production branch deploy the root application; environment changes take effect in a new deployment.

The application no longer uses `EDITOR_WRITES_ENABLED`, `MIGRATION_MAINTENANCE`, or `MIGRATION_MAINTENANCE_TOKEN`. Stale values do not block public pages, saves, or Google Photos authorization. Editor authentication and same-origin protection remain mandatory.

## Photos

Enable Google Photos Picker API and create an OAuth Web application client with callback `${APP_ORIGIN}/api/photos/google/callback`. Add the editor's Google account as a test user while the consent app is in Testing. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Only the `photospicker.mediaitems.readonly` scope is requested.

Choose **Ajouter des photos → Google Photos**. The editor saves the draft before opening a separate tab, automatically requests authorization if needed, and continues directly to the Picker. The [official Picker cannot be embedded in an iframe](https://developers.google.com/photos/picker/guides/sessions); the app uses a shadcn bottom sheet for progress and `/autoclose` on the Google URL. If a popup is blocked, a normal link opens it. If Google does not close its tab on mobile, return to the editor tab manually. Cancellation and authorization failures redirect to the exact article. The configured OAuth callback URL is unchanged.

The drawer detects completed selections and imports one photo per request, observing Google's polling interval and timeout. Cursor, photo metadata, skipped-video counts, and status persist in `photo_imports`, scoped to the article and the current editor login. Reopening the drawer or reloading the editor resumes that import; signing out or expiring the editor login starts a new scope. Tokens are encrypted server-side in the job and an HttpOnly cookie, never sent to the client. Valid authorization is reused for later imports until it expires. No refresh token is requested.

Imported bytes go immediately to Cloudinary. Deterministic asset IDs deduplicate retries. Each batch is added through the editor's existing save queue; newer typing and revision conflicts are preserved. The drawer closes only after the draft save succeeds and the server verifies that every imported photo is present. Finish/cancel first saves any completed batches, then removes the Google session when possible and clears the job token. If a Google selection expires, finish that import and choose again; already saved photos remain. An expired authorization can be renewed while retaining the cursor. Viewing published photos requires no Google authorization.

Local JPEG/PNG/WebP/AVIF uploads are also supported (4 MB per request). Imported images are decoded, rotated, and resized to at most 2,560 pixels. Videos are skipped. Cloudinary serves responsive automatic-quality/format images directly; originals remain with their owner. `npm run usage` checks Cloudinary usage.

## Tests

`npm test` runs model/save-queue tests. `npm run check` runs TypeScript; `npm run build` creates the production build.

Database tests require `TEST_DATABASE_DISPOSABLE=true` and a `DATABASE_URL` pointing to a disposable database with the schema applied. Never use production: these tests create synthetic articles. After a build, also set `TEST_PRODUCTION_HTTP=true` to exercise the production server's authentication, private drafts, revision conflicts, repeated publishing, and cache invalidation. The Google authorization-start/cancellation regression uses a local server, the disposable database, and fake OAuth credentials. Import tests mock Google responses and seed cached image metadata; they verify authorization replay protection, resumable cursors, concurrent requests, expired authorization, deduplication, and draft acknowledgement without a real Google account or Cloudinary upload. A DOM interaction test verifies the drawer stays open after a save conflict and closes after a successful retry.

Real Google consent/selection and visual layout still need interactive checks; HTTP tests do not substitute for them.
