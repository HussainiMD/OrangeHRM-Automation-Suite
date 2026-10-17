# 🏔️ Challenges Faced & Solutions Implemented

## 1. Parallel Execution & Worker Isolation

**Challenge**: Multiple tests running in parallel against a shared AUT led to unpredictable failures. Tests interfered with each other's data and auth state.

**Solutions Implemented**:
- **Pre-authenticated sessions per worker**: Each test gets its own authenticated context via fixtures; no shared global state in the browser
- **Worker-scoped employee data**: Global setup creates one shared employee; each worker that creates employees registers an interceptor on POST `/pim/employees` to capture IDs, enabling deterministic cleanup
- **Atomic CSRF token refresh**: A lock flag prevents multiple workers from simultaneously attempting to refresh an expired token, eliminating *race conditions*.
- **Configurable worker count**: Local runs use 2 workers; CI uses 2 workers; adjusted based on AUT load tolerance and CI machine specs

**Result**: Reduced flaky failures from 30% to 10% through tuning worker counts and isolating data per worker.

---

## 2. Test Timeout & Browser-Specific Performance

**Challenge**: Non-Chrome browsers (Firefox, Safari) have significantly longer execution times. Navigation timeouts were firing sporadically in CI on Linux runners.

**Solutions Implemented**:
- **Browser-specific timeout multipliers**: Webkit gets a 1.5× timeout multiplier; Firefox gets 1.2×; Chrome stays at baseline
- **Prioritisation of Chrome/Firefox**: Webkit is retained for cross-browser coverage but is secondary; critical CI runs prioritise Chrome + Firefox
- **Stress testing via repeated runs**: Each test was executed 10+ times locally to identify Webkit-specific flakiness; issues were either fixed or acceptably isolated
- **Configurable timeouts via environment**: `test_global_timeout`, `test_expect_timeout`, `api_timeout` — adjusted per environment

**Result**: Reduced timeout-related failures by 5%; maintained consistency across browsers without sacrificing reliability.

---

## 3. Accessibility Support & Internationalization Limitations

**Challenge**: OrangeHRM has *NO* accessibility support and *lacks* test IDs. Language switching breaks tests because locators depend on text content.

**Solutions Implemented**:
- **CSS selector fallback strategy**: Defined locators by logical DOM grouping (component layout) rather than role-based (which fails on non-compliant apps). Locators are resilient to minor layout changes. Combination of display **text + CSS** selector deemed fit here.
- **Text-independent assertions**: Where possible, asserted on element visibility, enabled state, or CSS class changes — not text content
- **Accessibility inline in tests**: Axe-Core WCAG 2AA scans run on every auth and PIM test, surfacing violations (e.g., contrast ratio failures) immediately — not as a separate, deprioritised suite

**Result**: Tests remain stable even when non-English languages are active; to the possible extent. Accessibility violations are caught as blocking failures, not warnings.

---

## 4. Email Interception for Password Reset Testing

**Challenge**: OrangeHRM does NOT include an email server by default. Testing password reset workflows requires email interception without touching production mail infrastructure.

**Solutions Implemented**:
- **Mailtrap sandbox integration**: Configured OrangeHRM to use Mailtrap's SMTP server (safe, isolated, API-accessible)
- **Unique email per test user**: Employee creation uses a UUID in the email address (`test-${uuid}@mailtrap.io`); this ensures password reset emails land in the correct inbox without sync delays
- **Email parser utility**: Extracts password reset links from raw email bodies using regex; decodes URL-encoded characters (which was breaking Webkit browsers)
- **Inbox polling**: Email retrieval uses `doRetriedPolling()` with periodic POLLING of the Mailtrap API

**Result**: Deterministic, CI-safe password reset testing; caught a real bug where URL-encoded characters in reset links broke in Webkit but not Chrome.

---

## 5. Single Page Application (SPA) Navigation

**Challenge**: OrangeHRM is a single-page application using the History API to update URLs. Tests relying on `page.goto()` or URL change detection failed inconsistently.

**Solutions Implemented**:
- **URL assertion using `toHaveURL()`**: Instead of `expect(page.url()).toBe(...)`, used `await expect(page).toHaveURL(expectedPath)` — Playwright retries this assertion automatically if the URL hasn't updated yet
- **No hardcoded `waitForNavigation()`**: Removed explicit navigation waits; relied on Playwright's auto-waiting via assertions
- **Relative path navigation with baseURL**: All navigations use relative paths (`page.goto('/relative/path')`) via a configured `baseURL` in `playwright.config.ts`

**Result**: Stable navigation detection; no race conditions between History API updates and test assertions.

---

## 6. CI pipeline failure - unrelated reasons

