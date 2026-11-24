# S3 → Neon: migration with downtime

The S3 → Neon data migration completed on **2026-11-24** using `hostingMode: "unchanged"`. Legacy S3 content writes remain frozen. The root Next.js application has been merged; production activation needs a new deployment with the imported environment variables.

## Verified migration result

- Both frozen S3 documents contain 127 articles. Production Neon now has 127 publications, 127 matching private working copies, and 127 initial snapshots, all at revision 1. Full field comparisons passed with no unexplained discrepancies.
- Preparation recorded 675 legacy normalizations and 92 Google-to-Cloudinary URL mappings. Existing Cloudinary assets were retained. One four-frame GIF was uploaded without JPEG conversion and verified byte-for-byte to preserve its animation.
- A complete isolated rehearsal passed. Production dry-run and completed-snapshot rerun checks left all content rows unchanged; the migration ledger contains one completed import.
- The local production build passed 272 route/privacy checks against imported data. All 1,536 unique gallery and migrated-image URLs returned public image responses without Google authorization. These are not yet Vercel production or visual-layout checks.
- Frozen exports, source photo bytes, checksums, repair audits, photo mappings, the original S3 policy, and a verified Neon export are retained in a durable backup directory outside the worktree. Private receipts and the environment handoff are also in ignored `migration-data/`. No browser-only drafts needed importing.

## Production activation still required

The public origin is `https://www.lesnicoisenvadrouille.fr`. The private `migration-data/vercel-production.env` handoff includes Neon, managed Auth, Cloudinary, the editor password hash/session secret, and Google OAuth credentials. Import it for Vercel **Production**. It deliberately sets `MIGRATION_MAINTENANCE=true` and `EDITOR_WRITES_ENABLED=false`.

Environment changes require a new deployment. The existing GitHub integration deploys merges to `main`, so a merge can create that deployment when the dashboard's manual Redeploy action is unavailable. Keep credentials out of Git. A successful build alone does not establish that the runtime environment or imported content works.

Verify the deployment behind its private maintenance gate, including article reads, legacy URLs, private draft protection, and managed Auth sessions. Then complete editor/Google consent and import checks and remove maintenance deliberately. Keep the S3 write freeze in place. New blog edits make Neon authoritative; do not resume the old S3 writer.

The procedure below remains the recovery/reference workflow. Do not treat the populated production database as a fresh empty import target.

The staged runner now automates these steps; see [AUTOMATION.md](AUTOMATION.md) for secure credential inputs, commands and checkpoints. This page also documents the underlying manual procedure.

The website may stay offline for as long as needed. Use one maintenance window and one target Neon database. A separate Neon rehearsal, a parallel live site, and a coordinated traffic switch are not required. Keep the site offline whenever validation fails; there is no deadline to reopen it.

The workflow is: **export browser drafts → stop the old site and its writers → save S3 → fix and validate the data → import and verify → launch Next.js**.

The existing scripts support this workflow. Keep their checksum checks, transactional import, conflict detection and safe reruns: these protect content even when availability does not matter. Do not run synthetic database tests against the target Neon database.

## 1. Export drafts, then take the old site offline

Before replacing the old site, open it in **every browser/profile used for editing** and run `scripts/export-legacy-drafts.js` in the browser console. Save the resulting JSON files outside the worktree. Browser-local drafts are not in S3, and removing the old editor may make exporting them harder.

Put the public site into maintenance mode or take its deployment offline. Stop publishing through every old deployment/alias as well, including already-open editor tabs:

- Stop the old deployment's publishing through AWS permissions and verify its write requests are rejected. A maintenance page or replacing the source code alone does not disable old API URLs or already-open tabs.
- Wait for in-flight publishing to finish, then revoke the legacy application's S3 write/delete permissions. Retain read-only export access and the historical S3 objects/versions.
- Keep `EDITOR_WRITES_ENABLED=false` on the new app throughout article import and verification.

Do not delete the old deployment or its recovery material yet. The old source remains in Git history. The runner’s `freeze` stage installs the targeted S3 write deny; in hosting automation mode it also pauses Vercel. The standalone snapshot/import commands do not freeze writers.

## 2. Save the frozen S3 source

Run commands from the repository root with Node 24 and dependencies installed (`npm ci`). Next.js loads `.env.local` itself; CLI commands need exported environment variables, or can be invoked with `node --env-file=.env.local --import tsx scripts/<script>.ts`.

```sh
mkdir -p migration-data
npm run snapshot -- migration-data/frozen-001 --publishing-frozen --public
```

`--public` uses the existing publicly readable S3 objects. Omit it when using read-only AWS credentials. `--publishing-frozen` records your assertion that writers have stopped; it does not stop them for you. The destination directory must be new.

This saves both JSON documents and a manifest containing object identifiers, timestamps, checksums and counts. Copy the entire directory to a separate backup location. Keep the existing S3 history too. Every migration attempt uses these saved files, not changing `head.json` objects. There is no routine rehearsal export followed by a second final export.

## 3. Resolve source problems and validate

```sh
npm run migrate:s3 -- migration-data/frozen-001
```

