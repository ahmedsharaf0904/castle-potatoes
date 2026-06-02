# Staging + Production Environments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the "create representative" and "create customer type" failures, then set up identical staging and production environments with a PR-based promotion workflow.

**Architecture:** Single Neon database shared by both environments. `main` branch → production Vercel deployment. `staging` branch → stable staging Vercel alias. Feature branches PR into `staging` first, then staging PRs into `main`. Database schema is applied once via drizzle-kit push (no per-environment migrations needed since the schema is shared).

**Tech Stack:** Next.js 16, Drizzle ORM, drizzle-kit, Neon (PostgreSQL), Vercel CLI, GitHub CLI

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `drizzle.config.ts` | **Create** | drizzle-kit config pointing at `DATABASE_URL` |
| `package.json` | **Modify** | Add `db:push` and `db:studio` scripts, add `drizzle-kit` devDep |
| `lib/auth.ts` | **Modify** | Fix secret lookup: `BETTER_AUTH_SECRET \|\| AUTH_SECRET \|\| dev-fallback` |
| `docs/superpowers/plans/2026-06-02-staging-production-environments.md` | **Create** | This plan |

---

## Task 1: Create feature branch

**Files:** none

- [ ] **Step 1: Create and switch to feature branch**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
git checkout main
git pull origin main
git checkout -b feature/staging-prod-setup
```

Expected: `Switched to a new branch 'feature/staging-prod-setup'`

---

## Task 2: Add drizzle-kit and drizzle config

**Files:**
- Create: `drizzle.config.ts`
- Modify: `package.json`

- [ ] **Step 1: Install drizzle-kit as devDependency**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
npm install --save-dev drizzle-kit
```

Expected: `added N packages`

- [ ] **Step 2: Create drizzle.config.ts**

Create `drizzle.config.ts` at project root with this exact content:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 3: Add db scripts to package.json**

In `package.json`, update the `scripts` section to add `db:push` and `db:studio`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio"
}
```

- [ ] **Step 4: Verify drizzle-kit is available**

```bash
npx drizzle-kit --version
```

Expected: prints a version like `drizzle-kit v0.xx.x`

---

## Task 3: Fix the AUTH_SECRET environment variable reference

**Files:**
- Modify: `lib/auth.ts:4`

The Vercel environment has `BETTER_AUTH_SECRET` (set 2 days ago) but `lib/auth.ts` reads only `AUTH_SECRET`. This means the JWT is signed with the insecure dev fallback `'dev-secret-key-change-in-production'` in all deployments.

- [ ] **Step 1: Update the secret lookup in lib/auth.ts**

Change line 4 in `lib/auth.ts` from:

```ts
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'dev-secret-key-change-in-production'
);
```

To:

```ts
const secret = new TextEncoder().encode(
  process.env.BETTER_AUTH_SECRET ||
  process.env.AUTH_SECRET ||
  'dev-secret-key-change-in-production'
);
```

- [ ] **Step 2: Verify build still passes**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
npm run build
```

Expected: build completes with `✓ Generating static pages` and no TypeScript errors.

---

## Task 4: Push database schema to Neon

The Neon database has `DATABASE_URL` set in Vercel but the tables (`representatives`, `customer_types`, `representative_accounts`, `accounts`) have never been created. This is why every POST to `/api/representatives` and `/api/customer-types` returns a 500.

- [ ] **Step 1: Load the production DATABASE_URL from Vercel into local env**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
vercel env pull .env.local --environment production
```

Expected: creates `.env.local` with the production `DATABASE_URL` (and all other prod env vars).

- [ ] **Step 2: Push the schema to Neon**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
npx dotenv -e .env.local -- npx drizzle-kit push
```

If `dotenv-cli` is not installed, install it first:

```bash
npm install --save-dev dotenv-cli
```

Then re-run the push. Expected output includes lines like:

```
[✓] Changes applied:
  - Created table `representatives`
  - Created table `customer_types`
  - Created table `representative_accounts`
  - Created table `accounts`
```

- [ ] **Step 3: Verify tables exist by inspecting via drizzle studio (optional)**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
npx dotenv -e .env.local -- npx drizzle-kit studio
```

Open `https://local.drizzle.studio` in browser — all 4 tables should appear. Press Ctrl+C when done.

- [ ] **Step 4: Remove .env.local (do not commit it)**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
del .env.local
```

Confirm `.env.local` is listed in `.gitignore` (check `next-env.d.ts` or add if missing):

```bash
grep ".env.local" .gitignore || echo ".env.local" >> .gitignore
```

---

## Task 5: Commit fixes and push feature branch

**Files:** all modified files

- [ ] **Step 1: Stage all changes**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
git add drizzle.config.ts package.json package-lock.json lib/auth.ts docs/
```

- [ ] **Step 2: Commit**

```bash
git commit -m "fix: add drizzle-kit schema push, fix auth secret env var lookup"
```

- [ ] **Step 3: Push feature branch**

```bash
git push origin feature/staging-prod-setup
```

Expected: `Branch 'feature/staging-prod-setup' set up to track remote branch`

---

## Task 6: Create PR to staging and merge

