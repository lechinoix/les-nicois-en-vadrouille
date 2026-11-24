# Les Nicois en Vadrouille

A Next.js App Router blog with TypeScript, Neon Postgres, Drizzle, Milkdown, Cloudinary, and Google Photos Picker.

## Development

Use Node 24. Run `npm ci`, copy `.env.example` to `.env.local`, configure the values, then run `npm run dev`.

Next loads `.env.local`; command-line tools need exported variables or `node --env-file=.env.local --import tsx scripts/<script>.ts`. Never commit credentials. Apply the checked-in database schema locally with `npm run db:migrate:local`. Use `npm run db:migrate` when the database URL is already exported (including CI). Drizzle schema history is retained; no legacy content importer or export endpoint is included in the app.

## Editor and drafts

Generate a scrypt password hash with `node scripts/password-hash.mjs` (password on stdin). Configure `EDITOR_PASSWORD_HASH`, a random `SESSION_SECRET` of at least 32 characters, and the exact `APP_ORIGIN`. Editor sessions are signed, HttpOnly, SameSite=Lax, and Secure in production. Login throttling is shared in Postgres. Mutations require an editor session and a matching Origin header.

Draft edits autosave directly to Neon every two seconds while online. There are no localStorage draft copies, browser-draft imports, or local/Neon export controls. Changes waiting for a successful save exist only in the open page's memory. Offline or failed requests retain those edits and retry; keep the page open until it reports success. Closing or refreshing before a successful save can lose unsaved changes, so the editor warns before leaving.

`drafts` holds private working copies, `publications` holds public snapshots, and `published_snapshots` retains publication history. Each save checks the expected revision atomically. Two-tab conflicts return 409 and preserve the current in-memory work. Compare the server content, explicitly keep your edits on the newer revision and save, or confirm replacing them with the server version. The save queue serializes requests and retains edits made during a save. Publishing invalidates the public content cache; draft-only saves do not change the public blog.

## UI components

### Editor choices and deployment

Participants, places, periods, and sports use multi-selectors backed by the private `editor_options` table. Editors manage the four catalogs at `/editor/options` (also linked from the draft list). Choices can be added, renamed, archived, and reactivated. Renames and archives do not rewrite existing articles: old selected labels remain visible and can be removed explicitly. Sports use immutable codes, preserving article selections and `/sport/<code>` URLs when a display name is renamed. Sport names, public filters, navigation, and category pages read the cached database catalog; sport edits invalidate that cache. Known sport covers remain presentation defaults, and new sports use a published article cover when available. Returning from the management tab refreshes the choices without replacing unsaved article edits.

The checked-in migrations create the catalog, seed distinct nonempty labels from both drafts and publications, create the private `photo_imports` progress table, and seed the sport catalog with existing codes and French labels. Migration `0003` also includes any additional sport codes found in drafts/publications. It recreates the enum inside the migration transaction so PostgreSQL can use the new sports value immediately. They do not change article content or revisions; subsequent migration runs are no-ops. Production deployments apply pending migrations automatically before building the application, as described below.

The editor date field uses the device's native calendar picker and saves `YYYY-MM-DD` dates. A visible photo legend explains insertion, cover selection, reordering, and removal. When no cover is stored, article pages, listing cards, and the editor use the first gallery photo at the center position. Explicit covers retain their position. The editor uses shrinking grid columns and a wrapping photo grid to fit narrow screens without horizontal page scrolling.