This is a dry run: no database connection, uploads or writes. Require a clean report before importing. It checks IDs, required fields, metadata/content joins, photo information, cover references and unresolved image URLs. It does not discard incomplete articles.

The earlier captured snapshot contained **127 articles and 1,444 gallery photos**, with **775 findings across 74 articles**. These included missing metadata, null image formats and Google-hosted images embedded in Markdown. Those are data-cleanup tasks; allowing downtime does not resolve them. Run validation against the newly frozen snapshot to get the current report.

The runner’s `prepare` stage can make the documented, audited legacy normalizations in a derived snapshot while preserving raw exports; it never repairs S3 in place. For other metadata repairs, keep the original export unchanged and record the evidence and changes. If source records must be corrected, do so deliberately through separate administrative access while the legacy app remains unable to write, then capture a new frozen snapshot directory and back it up. Use that corrected snapshot consistently in the remaining commands. Do not edit saved files and bypass their checksum failures, invent missing values, or omit failing articles.

For photos:

- Keep valid existing Cloudinary assets unchanged.
- Retrieve remaining originals through the official Google Photos Picker, an owner export, or local originals. Do not scrape shared albums.
- If needed, prepare a JSON list of `{ "oldUrl": "...", "file": "/path/to/original.jpg" }` entries, then run:

  ```sh
  npm run photos:prepare -- migration-data/photos.json migration-data/photo-map.json
  npm run migrate:s3 -- migration-data/frozen-001 --mapping migration-data/photo-map.json
  ```

Photo preparation uploads separately and can resume after interruption. The recorded map preserves article photo IDs, order and cover positioning; only mapped image references/dimensions change. Exact mapped URLs in Markdown are replaced without changing the surrounding text. Keep the map with the backup. A photo map does not repair unrelated missing metadata.

## 4. Import directly into the target Neon database

Create one empty Neon database and configure its `DATABASE_URL`. There is no requirement to provision a separate rehearsal database. Keep the new editor disabled.

```sh
npm run db:migrate
npm run migrate:s3 -- migration-data/frozen-001 --apply --verify --production
```

If photo preparation was needed, use this import command instead:

```sh
npm run migrate:s3 -- migration-data/frozen-001 --apply --verify --production --mapping migration-data/photo-map.json
```

Here `--production` selects the intended target workflow and requires a manifest marked as frozen; it does not deploy the site. `MIGRATION_DATABASE_ROLE=rehearsal` is not needed.

The importer validates first, then imports published articles and matching private working copies at revision 1 in one transaction. An error or conflicting existing article aborts the import without partial article writes. Repeating a completed snapshot with the same photo map is a no-op; it never overwrites newer edits.

The same command then verifies counts, IDs, normalized fields, Markdown, photo order, covers, working copies and initial published snapshots. Require `verification: PASSED` and exit code 0. Verification runs after the import transaction: if it fails, keep the site offline and investigate; do not assume the committed data was rolled back. Do not enable editing or import browser drafts until this baseline comparison passes.

## 5. Check the replacement, then reopen

While the public site remains offline or protected:

1. Keep Vercel's Root Directory at the repository root (blank). The checked-in `vercel.json` selects the Next.js preset and npm build commands. Add the production environment variables from `.env.example`, including Neon Auth's URL and cookie secret. Deploy after article import so it starts with the imported content. Set the final `APP_ORIGIN`, password hash, session secret, Neon and Cloudinary credentials, Neon Auth trusted origin, and Google OAuth callback `${APP_ORIGIN}/api/photos/google/callback`.
2. Review representative articles and large galleries, old article URLs, search, sport filters, cover alignment, topo links, CV, and mobile layout. Check published photos without Google authorization. The retained S3 export and old source remain available for comparison; a live old site is unnecessary.
3. Check actual provider plans and usage, including `npm run usage` for Cloudinary. Keep free plans without automatic upgrades and confirm enough headroom. Downtime does not change the budget requirement.
4. Enable `EDITOR_WRITES_ENABLED=true` while public maintenance/access protection is still in place. Import the exported browser drafts through the new editor; they become separate private copies. Test saving, conflict recovery, publishing/cache invalidation, local uploads, and Google authorization/cancellation. From the first new Neon write, retain Neon as the source of truth, even if the site has not reopened yet.
5. Remove maintenance/access protection and serve Next.js on the domain. Keep legacy S3 writes revoked. Download an authenticated `/api/export` backup and store it privately with the migration material.

There is no availability-sensitive handover: if any check fails, leave maintenance in place and fix it. Rehearsal deployments remain optional if useful, not a prerequisite.

## Recovery

**Before any new Neon writes beyond the initial article import:** the frozen S3 backup can restore the old application if needed. Restore publishing only deliberately and verify the restored pair of source files first.

**After new Neon writes, including browser-draft imports or editor tests:** keep Neon authoritative. Leave the site offline and fix the new app, or use a compatible earlier Next.js version. Export Neon before maintenance. Returning to the Svelte/S3 writer without a verified reverse migration would lose access to new content.

Never drop or reset a database containing new work merely to rerun the original import. Unlimited downtime removes the need for a fast rollback, not the need to retain data.
