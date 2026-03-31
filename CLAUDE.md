# CLAUDE.md — SplashScreen

This is the splash screen web application for Autodesk Dynamo, published as the npm package `@dynamods/splash-screen`. It renders inside a WebView2 host (Dynamo) and displays loading progress before handing off to the main application UI.

## Essential Commands

```bash
npm install --force      # Install dependencies (--force required due to peer dep conflicts)
npm run start            # Dev server on localhost:8080
npm run build            # Dev build → /dist/build/
npm run bundle           # Production build (minified) → /dist/
npm run production       # Full release build: bundle + copy files + licenses

npm run lint:check       # Check ESLint issues
npm run lint:fix         # Auto-fix ESLint issues

npm run test:unit        # Jest unit tests (App, Toast)
npm run test:e2e         # Playwright e2e tests (Chromium)

npm run version:patch    # Bump patch version (triggers license generation via postversion hook)
npm run generate_license # Regenerate third-party license files manually
```

## Architecture

### Two-phase UI
- **Dynamic phase** — loading screen with progress bar and version display (`Dynamic.js`)
- **Static phase** — post-load UI with Launch, Sign In, and Import Settings buttons (`Static.js`)
- `App.js` orchestrates both phases; `Toast.js` handles notifications

### WebView2 host communication
The app runs embedded in Dynamo via Chrome WebView2. It communicates with the host via:
```js
chrome.webview.hostObjects.scriptObject.MethodName(args)
```
Host methods: `SignIn`, `SignOut`, `LaunchDynamo`, `ImportSettings`, `ResetSettings`.

When running outside WebView2 (plain browser), the app enters **debug mode** (append `?debug` to URL). Debug mode skips the loading phase and mocks all host callbacks.

### Window API
`App.js` exposes methods on `window` so the Dynamo host can drive the React component:
- `window.setLoadingText(text)` — update loading message
- `window.setProgress(value)` — update progress bar (0–100)
- `window.loadStaticPage()` — transition from Dynamic → Static phase

### State management
Class-based components with `setState()`. No Redux or Context. Parent (`App`) passes state down to children via props.

## Key Conventions

- **Class-based components** — this codebase uses `class Foo extends React.Component`, not function components or hooks
- **2-space indentation**, **single quotes**, **semicolons required** (enforced by ESLint)
- CSS files co-located with their component (e.g. `App.js` + `App.css`)
- All images are base64-encoded and centralized in `encodedImages.js`
- PropTypes and defaultProps used in `Static.js` for i18n label support

## Project Structure

```
src/
  index.js          Entry point (ReactDOM.createRoot)
  App.js / App.css  Root component, orchestrates phases, exposes window API
  Dynamic.js/.css   Loading phase UI
  Static.js/.css    Post-load phase UI
  Toast.js/.css     Toast notification system
  encodedImages.js  All images as base64 strings

tests/
  App.test.js       Jest unit tests for App
  Toast.test.js     Jest unit tests for Toast
  e2e.test.js       Playwright e2e tests
  __mocks__/        Mocks for CSS/file imports in Jest

public/
  index.html        HTML template for webpack

dist/               Build output (gitignored)
license_output/     Generated third-party license files
.github/workflows/  CI: build.yml (PRs), npm-publish.yml (releases)
```

## Testing Notes

- Unit tests use `@testing-library/react` with Jest; CSS and file imports are mocked via `__mocks__/`
- E2E tests use Playwright (Chromium only); run `npx playwright install chromium` if missing
- Coverage is reported in LCOV format; CI posts a summary to PRs via `zgosalvez/github-actions-report-lcov`

## CI/CD

- **build.yml**: Runs on every push/PR to `master` — installs, builds, unit tests, e2e tests, coverage report
- **npm-publish.yml**: Runs on GitHub Release creation — builds production bundle, publishes `/dist` to npm as `@dynamods/splash-screen` (public)

## Release Workflow

1. `npm run version:patch` (or `minor`/`major`) — bumps version, regenerates licenses
2. Push the version commit + tag
3. Create a GitHub Release → triggers npm publish automatically