**Challenge**: GitHub Actions CI pipeline SILENTLY timed out (~1 hours) during Playwright browser installation after a runner image update shifted the runner pool from `westus3` to `eastus2`. No explicit error surfaced in the primary install step, making the root cause non-obvious. It was tricky as I do NOT have SSH access to Github CI machine to do trouble shooting!!

**Root Cause**: Playwright Runner's download manager silently FAILING in chrome binary download but received truncated responses, reporting 100% download completion on an 18MB file that should be 171MB. There was nothing getting logged despite bumping up of log levels, changing the Ubuntu (OS) version, forcing different Azure cloud region. Also tried going for IPV4 instead of IPV6; again not helping!!

**Solutions Implemented**:
- **Log-only diagnostics**: Added timestamped exit codes, disk usage probes, and cache size verification to each workflow step to build full observability without SSH access — the only debugging mechanism available on hosted runners
- **Two-pass installation strategy**: Pass 1 uses the standard `npx playwright install` path unchanged; Pass 2 is CUSTOM curl-based fallback that bypasses Playwright's download manager entirely, using `-4` (force IPv4), `-f` (fail on partial response), and `-o` (overwrite without interactive prompts); Pass 2 skips any browser whose cache directory already exceeds 50MB, so only genuinely failed downloads are retried
- **Clean up of Installer cache and playwright logs**: Cache from earlier runs, Docker Images, Playwright logs are getting accumulated which might hit the free storage limits on CI machine. Pro-Active step to do the regular cleanup

**Result**: Pipeline reliably completes browser installation across runner regions; the two-pass strategy is self-healing and version-agnostic — no hardcoded URLs need updating on Playwright upgrades since Pass 1 always attempts the canonical install path first.

---

## 7. Duplicate Employee ID in Parallel Execution

**Challenge**: When adding multiple employees in parallel, auto-generated sequential IDs collided, causing tests to fail with "Employee ID already exists".

**Solutions Implemented**:
- **UUID-based employee ID generation**: Replaced reliance on auto-generated sequential IDs with programmatically generated UUIDs for test employees (e.g., `EMP-${uuidv4()}`)
- **Worker-scoped employee creation**: Each worker maintains its own set of created employee IDs via interceptor registration; cleanup aggregates all created IDs before deletion
- **API-driven employee creation**: Used OrangeHRM's employee creation API (not UI) to generate employees with explicit UUIDs, bypassing the auto-generation logic

**Result**: Eliminated ID collision failures; achieved reliable parallel execution with 2+ workers.

---

## 8. Flaky Leave Management Due to Leave Module Inconsistency

**Challenge**: Leave module was sometimes disabled entirely (unclear when or why); tests would fail with "module not found" errors. Leave balance updates were inconsistent — UI updates lagged behind API responses.

**Solutions Implemented**:
- **Leave module availability pre-check**: Global setup validates that the leave module is active before provisioning leave data; tests skip gracefully if the module is disabled
- **API-first leave validation**: After applying leave via UI, polled the `/api/leave/balance` endpoint instead of waiting for UI updates. Captured both status code and updated balance in the response.

**Result**: Reliable leave testing even when the leave module toggles; reduced leave-related failures from 8% to ~1%.

---

## 9. Stale Global Auth Context Across Workers

**Challenge**: A single shared authenticated context (stored as `storageState`) was persisted to disk and reused by all workers. When one worker's session expired and was refreshed, other workers continued using the stale context, leading to authorization failures and session corruption.

**Solutions Implemented**:
- **Per-worker auth context files**: Changed from a single shared `admin-auth.json` to per-worker files (e.g., `admin-auth-${PID}.json`)
- **Worker-scoped fixture initialization**: Each fixture initializes a fresh context on test startup; expired tokens are refreshed per worker without affecting siblings
- **Lock flag for refresh races**: Even with per-worker contexts, a lock flag prevents the same worker from attempting simultaneous token refreshes (which can occur during Playwright retry logic)

**Result**: Eliminated context corruption; workers became fully independent; test stability improved significantly under high parallelisation.

---

## 10. Locator Instability & Self-Healing Fallbacks

**Challenge**: OrangeHRM's lack of test IDs forced reliance on CSS selectors. Selectors were fragile when DOM structure changed; tests would break on UI tweaks.

**Solutions Implemented**:
- **Grouped, layout-based selectors**: Instead of targeting individual elements, selectors identified component containers (e.g., `.oxd-input-group` wrapping both input and error message), making them resilient to internal structure changes
- **Fallback locator chains**: For critical elements, defined multiple locator strategies in order of preference (e.g., try by role, fall back to CSS class, then by placeholder)
- **Self-healing approach**: Page objects exposed locator logic through public methods; refactoring a selector in one place fixes all tests that depend on it

**Result**: Reduced locator-related failures; easier maintenance when OrangeHRM UI updates occur.