- [ ] **Step 1: Ensure staging branch is in sync with main**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
git checkout staging
git reset --hard origin/main
git push origin staging --force-with-lease
```

Expected: `staging` is now at the same commit as `main`.

- [ ] **Step 2: Create PR: feature → staging**

```bash
gh pr create \
  --base staging \
  --head feature/staging-prod-setup \
  --title "fix: database schema push + auth secret + drizzle-kit" \
  --body "$(cat <<'EOF'
## Summary
- Adds drizzle-kit and `db:push` script to apply the Drizzle schema to Neon
- Fixes JWT secret lookup to use `BETTER_AUTH_SECRET` (already set in Vercel)
- Fixes create representative and create customer type (tables were never migrated)

## Test plan
- [ ] Build passes: `npm run build`
- [ ] Vercel staging deployment shows green (Ready)
- [ ] Login works at staging URL
- [ ] Creating a representative succeeds
- [ ] Creating a customer type succeeds
EOF
)"
```

Expected: prints a PR URL like `https://github.com/ahmedsharaf0904/castle-potatoes/pull/N`

- [ ] **Step 3: Merge the PR into staging**

```bash
gh pr merge --merge --delete-branch
```

Expected: `Merged pull request #N` and `Deleted branch feature/staging-prod-setup`

- [ ] **Step 4: Wait for staging Vercel deployment to go green**

```bash
sleep 30 && vercel list 2>&1 | grep staging | head -3
```

Or check the Vercel dashboard. Expected: staging deployment shows `● Ready`.

---

## Task 7: Configure stable staging URL alias in Vercel

Vercel auto-deploys any push to any branch as a Preview with a unique URL. To give `staging` a **stable** URL that never changes, we set a branch alias.

- [ ] **Step 1: Get the latest staging deployment URL**

```bash
vercel list 2>&1 | grep "staging\|main" | head -5
```

Note the URL for the staging deployment (it looks like `v0-representatives-...-<hash>.vercel.app`).

- [ ] **Step 2: Set a stable alias for the staging branch**

```bash
vercel alias set <staging-deployment-url> v0-representatives-staging.vercel.app
```

Replace `<staging-deployment-url>` with the URL noted in Step 1.

Expected: `Success! v0-representatives-staging.vercel.app now points to <deployment-url>`

- [ ] **Step 3: Verify the alias resolves**

```bash
curl -s -o /dev/null -w "%{http_code}" https://v0-representatives-staging.vercel.app
```

Expected: `200` or `307` (redirect to login).

**Note:** After every future merge to `staging`, re-run Step 2 with the new deployment URL to keep the alias pointing at the latest build. (Or use Vercel's project settings → Domains to configure a permanent branch alias via the dashboard.)

---

## Task 8: Create PR from staging to main and merge to production

- [ ] **Step 1: Create PR: staging → main**

```bash
cd "C:\Users\Ahmed SSharaf\Projects\castle-potatoes"
git checkout staging
git pull origin staging

gh pr create \
  --base main \
  --head staging \
  --title "promote: staging → production (db schema + auth fix)" \
  --body "$(cat <<'EOF'
## Summary
Promotes validated staging changes to production.

Includes:
- drizzle-kit schema push (creates missing DB tables)
- Auth secret env var fix (`BETTER_AUTH_SECRET`)
- `db:push` script for future schema changes

## Verified on staging
- [x] Login works
- [x] Create representative works
- [x] Create customer type works
- [x] Vercel staging deployment: Ready
EOF
)"
```

- [ ] **Step 2: Merge the PR into main**

```bash
gh pr merge --merge
```

Expected: `Merged pull request #N`

- [ ] **Step 3: Wait for production Vercel deployment to go green**

```bash
sleep 30 && vercel list 2>&1 | head -5
```

Expected: latest production deployment shows `● Ready`.

---

## Task 9: Verify both environments are fully functional

- [ ] **Step 1: Confirm both deployments are Ready**

```bash
vercel list 2>&1 | head -8
```

Expected: top two entries (production + staging) both show `● Ready`.

- [ ] **Step 2: Open production URL in browser**

```bash
start https://v0-representatives-and-custo-ahmedsharaf94ds-gmailcoms-projects.vercel.app
```

- [ ] **Step 3: Open staging URL in browser**

```bash
start https://v0-representatives-staging.vercel.app
```

- [ ] **Step 4: Test create representative on production**

In browser on production:
1. Log in with `admin@castlepotatoes.com` / `admin123`
2. Navigate to Representatives → Add Representative
3. Fill in name, click Create Representative
4. Expect: redirect to `/dashboard/representatives` with the new entry listed

- [ ] **Step 5: Test create customer type on production**

1. Navigate to Customer Types → Add Customer Type
2. Fill in name, click Create Customer Type
3. Expect: redirect to `/dashboard/customer-types` with the new entry listed

- [ ] **Step 6: Confirm same data visible on staging (shared DB)**

Open staging URL, log in, check Representatives and Customer Types — the records created in Step 4 and 5 should appear (shared database).

---

## Future PR workflow (summary for reference)

```
feature/my-feature  →  PR to staging  →  merge  →  verify on staging
                                                          ↓
                                          PR from staging to main  →  merge  →  production
```

Database schema changes: run `npm run db:push` locally with `.env.local` pulled from production, then commit the `drizzle/` migration folder if you switch to `drizzle-kit migrate` later.
