# Running the migration for the owner

Run `npm run migration:run -- <stage> migration.config.json` from the repository root to drive the maintenance-window migration. Each command records progress and returns; the agent can execute the stages with secure credentials. No stage silently unfreezes S3 or resets the target database. The deployment allowlist uses root-relative paths and includes `vercel.json`; hosting automation selects the repository root, without a nested `next` directory.

Copy `migration.config.example.json` to the ignored `migration.config.json`. Fill in the existing Vercel project/team IDs, the exact HTTPS blog origin, and backup location. `browserDrafts` starts as `"unconfirmed"`: change it to `"none"` only after the owner confirms, or provide an array of local exported JSON file paths. Exports must be collected from every editing browser/profile before shutdown. Select a durable backup directory outside the worktree; `/tmp` in the example is for local testing, not long-term recovery. Copy or mount it onto durable storage before operating in production.

## Current run: leave Vercel unchanged

The owner has confirmed there are no browser-only drafts and identified Neon project `nameless-moon-46656370`. Vercel access is unavailable, so the current ignored `migration.config.json` uses `hostingMode: "unchanged"` and `browserDrafts: "none"`.

In this mode, `preflight`, `freeze`, `capture`, `prepare`, `import`, `status` and `export` require **no Vercel token, project ID or team ID**. The `freeze` stage installs/verifies only the S3 content-write deny. The old website remains on its existing hosting and can continue reading S3, but its content publishing will fail once the deny is active. Existing S3 content is not deleted or rewritten. The new Neon copy will not automatically appear on the old website.

All hosting stages (`deploy`, `check`, `release`, `open`) are rejected before provider calls or local run mutations. Vercel API access is also disabled at the provider boundary. Google OAuth/editor credentials are not needed for this data-only run. AWS, Neon and Cloudinary access are still required. The backup path currently uses `/tmp` as a placeholder and must be moved to durable storage before production execution.

Deployment remains a separate later operation once hosting access is available. Do not change the configuration of an in-progress run to deploy: finish and retain the data migration's records, then use a separately reviewed deployment path that keeps Neon authoritative.

## Credentials

Use the secure credential cards when the agent operates this workflow. Do not paste secrets into chat, config JSON, shell command arguments or Git. The runner accepts repeated `--secret-file NAME=/secure/path` arguments and reads each value only inside that command. It can also use already-configured environment variables or the AWS credential chain.

Required access:

- `VERCEL_TOKEN`: access to the blog's existing team/project, including reading project/domains, pausing/unpausing, updating settings/environment variables and creating deployments. Project/team IDs and the domain are not secrets.
- `DATABASE_URL`: an empty target Neon database with schema-creation and content read/write access. No paid upgrade or automatic database provisioning is performed.
- `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET`: required for hosting deployment of email accounts, but not for the data-only stages. Use the branch Auth URL and the application's existing cookie secret; the runner includes both in the encrypted production environment.
- AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` for temporary credentials), or an existing AWS profile: `s3:GetBucketPolicy` and `s3:PutBucketPolicy` on `lesnicoisenvadrouille`, and `s3:GetObject` on its two `data/adventure-*` prefixes. The runner preserves other bucket-policy statements and adds a deny for writes/deletes under just those prefixes, including historical objects. It does not need IAM administrator access.
- `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` for the existing cloud. These allow usage checks and deterministic uploads; existing assets are not overwritten.
- `EDITOR_PASSWORD` (at least 12 characters), or `EDITOR_PASSWORD_HASH`: the runner hashes a supplied password with scrypt. It generates the session secret and maintenance token itself in a private, ignored file.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for the new editor. Register the final origin's `/api/photos/google/callback` in Google. The owner must still complete Google consent/selection when needed; these client credentials alone do not grant access to private Photos.

Example shape (only file paths appear on the command line):

```sh
npm run migration:run -- preflight migration.config.json \
  --secret-file VERCEL_TOKEN=/secure/vercel-token \
  --secret-file DATABASE_URL=/secure/neon-url