The editor uses the official [shadcn/ui Base UI components](https://ui.shadcn.com/docs/components) in `components/ui`, with Tailwind v4 and Lucide. `components.json` records the style and aliases. The blog styles live in `app/blog.css`; Tailwind preflight is omitted to preserve the public design. Roboto is self-hosted through Fontsource, alongside the original Abadi font and article pictograms.

The header uses Base UI Menu for outside-click dismissal, Escape, keyboard navigation, and closing after selection. Its DOM regression test runs with `npm test`.

## Email accounts

Public email/password accounts use Neon's Managed Better Auth through `@neon/auth`. `/auth/sign-up` and `/auth/sign-in` provide the forms; `/account` and `/api/account` verify sessions on the server. Email verification codes are supported when enabled on the branch. These accounts do not grant access to the shared-password editor or private drafts.

`neon.ts` declares Managed Auth. Configure the branch's `NEON_AUTH_BASE_URL` and a separate random `NEON_AUTH_COOKIE_SECRET` of at least 32 characters. Add the frontend origin to Neon Auth's trusted domains.

With a local Next server running, `npm run auth:test:live` explicitly creates or reuses a real test account, checks the current user through SDK and server API, and tests sign-in/out, session restoration, wrong-password errors, and editor isolation. Credentials and receipts stay in ignored `.auth-test/` files with mode 0600. Set `AUTH_TEST_EMAIL` to a mailbox you control before the first run if verification is required; the script never disables verification. `AUTH_TEST_ORIGIN` defaults to `http://localhost:3000` and accepts only local servers. This test is not part of `npm test`.

## Deployment

Keep Vercel's Root Directory blank. `vercel.json` selects Next.js and the npm build commands; `package.json` and `.nvmrc` select Node 24. Set the variables from `.env.example` for Production. Merges to Vercel's tracked production branch deploy the root application; environment changes take effect in a new deployment.

### Automatic database migrations

`vercel.json` runs `npm run build:vercel`. For `VERCEL_ENV=production`, this runs `npm run db:migrate` and then `npm run build`, in order. A failed migration stops the deployment. Preview/development builds skip migrations; ordinary `npm run build` also leaves the database alone. Vercel must have **Enable access to System Environment Variables** enabled so the build can identify its environment; missing or unknown environments stop the build. Preview databases must have the appropriate schema applied separately.

The existing Vercel `DATABASE_URL` is sufficient; no GitHub production secret, Vercel token, or paid integration is needed. Migrations automatically use the direct equivalent of a Neon `-pooler` endpoint. If the application role cannot create/alter tables, set optional `MIGRATION_DATABASE_URL` to a DDL-capable role for the **same database**. Other PostgreSQL hosts are used unchanged and should be direct connections. URLs, SQL text, and row contents are not printed in migration failure logs.

The runner reads Drizzle's checked-in SQL files and preserves the existing `drizzle.__drizzle_migrations` journal. A transaction-scoped advisory lock serializes deployments before reading that journal; all pending SQL and journal entries commit together. Already applied files are skipped. Changed/missing migration history stops the run rather than replaying or overwriting it. A failed transaction can be retried after the underlying issue is fixed. Lock waits are bounded to 60 seconds and each statement to 120 seconds.

For future schema changes, update `db/schema.ts`, run `npm run db:generate`, review and commit the generated SQL and metadata, then open a PR. Do not edit already applied migrations or use schema push in production. Keep deployment migrations compatible with the currently running application: if migrations succeed but the subsequent application build fails, the schema changes remain applied. Application rollback does not reverse database migrations.

GitHub Actions applies migrations twice to an empty PostgreSQL service, type-checks, builds, and runs the database/HTTP tests on pull requests and `main`. Migration tests also check concurrency, rollback, Drizzle journal compatibility, and history mismatch. The workflow uses only a disposable local database and no production secrets. GitHub CI and Vercel deployments run independently; production migration ordering is enforced inside the Vercel build itself.

This setup introduces no paid service. [Standard GitHub runners are free for this public repository](https://docs.github.com/en/billing/concepts/product-billing/github-actions); the workflow does not upload artifacts or caches. Production migrations use a little of the existing [Neon Free compute allowance](https://neon.com/pricing) and Vercel build allowance. Staying within those allowances keeps the target at €0; no plan upgrades are enabled by these changes.

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

Migration integration tests additionally require `TEST_MIGRATIONS_DATABASE_URL` pointing to a **loopback PostgreSQL server** with `CREATEDB` rights. They create and remove uniquely named temporary databases and refuse remote hosts. CI supplies this automatically through its PostgreSQL service.

Real Google consent/selection and visual layout still need interactive checks; HTTP tests do not substitute for them.
