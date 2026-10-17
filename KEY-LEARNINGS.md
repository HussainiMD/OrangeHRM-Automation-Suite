# 📖 Key Learnings & Best Practices

## 1. Worker Tuning is Non-Obvious

Initially, the assumption was that running tests with the maximum number of workers (based on CI machine CPU count) would be optimal. In practice, adding more workers increased failures (3x times). The AUT has limits on how many concurrent sessions it can handle gracefully. After stress testing and observation, a **2-worker setup** emerged as optimal for this AUT — high parallelisation without overwhelming the server.

**Takeaway**: Parallelisation is not a function of machine capability alone — tune based on AUT load capacity. Use stress testing (running the same test suite 10+ times sequentially) to identify the breaking point.

---

## 2. Playwright's Auto-Wait is Transformatively Powerful — Use It Correctly

Transitioning from point-in-time DOM snapshots (`element.textContent()`, `element.count()`) to auto-retrying assertions (`toHaveText()`, `toHaveCount()`) reduced mysterious failures significantly. The key: **the assertion retries the condition**, not the preceding action. Using `toHaveText()` waits for text to appear; using `textContent()` with a manual wait is fragile because the wait may complete before the DOM updates.

**Takeaway**: Playwright's built-in assertions are more reliable than manual waits + custom checks. Avoid `waitForTimeout()` and `waitUntil: 'networkidle'`; rely on event-driven assertions instead.

---

## 3. API-First Validation Where Possible

Validating leave balance via API response (both status and data) is faster and more reliable than refreshing the UI and scraping the DOM. Similarly, checking auth state via a dedicated API call (vs. navigating the login page) is 300ms faster and deterministic. This is not just a speed optimisation — it separates the concern of "did the operation work?" from "is the UI reflecting the result?"

**Takeaway**: Use API-driven validation for business logic; reserve UI testing for user-facing features (layout, accessibility, visual feedback). Hybrid testing (API + UI in the same test) is powerful when each layer tests its own concern.

---

## 4. Fail Fast is Underrated

Global setup includes baseline checks: Is the AUT reachable? Is the admin user creation endpoint responding? Are the leave and recruitment modules active? These checks run once before any worker starts. Failures here halt the entire suite immediately with a clear error, providing quick feedback. Without this gate, a broken AUT would cause silent, widespread test failures 10 minutes into a run.

**Takeaway**: Invest in pre-suite sanity checks. They save hours of debugging and provide faster feedback loops.

---

## 5. Cross-Cutting Concerns Must Be Centralized

Auth, logging, user creation, leave allocation — these are not test-specific. They live in utils, fixtures, and global setup. Test code remains focused on assertions; infrastructure stays in infrastructure code. This separation enabled refactoring the auth manager (token refresh, CSRF extraction, lock flags) without touching a single test file.

**Takeaway**: Identify cross-cutting concerns early (setup, data, auth, logging); centralize them; test code should be thin and readable.

---

## 6. Accessibility Is Not "Optional"

Embedding WCAG 2AA scans directly in functional tests (not in a separate, lower-priority suite) surfaced real issues (password field contrast violations) and ensured they were prioritised for fixes. Treating accessibility as a blocking test condition — not a "nice-to-have" — changes organizational behaviour.

**Takeaway**: Integrate accessibility checks into the main test flow; make violations block tests; automation is the fastest way to catch regressions.

---

## 7. Browser-Specific Workarounds Are Acceptable When Scoped

Rather than avoiding Webkit entirely, the framework accommodates its limitations (slower JS execution, UI freezing during network activity) with targeted workarounds: a 1.5× timeout multiplier and platform-specific branching where unavoidable. This allows cross-browser coverage without sacrificing stability.

**Takeaway**: Embrace browser quirks where they're unavoidable; use multipliers and platform-specific logic; avoid removing browser coverage just because one browser is trickier.

---

## 8. Version Control for Baselines Is Essential

Visual snapshots (screenshots) must be committed to the repository and versioned like any other baseline. When a snapshot changes legitimately (e.g., design update), a developer approves the new snapshot, commits it, and the next CI run uses the updated baseline. This workflow prevents accidental visual regressions without requiring manual review on every run.

**Takeaway**: Screenshots and other visual baselines are code; version control them; require explicit approval for updates.

---

## 9. Logging Discipline Pays Dividends

Every test logs significant actions (page navigations, assertions, API calls, user interactions). When a test fails, the logs tell the story — exactly where execution went wrong and what state the application was in. Logs are structured (JSON via Pino), decorated with test name and worker ID, making correlation easy in CI.

**Takeaway**: Log liberally; use structured logging; treat logs as primary debugging artifact, not a secondary nicety.

---

## 10. Framework Constraints Enable AI Collaboration

Strict typing (TypeScript strict mode), clear coding standards (ESLint import guards, fixture conventions), and documented patterns (in `.github/copilot-instructions.md`) make it possible for AI-assisted code generation to produce conformant output. Without these constraints, AI-generated code would require extensive rework. With them, generated code often requires only minor adjustments.

**Takeaway**: Invest in framework discipline early; it enables both human collaboration and AI-assisted workflows.