```

Supply the other required credentials through the same mechanism or environment. Existing process credentials are reused. Runtime values are sent directly to Vercel as encrypted environment variables, without printing them. Credentials are excluded from the deployment file allowlist and backup files. Error logs redact known secret values and database URLs. Generated session/maintenance secrets live in `.runtime-secrets.json` inside the ignored run directory with mode 0600; keep that file private.

## Stages

| Stage | Action and safe stopping point |
| --- | --- |
| `plan` | No provider calls or writes. Shows target IDs, stages and missing credential names. |
| `preflight` | Read-only Vercel/domain, S3-policy, Neon and Cloudinary checks; backs up browser draft exports. Rejects unconfirmed browser-draft status. |
| `freeze` | Backs up the existing bucket policy, pauses Vercel production, adds/verifies the S3 write deny. Records a 60-second drain interval; returns rather than sleeping. |
| `capture` | Requires the verified freeze and elapsed drain interval. Captures both S3 documents and checksums, then verifies the backup copy. Keeps incomplete captures for diagnosis. |
| `prepare` | Derives an audited corrected snapshot without changing raw exports or S3. Retrieves legacy photo bytes and uploads only missing assets, checkpointing the URL map. Stops on every unresolved issue. |
| `import` | Requires a frozen source and matching prepared dataset. Applies the schema, transactionally imports and verifies, then exports Neon to both backup locations. |
| `deploy` | Uploads an allowlisted copy of the actual local Next.js source and configures the existing Vercel project. Deployment is production-targeted with editing disabled and an application maintenance gate. Records the deployment ID and returns. |
| `status` | Reads the current run/deployment status once. If the deployment POST response was lost, reconciles using its recorded attempt ID instead of silently creating another build. |
| `check` | Requires READY and the recorded deployment as production target. Unpauses Vercel but retains the application maintenance gate. Checks public pages privately, visitor 503s and draft authentication. Repauses on failure. |
| `release` | Requires successful checks against unchanged source. Pauses Vercel, then starts the same source with editing enabled and the application maintenance gate disabled. |
| `open` | Requires the READY release as production target. Imports browser drafts as private, deterministic copies and exports Neon before unpausing. Runs public read/privacy checks and repauses on failure. |
| `export` | Creates another consistent private Neon backup without changing content. |

Run `status` again later for queued/building deployments. A confirmed ERROR/CANCELED deployment can be retried with `deploy --retry-deploy` (or `release --retry-deploy` for the release); changed source requires a new maintenance deployment and checks. Unknown outcomes or active builds cannot be retried blindly. Never run multiple stages simultaneously. A `.lock` file prevents concurrent operators; after a hard crash, confirm the recorded process is gone before removing a stale lock. The configuration and database identity are bound to the run, and prepared-data/source checksums prevent resuming against different input. Use a new run directory for a different migration; never delete new Neon work to satisfy verification.

Provider operations are not one distributed transaction: a failure may leave Vercel paused or the S3 deny installed. This is intentional. Inspect state and rerun the same stage; no failure automatically brings back the old writer. If deployment submission has an unknown result, inspect Vercel rather than blindly retrying.

## Audited offline preparation

The preparation log records before/after values and reasons for each limited normalization:

- Missing legacy `albumId` becomes an explicitly unknown empty string.
- Missing `places` or `participants` becomes an empty list, without inventing names or locations.
- An entirely null `xlarge` variant reuses the largest recorded valid format. Existing image URLs and dimensions are retained.

Other malformed fields still block. The derived manifest references the original snapshot checksum and repair-log checksum. Article IDs, ordering, text and covers are preserved except for recorded photo replacements.

Google URLs already embedded in legacy content are fetched as image bytes, with no shared-album scraping and no arbitrary redirects. If unavailable, configure `photoPlan` as a local JSON file of `{ "oldUrl": "...", "file": "/path/to/original.jpg" }` entries and resume. The original may come from the official Picker or an owner's export. Successful Cloudinary uploads are reused through deterministic IDs and a checkpointed map. Each image is constrained to 2,560 pixels. Cloudinary Free usage must be available and below 80% of credits before preparation/deployment; the runner never changes a billing plan. Actual Vercel/Neon free-plan status still needs checking in the accounts.

A no-credentials preparation preview is available against the already saved source:

```sh
npm run migration:run -- prepare migration.config.example.json \
  --snapshot migration-data/rehearsal-20261124
```

It writes derived local files/audit/report, performs no network calls or uploads, and cannot mark the input production-ready. The observed preview retained 127 articles and 1,444 gallery photos, recorded 675 repairs, and left 92 Google URLs in 16 articles requiring photo preparation.

## Remaining interactive checks

The runner cannot read localStorage in the owner's other browsers, grant Google consent, or judge the visual layout. Browser exports/confirmation and Google account consent are owner steps. Review the logged metadata-normalization decisions and representative pages. HTTP checks are not a visual test or a proof that Google OAuth works. Keep maintenance enabled until those checks are satisfied.

Once any new Neon writes occur (including browser-draft imports), retain Neon as authoritative. `export` is available even while the site remains offline. A return to the S3 writer would require a separate verified reverse migration.

Provider references: [Vercel pause/resume](https://vercel.com/docs/projects/managing-projects), [deployment API](https://vercel.com/docs/rest-api/deployments/create-a-new-deployment), [environment API](https://vercel.com/docs/rest-api/projects/create-one-or-more-environment-variables), [S3 bucket policies](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html).
