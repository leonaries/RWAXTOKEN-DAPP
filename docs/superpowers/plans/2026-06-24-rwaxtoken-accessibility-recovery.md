# RWAXTOKEN Accessibility Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore reliable browser access to the RWAXTOKEN frontend and add a repeatable SPEC-driven verification gate.

**Architecture:** Keep the App Router frontend unchanged at the feature level, but stabilize the toolchain by pinning exact package versions and rebuilding dependency state. Verify the complete user story through server logs, TypeScript, production build, and real browser rendering.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, lucide-react, npm.

---

## File Map

- Modify: `package.json` to pin exact dependency versions and add a browser verification script entry if needed later.
- Modify: `package-lock.json` through `npm install`.
- Keep: `src/app/page.tsx` homepage implementation.
- Keep: `src/app/login/page.tsx` login implementation.
- Keep: `src/app/globals.css` Tailwind/global visual system.
- Modify: `src/app/layout.tsx` to suppress root hydration warnings caused by browser extension attributes.
- Create: `scripts/verify-app.mjs` to run browser-level route verification.
- Modify: `.gitignore` to ignore generated verification screenshots.
- Create: `docs/superpowers/specs/2026-06-24-rwaxtoken-accessibility-recovery-design.md`.
- Create: `docs/superpowers/plans/2026-06-24-rwaxtoken-accessibility-recovery.md`.

## Task 1: Stabilize Next Dependency Resolution

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Pin framework and tooling versions**

Update `package.json` dependencies from broad caret ranges to exact versions:

```json
{
  "dependencies": {
    "lucide-react": "0.468.0",
    "next": "15.3.9",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  },
  "devDependencies": {
    "@types/node": "22.10.2",
    "@types/react": "19.0.2",
    "@types/react-dom": "19.0.2",
    "autoprefixer": "10.4.20",
    "eslint": "9.17.0",
    "eslint-config-next": "15.3.9",
    "postcss": "8.4.49",
    "tailwindcss": "3.4.17",
    "typescript": "5.7.2"
  }
}
```

- [ ] **Step 2: Reinstall dependency tree**

Run:

```bash
npm install
```

Expected:

```text
changed ... packages
```

- [ ] **Step 3: Confirm installed Next version**

Run:

```bash
node -p "require('./node_modules/next/package.json').version"
```

Expected:

```text
15.3.9
```

## Task 2: Clear Generated State and Restart Dev Server

**Files:**
- Generated only: `.next/`
- Generated only: `tsconfig.tsbuildinfo`

- [ ] **Step 1: Stop the running dev server**

Send Ctrl-C to the existing `npm run dev` session.

Expected:

```text
dev server process exits
```

- [ ] **Step 2: Remove generated caches**

Run:

```bash
rm -rf .next tsconfig.tsbuildinfo
```

Expected: command exits 0.

- [ ] **Step 3: Start dev server**

Run:

```bash
npm run dev
```

Expected:

```text
Local: http://localhost:3000
Ready
```

If port 3000 is occupied, Next may choose another port. Use the reported local URL for browser verification.

## Task 3: Verify TypeScript and Production Build

**Files:**
- Read-only verification across the project.

- [ ] **Step 1: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected:

```text
tsc --noEmit
```

Exit code must be 0.

- [ ] **Step 2: Run production build**

Run:

```bash
npm run build
```

Expected:

```text
Compiled successfully
```

Exit code must be 0.

## Task 3.5: Suppress Extension-Caused Root Hydration Warning

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add root hydration warning suppression**

Set `suppressHydrationWarning` on the root HTML element:

```tsx
<html lang="zh-CN" suppressHydrationWarning>
```

Expected:

- Browser extensions that add attributes to `<html>` do not trigger a Next hydration error overlay.
- Application content remains unchanged.

## Task 4: Browser-Level Verification

**Files:**
- Read-only browser verification.

- [ ] **Step 1: Open `/login` in the browser**

Open:

```text
http://localhost:3000/login
```

Expected:

- Styled split login page is visible.
- Left visual panel renders on desktop.
- Email/code fields and Google/Wallet buttons render with Tailwind styling.
- No "switch to register" link is present; first login is explained as automatic account creation.
- No Next runtime error overlay is visible.
- No hydration mismatch issue is reported for extension-injected `<html>` attributes.

- [ ] **Step 2: Open `/` in the browser**

Open:

```text
http://localhost:3000/
```

Expected:

- Styled RWAXTOKEN homepage is visible.
- Hero, nav, stats, feature cards, and footer render with Tailwind styling.
- No Next runtime error overlay is visible.

- [ ] **Step 3: Check dev server logs**

Read the dev server terminal output.

Expected: logs must not contain:

```text
__webpack_modules__[moduleId] is not a function
segment-explorer-node.js#SegmentViewNode
```

## Task 5: Final Gate

**Files:**
- Read-only verification.

- [ ] **Step 1: Inspect git status**

Run:

```bash
git status --short
```

Expected:

- Source/config/docs files are shown as modified or untracked.
- Generated `.next/`, `node_modules/`, and `tsconfig.tsbuildinfo` are ignored.

- [ ] **Step 2: Report evidence**

Final report must include:

- Root cause.
- Files changed.
- Exact verification commands run.
- Browser verification result.
- Local URL for user access.

## Task 6: Add Repeatable Browser Verification

**Files:**
- Create: `scripts/verify-app.mjs`
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Add Playwright dependency and npm script**

Add:

```json
"verify:app": "node scripts/verify-app.mjs"
```

Add dev dependency:

```json
"playwright": "1.49.1"
```

- [ ] **Step 2: Create route verification script**

Create `scripts/verify-app.mjs` to:

- verify a running dev server at `http://127.0.0.1:3000` by default
- optionally start its own dev server when `VERIFY_START_SERVER=1`
- open `/` and `/login`
- fail on Next runtime overlay text
- fail on hydration overlay text
- fail if Tailwind styles are not reflected in computed CSS
- save screenshots to `.verification/screenshots/`

- [ ] **Step 3: Ignore generated screenshots**

Add `.verification/` to `.gitignore`.

- [ ] **Step 4: Run verification**

Run:

```bash
npm run verify:app
```

Expected:

```text
Verified 2 routes at http://127.0.0.1:3000
Screenshots saved to .verification/screenshots
```
