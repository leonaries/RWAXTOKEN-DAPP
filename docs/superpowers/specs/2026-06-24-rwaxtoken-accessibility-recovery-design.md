# RWAXTOKEN Frontend Accessibility Recovery SPEC

## Problem

The RWAXTOKEN-DAPP frontend currently fails to render as a normal styled page in development. Browser evidence shows a Next.js runtime overlay error:

```text
Runtime TypeError: __webpack_modules__[moduleId] is not a function
```

Server evidence shows the underlying failure comes from the Next development tooling module:

```text
Could not find the module ".../node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js#SegmentViewNode" in the React Client Manifest.
```

The app was initialized with a floating dependency range for Next:

```json
"next": "^15.1.0"
```

That resolved to `next@15.5.19`, which is the version shown in the browser overlay. The production build can pass, but the development server can still fail at runtime, so build-only verification is insufficient.

## Goal

Restore reliable local access to `/` and `/login`, then institutionalize a Superpowers-style SPEC and verification workflow so future frontend changes require browser-level evidence, not just a successful build.

## Scope

In scope:

- Pin framework dependencies to exact versions.
- Clear generated dev/build state after dependency changes.
- Keep the Next + Tailwind CSS + TypeScript stack.
- Preserve the implemented RWAXTOKEN homepage and login route.
- Add documentation for SPEC-driven verification gates.
- Verify the rendered pages through the browser, including screenshot and console/runtime evidence.

Out of scope:

- Real OAuth backend implementation.
- Real email verification API.
- Real wallet session persistence.
- Deployment configuration.

## Functional Requirements

- `/` renders a styled RWAXTOKEN-DAPP homepage.
- `/login` renders a styled split-login page.
- `/login` supports the existing frontend-only interactions:
  - email entry
  - verification code entry
  - verification code countdown
  - wallet connection attempt through `window.ethereum`
  - Google auth redirect placeholder to `/api/auth/google`
- Github login remains absent.
- A separate registration mode or "switch to register" entry remains absent; first successful login auto-creates the user's account.

## Technical Requirements

- `package.json` must pin `next`, `react`, `react-dom`, and core dev dependencies to exact versions rather than broad caret ranges.
- The selected Next version must be installable, compatible with React 19 and the current App Router project, and must not be flagged by npm as deprecated for the observed security advisory.
- `npm run typecheck` must pass.
- `npm run build` must pass.
- The dev server must serve `/` and `/login` without the original RSC/devtools runtime error.
- Browser verification must confirm Tailwind styles are loaded and visible, not just that HTML exists.
- The root layout must tolerate browser extensions that inject attributes into `<html>` without producing a hydration overlay.
- The project must include a repeatable local browser verification command so future changes can be checked without relying on manual inspection.

## Superpowers Workflow Requirements

Future work on this project should use this gate sequence:

1. `using-superpowers`: check relevant skills before acting.
2. `systematic-debugging`: for bugs, inspect logs and reproduce before fixing.
3. `brainstorming` or a local SPEC: for feature work, write acceptance criteria before implementation.
4. `writing-plans`: write an implementation plan for multi-step work.
5. `verification-before-completion`: run fresh verification before claiming completion.

## Acceptance Criteria

- `npm install` completes with pinned dependency versions.
- `npm run typecheck` exits 0.
- `npm run build` exits 0.
- `npm run dev` starts successfully on a local port.
- Browser visit to `/login` shows the styled split-login page rather than unstyled HTML or a runtime overlay.
- Browser visit to `/` shows the styled homepage rather than unstyled HTML or a runtime overlay.
- Runtime logs no longer contain:
  - `__webpack_modules__[moduleId] is not a function`
  - `segment-explorer-node.js#SegmentViewNode`
- Browser overlay no longer reports hydration mismatch caused by extension-injected root `<html>` attributes such as `trancy-version`.
- `npm run verify:app` opens `/` and `/login` from a running dev server, checks styling and runtime overlays, and writes screenshots under `.verification/screenshots/`. If needed outside restricted sandboxes, `VERIFY_START_SERVER=1 npm run verify:app` can start its own dev server.
- Project contains this SPEC and an implementation plan under `docs/superpowers/`.
