# OrangeHRM Playwright Automation Suite

## 🎯 What This Project Does

This is a **production-grade UI automation framework** for OrangeHRM, an enterprise HR management system used by many organisations world wide. It validates critical business workflows — employee lifecycle management, authentication, role-based access control, leave processing, security hardening, and system resilience — across three major browsers with zero manual intervention.

The framework goes beyond functional testing: instrumented with structured logging, automated accessibility scanning (WCAG 2AA), email interception, credential leakage detection, and Lighthouse performance assertions. It is architected as a PORTFOLIO demonstration of what a senior SDET produces at scale — not a collection of scripts, but a maintainable engineering system.

## What Makes This Different From a Tutorial Project
| Decision | Why |
|----------|-----|
| API layer for test data setup | UI-driven setup is slow and convoluted |
| Fixture-based auth (not beforeEach) | True test isolation via dependency injection |
| Two role personas (Admin + ESS) | RBAC boundary testing, not just happy path |
| Mailtrap email integration | Validates ACTUAL email delivery in CI |
| CI integrated Allure Reporting | With each CI run, latest test reports gets published to github pages |
| Snapshot auto-update ON manual CI | Baseline management without local runs |
| All secrets externalized | Zero hardcoded credentials — CI-safe by design |

---
## 🔗 Quick Links
- **Repository**: [github.com/HussainiMD/OrangeHRM-Automation-Suite](https://github.com/HussainiMD/OrangeHRM-Automation-Suite)
- 🎬 ***Demo***: Hybrid API + UI Password Reset Flow - CLICK on the LINK below
     - [![Password Reset DEMO video](<img width="200" alt="password_reset_thumbnail_under_50kb" src="https://github.com/user-attachments/assets/c83dfbb1-7c3b-4b46-8bd9-777b9c9e1af1" />)](https://youtu.be/3aTzZftW2K0)
          - <small>Playwright pauses after triggering reset → Mailtrap inbox shows email landing in real time → script resumes, pulls link via API, completes recovery across browsers.</small>
- **Public Allure Dashboard**: [hussainimd.github.io/OrangeHRM-Automation-Suite](https://hussainimd.github.io/OrangeHRM-Automation-Suite/) — Live test history, trends, and flakiness data
     - <img width="1862" height="835" alt="Allur_Report_Screenshot" src="https://github.com/user-attachments/assets/8303a5c0-f1cb-484d-9536-bcb443973f5f" />
- **CI/CD Workflow**: [GitHub Actions](https://github.com/HussainiMD/OrangeHRM-Automation-Suite/actions/workflows/playwright.yml) — Trigger a manual run anytime *without* a code push
---

## 🤖 AI-Augmented Development: Engineering Velocity & Quality

This framework demonstrates **structured AI collaboration** at SCALE — using Claude, ChatGPT, GitHub Copilot, and Playwright MCP to accelerate development without sacrificing quality or control. The approach combines agentic automation with deterministic guardrails, resulting in:

| Metric | Improvement |
|---|---|
| **Test scenario discovery** | 60+ cases surfaced in ~10 minutes (vs. 3–4 hours manual analysis) — **60% faster** |
| **Test code generation** | 80% boilerplate reduction; typical test written in ~10 minutes (vs. 1 hour manual) — **75% faster** |
| **Debugging & root cause** | Average resolution dropped from ~30–60 min to ~15 minutes with AI-assisted trace analysis — **60% faster** |
| **Total development velocity** | 75% reduction in manual effort |
| **Code quality** | Consistent pattern enforcement via fixtures, utilities, and guardrails; first-pass quality  |

**How It Works**: AI handles discovery, scaffolding, and pattern-matching; engineers retain *full authority* over architecture, trade-offs, and validation. Soft guardrails (detailed instructions, pattern examples) are layered with **hard** guardrails (ESLint rules, pre-commit gates, code review checklists).

**For Hiring Managers/Leads**: This demonstrates operational maturity in AI collaboration — not replacing engineers, but amplifying their impact through **disciplined supervision and systematic guardrail design**. The framework is PORTABLE across teams and projects.

👉 **[Read AI-COLLABORATION.md →](./AI-COLLABORATION.md)** for a deep dive into tools, methodologies, metrics, and operational lessons learned.

---

## 💼 Business Value Delivered

- **Eliminated 6–8 hours/week of manual regression** — ~65 test cases execute in parallel across three browsers, catching auth gaps, validation failures, and access-control violations before they reach UAT
- **Cross-browser confidence in under 45 minutes** — Chrome, Firefox, and Safari run simultaneously in CI; significant reduction of feeback time + major browsers covered!!
- **Employee onboarding defect detection before UAT** — PIM form validation tests cover 12+ failure modes (photo upload edge cases, field masking, mandatory field bypass), preventing late-stage rework
- **Built-in accessibility compliance gate** — Automated WCAG 2AA scanning on every auth and PIM flow; discovered password field *contrast* violations (3.2:1 vs. required 4.5:1) before release
- **Instant post-incident root cause data** — Video, DOM trace, and screenshot captured on every failure; reduced average debugging time 
- **Basic Security coverage** — Credential leakage scanning across all HTTP traffic (including redirects and resource loads), CSRF token validation, and sensitive field masking checks run on every regression cycle
---

## 🐛 Bugs & Issues Discovered in OrangeHRM
This framework identified several functional, security, and UX defects in OrangeHRM that should be addressed:

### Functional Issues
| Issue | Impact | Recommendation |
|---|---|---|
| **Auto-Generated Employee ID Collision** | When a user stays on the Add Employee form for extended periods, the auto-generated employee ID becomes *rejected* as "already exists". IDs should use sequence numbers with sufficient entropy or UUIDs to prevent collisions under concurrent operations. | Generate IDs using UUID or secure random sequences; avoid static sequences that collide under load. |
| **Stale Hiring Manager Assignment** | When a vacancy is active and the assigned hiring manager leaves/is fired, the system marks the hiring manager as `[deleted]` instead of automatically escalating to the supervisor. This breaks recruitment tracking and loses valuable HR effort. | Implement supervisor escalation on hiring manager termination; maintain recruitment pipeline continuity. |
| **Emergency Contact Self-Assignment** | Any user can add themselves as an emergency contact, which is inappropriate and violates data integrity. | Restrict emergency contact creation to HR/managers only; prevent users from adding their own contacts. |
| **Employee ID Format Validation** | Employee ID accepts arbitrary gibberish instead of enforcing a format or pattern. IDs should be alphanumeric with constraints. | Define and enforce employee ID format (e.g., `EMP-\d{5}`); validate on both client and API. |
| **Profile Picture Upload Validation** | The profile picture upload field accepts any file type, not just images. Allows uploading arbitrary files (docs, PDFs, executables), posing security risks. | Restrict file upload to MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`; validate client and server-side. |
| **Unauthorized Access Error Recovery** | Non-admin users attempting to access admin modules receive a 500 error instead of a 403 Forbidden on back-button or home navigation. This forces users to clear cookies, degrading UX. | Return proper 403 HTTP status and render a user-friendly error page (not 500); avoid forcing cookie clears. |
| **User Creation Password Validation** | When adding a new employee with user account creation, submitting without a password triggers a network request, then shows an error alert instead of validating client-side/UI first. | Add client-side password validation on the form before submission; fail fast with UI error messages. |
| **Session Timeout Inactivity** | Sessions do not auto-logout on inactivity. Even when a session expires, the UI does not respond to user actions by logging them out. | Implement inactivity timeout with client-side awareness |

### Security Issues
| Issue | Impact | Recommendation |
|---|---|---|
| **No DDOS/Rate Limiting** | There is no detection or mitigation for distributed denial-of-service (DDOS) attacks or brute-force login attempts. Multiple failed login attempts are not rate-limited. | Implement rate limiting (e.g., max 5 login attempts per IP per 15 minutes), IP-based throttling, or CAPTCHA after N failures. |
| **Sensitive Data Exposure** | No field masking for sensitive data (e.g., SSN, tax ID); displayed in plain text in employee records. | Mask sensitive fields in UI; display only last 4 digits; enforce role-based visibility (HR/Payroll only). |

### Usability Issues
| Issue | Impact | Recommendation |
|---|---|---|
| **User Menu Keyboard Inaccessibility** | Top-right user menu is **NOT** keyboard-navigable (no Tab key support, no `tabindex`). Violates WCAG 2AA keyboard accessibility. | Add `tabindex="0"` to menu trigger; implement arrow-key navigation in dropdown; test with keyboard-only users. |
| **Browser Back-Button UX** | After login, pressing browser back button returns to login page, but re-entering credentials does not refresh/redirect to dashboard — the page remains on login. | On successful login, replace history entry (use `history.replaceState()`); redirect to dashboard; prevent back-button loops. |
| **Password Field Contrast Violation** | Password field label has a contrast ratio of 3.2:1 against its background — below the WCAG 2AA minimum of 4.5:1 for small text. | Increase contrast to 4.5:1+; use darker label color or lighter background; validate with Axe-Core. |
| **Username Display Clutter** | Long usernames displayed next to profile picture in header create layout overflow and clunky presentation. | Truncate username (e.g., first 20 chars) with ellipsis; show full name on hover via tooltip. |

### Performance Issues
Chrome DevTools Lighthouse metrics show areas for improvement:

| Metric | Current | Target | Action |
|---|---|---|---|
| **LCP (Largest Contentful Paint)** | Varies | < 4s | Lazy-load off-screen images; reduce main bundle size |
| **CLS (Cumulative Layout Shift)** | Varies | < 0.25 | Pre-allocate space for dynamic content; avoid layout thrashing |
| **TBT (Total Blocking Time)** | Varies | < 600ms | Break long tasks into smaller chunks; defer non-critical work |
| **FCP (First Contentful Paint)** | Varies | < 3s | Inline critical CSS; defer non-critical scripts |

---

## 🏗️ Architecture & Design Decisions

### 📁 Project Structure

```
.
├── config/
│   └── playwright.config.ts            # Multi-browser, parallel workers, reporters,
│                                       # environment-aware timeouts, baseURL
│
├── pages/                            # UI interaction encapsulation; selectors never leak into tests
│   ├── LoginPage.ts                    # CSRF extraction, credential submission
│   ├── NavigationPage.ts               # Sidebar, role-based menu traversal
│   ├── PimEmployeeListPage.ts          # Employee list, search, add/edit actions
│   ├── AddEmployeePage.ts              # Employee form, photo upload, validation
│   ├── EditUserPage.ts                 # User account creation from employee record
│   ├── UserListPage.ts                 # Admin user list and filters
│   └── components/
│       └── UserMenu.ts                 # Logout, profile menu widget
│
├── fixtures/                         # Uses fixtures for pre-authenticated contexts
│   ├── admin-auth.fixture.ts           # Admin-role context: auth gate + teardown logout
│   └── essUser-auth.fixture.ts         # ESS-role context: auth gate + teardown logout
│
├── tests/
│   ├── base.ts                         # Extended Playwright test with logger fixture
│   ├── types/
│   │   ├── credentials.ts              # {username, password} type
│   │   ├── BasicEmployeeType.ts        # Employee creation payload
│   │   ├── UserType.ts                 # Basic User 
│   │   └── EmployeeType.ts             # Employee metadata (ID, employee number)
│   ├── errors/
│   │   └── duplicate-user-error.ts     # Domain-specific error (not generic Error)
│   └── ui/
│       ├── smoke/
│       │   ├── auth/                   # Login, Logout, disabled user, invalid user
│       │   └── authorization/          # Supervisor vs. subordinate access
│       ├── e2e/
│       │   └── [forgot password workflow]
│       └── regression/
│           ├── auth/                   # login, session management, expired session, inactive user
│           ├── admin/                  # search, modify employee
│           ├── pim/                    # Add employee, validation, photo, responsive
│           ├── authorization/          # Supervisor vs. subordinate access
│           ├── security/               # Credential leakage, CSRF, sensitive field masking
│           ├── performance/            # Lighthouse SLA assertions
│           ├── resilience/             # Timeout handling, slow network simulation
│           └── leave/                  # Subordinate leave workflow
│
├── utils/                            # Cross-cutting concerns, each with a single responsibility:
│   ├── logger.ts                       # Pino singleton decorated with test context
│   ├── auth-manager.utils.ts           # CSRF extraction, token refresh, lock-flag races
│   ├── waits-manager.util.ts           # doRetriedPolling() — for polling Email Inbox
│   ├── users-manager.util.ts           # Employee/user creation + employee interceptor
│   ├── email-manager.util.ts           # Mailtrap API: inbox polling, message retrieval
│   ├── email-parser.util.ts            # Extracts reset links from raw email bodies
│   ├── leave-management.util.ts        # Leave allocation — month-safe date logic
│   ├── page-load-performance.utils.ts  # Lighthouse integration helpers
│   ├── lighthouse-performance.evaluator.ts
│   ├── page-manager.util.ts
│   ├── env-validations.utils.ts        # Fail fast on missing required env vars
│   ├── rules/                          # Metrics measurement rules
│   │   └── [lighthouse performance measurement rules]
│   └── types/                          # API payload type definitions
│
├── apis/
│   ├── global-setup.ts                 # Provisions test employee + ESS user pre-suite
│   └── global-cleanup.ts               # Deletes all provisioned data post-suite
│
├── .github/
│   ├── copilot-instructions.md         # Coding standards and patterns for AI assistance
│   └── workflows/
│       └── playwright.yml              # CI pipeline — lint gate + cross-browser run
│
├── storage/                            # Auth state, employee data (gitignored)
├── allure-results/                     # Raw Allure data (gitignored)
├── allure-report/                      # Generated Allure HTML (git ignored, CI deploys)
├── playwright-report/                  # Playwright HTML report
├── package.json
├── tsconfig.json                       # strict: true
├── eslint.config.js                    # static code analysis 
└── autCred.env                         # Credentials (gitignored)
```

### Key Design Patterns & the Reasoning Behind Each

**1. Fixture-Based Authentication (Dependency Injection)**

Two fixtures — `adminUserAuthContext` and `essUserAuthPage` — inject pre-authenticated browser contexts into tests via Playwright's fixture system. No test creates its own session; the fixture is the authority on authentication state.

On fixture *initialisation*, an explicit auth gate assertion confirms the session is valid before handing control to the test. On *teardown*, the fixture logs out and handles errors gracefully — if logout fails (e.g., session already expired), it catches and logs the failure rather than crashing the teardown chain. This design means a session failure manifests as a fixture error with a clear message, not as a mysterious mid-test assertion failure.

**Mid Flight Auto Refresh which is thread safe from parellel workers**
When a token expires during a test and Playwright retries, the auth manager refreshes credentials using a lock flag to prevent race conditions across parallel workers. Subsequent retries get a guaranteed fresh context. 

**2. Global Setup / Teardown with Worker Isolation**

`global-setup.ts` provisions exactly one test employee record before any worker starts and writes its metadata (ID, employee number) to the file system in `storage/`. All workers read from this shared file — no worker creates its own employee independently. *Employee* to *Login(s)* is a **Many-to-One** relationship.

An `attachEmployeeInterceptor` on POST `/pim/employees` captures newly created records per worker session, enabling `global-cleanup.ts` to delete *all* employees created during the run — including those created by tests that exercise the add-employee flow. This resolved a race condition found during development where cleanup would attempt to query employee data that another worker hadn't yet committed.

**3. CSRF Token Extraction + Cookie-Based Auth Reuse**

OrangeHRM's session relies on CSRF tokens. The auth manager extracts the token from the login page HTML, submits credentials to `/auth/validate` via **API** (not UI), and persists the resulting `storageState` (cookies + localStorage) to disk. Each test context loads this state directly — no browser navigation to the login page during test execution. This enables CLEAN, STABLE and FAST test case results.

This is not just a speed optimisation. It ensures that auth state is *exactly reproducible* and *testable* independently of the login UI. 

**4. Credential Leakage Scanner**

The security test for credential exposure attaches a request listener to *all* outgoing HTTP traffic — including redirects, prefetch requests and static resource loads. For each request, it checks whether username or password appears in the URL, headers, or body, and sets a boolean flag per credential type.

A critical design decision: the scanner does **not** short-circuit on the first match. It accumulates flags across requests and asserts at the end. This is intentional — an early exit would miss scenarios where credentials appear in a redirect that follows a clean initial request.

**5. Leave Management Utility**

The leave allocation utility ensures that leaves are pre alloted in the global setup phase. During testing the leave application validation test cases, underlying API response based verification is used to ensure that test stays TRULY INDEPENDENT. There by ensuring that tests can be run in Parellel

**6. YAGNI-Driven API Architecture (balancing right setup and future proofing)**

By design Single Repoonsibility principle is embraced: Each need has a dedicated utility (e.g auth manager). Cross cutting concerns like logging, setup and data clean up in AUT are abstracted away from the test case. All of them happen behind the scenes!!

---

## 🏔️ Challenges Faced & Solutions Implemented

### 1. Parallel Execution & Worker Isolation

**Challenge**: Multiple tests running in parallel against a shared AUT led to unpredictable failures. Tests interfered with each other's data and auth state.

**Solutions Implemented**:
- **Pre-authenticated sessions per worker**: Each test gets its own authenticated context via fixtures; no shared global state in the browser
- **Worker-scoped employee data**: Global setup creates one shared employee; each worker that creates employees registers an interceptor on POST `/pim/employees` to capture IDs, enabling deterministic cleanup
- **Atomic CSRF token refresh**: A lock flag prevents multiple workers from simultaneously attempting to refresh an expired token, eliminating *race conditions*.
- **Configurable worker count**: Local runs use 2 workers; CI uses 2 workers; adjusted based on AUT load tolerance and CI machine specs

**Result**: Reduced flaky failures from 30% to 10% through tuning worker counts and isolating data per worker.

---

### 2. Test Timeout & Browser-Specific Performance

**Challenge**: Non-Chrome browsers (Firefox, Safari) have significantly longer execution times. Navigation timeouts were firing sporadically in CI on Linux runners.

**Solutions Implemented**:
- **Browser-specific timeout multipliers**: Webkit gets a 1.5× timeout multiplier; Firefox gets 1.2×; Chrome stays at baseline
- **Prioritisation of Chrome/Firefox**: Webkit is retained for cross-browser coverage but is secondary; critical CI runs prioritise Chrome + Firefox
- **Stress testing via repeated runs**: Each test was executed 10+ times locally to identify Webkit-specific flakiness; issues were either fixed or acceptably isolated
- **Configurable timeouts via environment**: `test_global_timeout`, `test_expect_timeout`, `api_timeout` — adjusted per environment

**Result**: Reduced timeout-related failures by 5%; maintained consistency across browsers without sacrificing reliability.

---

### 3. Accessibility Support & Internationalization Limitations

**Challenge**: OrangeHRM has *NO* accessibility support and *lacks* test IDs. Language switching breaks tests because locators depend on text content.

**Solutions Implemented**:
- **CSS selector fallback strategy**: Defined locators by logical DOM grouping (component layout) rather than role-based (which fails on non-compliant apps). Locators are resilient to minor layout changes. Combination of display **text + CSS** selector deemed fit here.
- **Text-independent assertions**: Where possible, asserted on element visibility, enabled state, or CSS class changes — not text content
- **Accessibility inline in tests**: Axe-Core WCAG 2AA scans run on every auth and PIM test, surfacing violations (e.g., contrast ratio failures) immediately — not as a separate, deprioritised suite

**Result**: Tests remain stable even when non-English languages are active; to the possible extent. Accessibility violations are caught as blocking failures, not warnings.

---

### 4. Email Interception for Password Reset Testing

**Challenge**: OrangeHRM does NOT include an email server by default. Testing password reset workflows requires email interception without touching production mail infrastructure.

**Solutions Implemented**:
- **Mailtrap sandbox integration**: Configured OrangeHRM to use Mailtrap's SMTP server (safe, isolated, API-accessible)
- **Unique email per test user**: Employee creation uses a UUID in the email address (`test-${uuid}@mailtrap.io`); this ensures password reset emails land in the correct inbox without sync delays
- **Email parser utility**: Extracts password reset links from raw email bodies using regex; decodes URL-encoded characters (which was breaking Webkit browsers)
- **Inbox polling**: Email retrieval uses `doRetriedPolling()` with periodic POLLING of the Mailtrap API

**Result**: Deterministic, CI-safe password reset testing; caught a real bug where URL-encoded characters in reset links broke in Webkit but not Chrome.

---

### 5. Single Page Application (SPA) Navigation

**Challenge**: OrangeHRM is a single-page application using the History API to update URLs. Tests relying on `page.goto()` or URL change detection failed inconsistently.

**Solutions Implemented**:
- **URL assertion using `toHaveURL()`**: Instead of `expect(page.url()).toBe(...)`, used `await expect(page).toHaveURL(expectedPath)` — Playwright retries this assertion automatically if the URL hasn't updated yet
- **No hardcoded `waitForNavigation()`**: Removed explicit navigation waits; relied on Playwright's auto-waiting via assertions
- **Relative path navigation with baseURL**: All navigations use relative paths (`page.goto('/relative/path')`) via a configured `baseURL` in `playwright.config.ts`

**Result**: Stable navigation detection; no race conditions between History API updates and test assertions.

---

### 6. CI pipeline failure - unrelated reasons

**Challenge**: GitHub Actions CI pipeline SILENTLY timed out (~1 hours) during Playwright browser installation after a runner image update shifted the runner pool from `westus3` to `eastus2`. No explicit error surfaced in the primary install step, making the root cause non-obvious. It was tricky as I do NOT have SSH access to Github CI machine to do trouble shooting!!

**Root Cause**: Playwright Runner's download manager silently FAILING in chrome binary download but received truncated responses, reporting 100% download completion on an 18MB file that should be 171MB. There was nothing getting logged despite bumping up of log levels, changing the Ubuntu (OS) version, forcing different Azure cloud region. Also tried going for IPV4 instead of IPV6; again not helping!!

**Solutions Implemented**:
- **Log-only diagnostics**: Added timestamped exit codes, disk usage probes, and cache size verification to each workflow step to build full observability without SSH access — the only debugging mechanism available on hosted runners
- **Two-pass installation strategy**: Pass 1 uses the standard `npx playwright install` path unchanged; Pass 2 is CUSTOM curl-based fallback that bypasses Playwright's download manager entirely, using `-4` (force IPv4), `-f` (fail on partial response), and `-o` (overwrite without interactive prompts); Pass 2 skips any browser whose cache directory already exceeds 50MB, so only genuinely failed downloads are retried
- **Clean up of Installer cache and playwright logs**: Cache from earlier runs, Docker Images, Playwright logs are getting accumulated which might hit the free storage limits on CI machine. Pro-Active step to do the regular cleanup

**Result**: Pipeline reliably completes browser installation across runner regions; the two-pass strategy is self-healing and version-agnostic — no hardcoded URLs need updating on Playwright upgrades since Pass 1 always attempts the canonical install path first.

---

### 7. Duplicate Employee ID in Parallel Execution

**Challenge**: When adding multiple employees in parallel, auto-generated sequential IDs collided, causing tests to fail with "Employee ID already exists".

**Solutions Implemented**:
- **UUID-based employee ID generation**: Replaced reliance on auto-generated sequential IDs with programmatically generated UUIDs for test employees (e.g., `EMP-${uuidv4()}`)
- **Worker-scoped employee creation**: Each worker maintains its own set of created employee IDs via interceptor registration; cleanup aggregates all created IDs before deletion
- **API-driven employee creation**: Used OrangeHRM's employee creation API (not UI) to generate employees with explicit UUIDs, bypassing the auto-generation logic

**Result**: Eliminated ID collision failures; achieved reliable parallel execution with 2+ workers.

---

### 8. Flaky Leave Management Due to Leave Module Inconsistency

**Challenge**: Leave module was sometimes disabled entirely (unclear when or why); tests would fail with "module not found" errors. Leave balance updates were inconsistent — UI updates lagged behind API responses.

**Solutions Implemented**:
- **Leave module availability pre-check**: Global setup validates that the leave module is active before provisioning leave data; tests skip gracefully if the module is disabled
- **API-first leave validation**: After applying leave via UI, polled the `/api/leave/balance` endpoint instead of waiting for UI updates. Captured both status code and updated balance in the response.

**Result**: Reliable leave testing even when the leave module toggles; reduced leave-related failures from 8% to ~1%.

---

### 9. Stale Global Auth Context Across Workers

**Challenge**: A single shared authenticated context (stored as `storageState`) was persisted to disk and reused by all workers. When one worker's session expired and was refreshed, other workers continued using the stale context, leading to authorization failures and session corruption.

**Solutions Implemented**:
- **Per-worker auth context files**: Changed from a single shared `admin-auth.json` to per-worker files (e.g., `admin-auth-${PID}.json`)
- **Worker-scoped fixture initialization**: Each fixture initializes a fresh context on test startup; expired tokens are refreshed per worker without affecting siblings
- **Lock flag for refresh races**: Even with per-worker contexts, a lock flag prevents the same worker from attempting simultaneous token refreshes (which can occur during Playwright retry logic)

**Result**: Eliminated context corruption; workers became fully independent; test stability improved significantly under high parallelisation.

---

### 10. Locator Instability & Self-Healing Fallbacks

**Challenge**: OrangeHRM's lack of test IDs forced reliance on CSS selectors. Selectors were fragile when DOM structure changed; tests would break on UI tweaks.

**Solutions Implemented**:
- **Grouped, layout-based selectors**: Instead of targeting individual elements, selectors identified component containers (e.g., `.oxd-input-group` wrapping both input and error message), making them resilient to internal structure changes
- **Fallback locator chains**: For critical elements, defined multiple locator strategies in order of preference (e.g., try by role, fall back to CSS class, then by placeholder)
- **Self-healing approach**: Page objects exposed locator logic through public methods; refactoring a selector in one place fixes all tests that depend on it

**Result**: Reduced locator-related failures; easier maintenance when OrangeHRM UI updates occur.

---

## ⚙️ Tech Stack
| Tool | Version | Purpose |
|---|---|---|
| **Playwright** | 1.59.1 | Cross-browser automation — Chrome, Firefox, Safari |
| **TypeScript** | 5.2+ | Strict mode ON; explicit types throughout |
| **ESLint + TS Plugin** | 8.59.0+ | Import guards, no-unused-vars, framework boundary enforcement |
| **Pino Logger** | 10.3.1 | Structured JSON logging with test context decoration |
| **Allure Reporting** | 3.7.2 | Test reports with screenshots, traces, trends, flakiness data |
| **Axe-Core (Playwright)** | 4.11.2 | WCAG 2AA accessibility scanning per test |
| **Lighthouse** | 13.1.0 | Performance SLA assertions (load time, API response time) |
| **Mailtrap** | 4.5.1 | Email sandbox API for password-reset flow interception |
| **dotenv** | 17.4.2 | Environment variable management |
| **Node.js** | 24 LTS | Runtime |
| **Perplexity, ChatGPT, Claude, GitHub Copilot + Playwright MCP** | — | AI-assisted test discovery, architecture decisions, code generation, review & debugging |

---

## 🧪 Test Strategy

### Business Critical Areas
| Area | What Can Go Wrong? | IMPACT |
|---|---|---|
| **Authentication** | User locked out / UnAuthorized access | Organization wide outage / Data Breach |
| **Role Management** | Employee got free access to admin privilege features | Compliance & Security Risk |
| **Employee Data** | Wrongful Create, Update or Delete | Payroll, Legal or Audit issues |
| **Leave Workflow** | Incorrect Leave Balances | Payroll disputes & Legal Risks |
| **Data Integrity** | Duplicate or Missing Employee(s)  | Reporting & Compliance Risk |
| **API** | Contract Breaks | Larger Blast radius, Irreversible loss of trust, Legal & Compliance Risk |

### Parallelisation & Retry Strategy

- **Local**: 3 parallel workers, 1 retry on failure
- **CI**: 2 parallel workers, 2 retries on failure
- **Flakiness mitigation**:
  - Playwright's built-in auto-retrying assertions (`expect`) used throughout — `waitForTimeout` is absent from the codebase
  - `doRetriedPolling()` for timing-sensitive operations that cannot use event-driven waiting
  - `toHaveText()` and `toHaveCount()` / `not.toHaveCount(0)` in place of `textContent()` and `count()` — the former retry automatically; the latter are point-in-time snapshots that produce flaky results under load
  - Navigation uses `waitUntil: 'load'` (not `networkidle`, which is fragile on apps with background polling)
  - All URLs constructed as relative paths via Playwright's `baseURL` — no hardcoded origins

### Cross-Browser Configuration
| Browser | Viewport | Special Config | CI Run |
|---|---|---|---|
| **Chrome** | 1280×720 | Standard | ✅ |
| **Firefox** | 1280×720 | Standard | ✅ |
| **Safari (Webkit)** | 1280×720 | 1.5× timeout multiplier | ✅ |

Safari's JavaScript execution is measurably slower; the multiplier prevents false failures without masking real timing regressions.

---

## 📖 Key Learnings & Best Practices

### 1. Worker Tuning is Non-Obvious

Initially, the assumption was that running tests with the maximum number of workers (based on CI machine CPU count) would be optimal. In practice, adding more workers increased failures from 10% to 30%+. The AUT has limits on how many concurrent sessions it can handle gracefully. After stress testing and observation, a **2-worker setup** emerged as optimal for this AUT — high parallelisation without overwhelming the server.

**Takeaway**: Parallelisation is not a function of machine capability alone — tune based on AUT load capacity. Use stress testing (running the same test suite 10+ times sequentially) to identify the breaking point.

---

### 2. Playwright's Auto-Wait is Transformatively Powerful — Use It Correctly

Transitioning from point-in-time DOM snapshots (`element.textContent()`, `element.count()`) to auto-retrying assertions (`toHaveText()`, `toHaveCount()`) reduced mysterious failures significantly. The key: **the assertion retries the condition**, not the preceding action. Using `toHaveText()` waits for text to appear; using `textContent()` with a manual wait is fragile because the wait may complete before the DOM updates.

**Takeaway**: Playwright's built-in assertions are more reliable than manual waits + custom checks. Avoid `waitForTimeout()` and `waitUntil: 'networkidle'`; rely on event-driven assertions instead.

---

### 3. API-First Validation Where Possible

Validating leave balance via API response (both status and data) is faster and more reliable than refreshing the UI and scraping the DOM. Similarly, checking auth state via a dedicated API call (vs. navigating the login page) is 300ms faster and deterministic. This is not just a speed optimisation — it separates the concern of "did the operation work?" from "is the UI reflecting the result?"

**Takeaway**: Use API-driven validation for business logic; reserve UI testing for user-facing features (layout, accessibility, visual feedback). Hybrid testing (API + UI in the same test) is powerful when each layer tests its own concern.

---

### 4. Fail Fast is Underrated

Global setup includes baseline checks: Is the AUT reachable? Is the admin user creation endpoint responding? Are the leave and recruitment modules active? These checks run once before any worker starts. Failures here halt the entire suite immediately with a clear error, providing quick feedback. Without this gate, a broken AUT would cause silent, widespread test failures 10 minutes into a run.

**Takeaway**: Invest in pre-suite sanity checks. They save hours of debugging and provide faster feedback loops.

---

### 5. Cross-Cutting Concerns Must Be Centralized

Auth, logging, user creation, leave allocation — these are not test-specific. They live in utils, fixtures, and global setup. Test code remains focused on assertions; infrastructure stays in infrastructure code. This separation enabled refactoring the auth manager (token refresh, CSRF extraction, lock flags) without touching a single test file.

**Takeaway**: Identify cross-cutting concerns early (setup, data, auth, logging); centralize them; test code should be thin and readable.

---

### 6. Accessibility Is Not "Optional"

Embedding WCAG 2AA scans directly in functional tests (not in a separate, lower-priority suite) surfaced real issues (password field contrast violations) and ensured they were prioritised for fixes. Treating accessibility as a blocking test condition — not a "nice-to-have" — changes organizational behaviour.

**Takeaway**: Integrate accessibility checks into the main test flow; make violations block tests; automation is the fastest way to catch regressions.

---

### 7. Browser-Specific Workarounds Are Acceptable When Scoped

Rather than avoiding Webkit entirely, the framework accommodates its limitations (slower JS execution, UI freezing during network activity) with targeted workarounds: a 1.5× timeout multiplier and platform-specific branching where unavoidable. This allows cross-browser coverage without sacrificing stability.

**Takeaway**: Embrace browser quirks where they're unavoidable; use multipliers and platform-specific logic; avoid removing browser coverage just because one browser is trickier.

---

### 8. Version Control for Baselines Is Essential

Visual snapshots (screenshots) must be committed to the repository and versioned like any other baseline. When a snapshot changes legitimately (e.g., design update), a developer approves the new snapshot, commits it, and the next CI run uses the updated baseline. This workflow prevents accidental visual regressions without requiring manual review on every run.

**Takeaway**: Screenshots and other visual baselines are code; version control them; require explicit approval for updates.

---

### 9. Logging Discipline Pays Dividends

Every test logs significant actions (page navigations, assertions, API calls, user interactions). When a test fails, the logs tell the story — exactly where execution went wrong and what state the application was in. Logs are structured (JSON via Pino), decorated with test name and worker ID, making correlation easy in CI.

**Takeaway**: Log liberally; use structured logging; treat logs as primary debugging artifact, not a secondary nicety.

---

### 10. Framework Constraints Enable AI Collaboration

Strict typing (TypeScript strict mode), clear coding standards (ESLint import guards, fixture conventions), and documented patterns (in `.github/copilot-instructions.md`) make it possible for AI-assisted code generation to produce conformant output. Without these constraints, AI-generated code would require extensive rework. With them, generated code often requires only minor adjustments.

**Takeaway**: Invest in framework discipline early; it enables both human collaboration and AI-assisted workflows.

---

## 🚀 How to Run

### Environment Setup

```bash
npm install
cp autCred.env.example autCred.env
# Edit autCred.env — see Configuration section for all variables
```

### Run Tests

```bash
# Full suite (Chrome, Firefox, Safari) — also runs ESLint pre-flight
npm run testscript

# Specific feature on one browser
npm run testscript -- auth --project=staging-chrome

# Single test by title pattern
npm run testscript -- "Login.*Password" --project=staging-chrome
```

### View Reports

```bash
# Allure report (trends, flakiness history, failure breakdown)
npm run allure-report

# Playwright HTML report (screenshots, traces, video playback)
npx playwright show-report
```


## 📊 CI/CD Pipeline

**GitHub Actions** (`.github/workflows/playwright.yml`)

[🚀 Trigger Manual Run](https://github.com/HussainiMD/OrangeHRM-Automation-Suite/actions/workflows/playwright.yml) — Click **"Run workflow"** to execute on-demand without a code push.

| Step | Trigger | Action |
|---|---|---|
| Checkout | PR / push to main | Full git history (needed for Allure trend data) |
| Test | Normal push | Full cross-browser suite (Chrome + Firefox + Safari) |
| Test | `workflow_dispatch` | Update visual baselines |
| Report | Always (incl. failure) | Upload Allure artifacts + publish to GitHub Pages |
| Commit | `workflow_dispatch` only | Push updated baseline screenshots to repo |

**Run time**: ~30–45 minutes (3 browsers, 2 parallel workers in CI).

---

## 📝 Code Quality Standards
| Standard | Enforcement |
|---|---|
| **TypeScript strict mode** | `tsconfig.json` — no implicit `any`, no unguarded nulls |
| **ESLint import guards** | `@playwright/test` only in `base.ts`; `axios` banned entirely |
| **No arbitrary waits** | `waitForTimeout` is absent; `doRetriedPolling()` or auto-retrying assertions used throughout |
| **Auto-retrying assertions** | `toHaveText()`, `toHaveCount()`, `not.toHaveCount(0)` — not `textContent()` or `count()` |
| **Relative navigation** | `page.goto('/relative/path')` via `baseURL` — no hardcoded origins |
| **const over let** | Immutable bindings by default; `let` only where reassignment is genuinely required |
| **Test naming** | `TC_FEATURE_NNN \| Feature area \| Human-readable scenario` |
| **Logging discipline** | Every significant step logged; failures at `warn`/`error`; no `console.log` in production paths |
| **Comments** | Explain *why*, not *what*; code is self-documenting at the *what* level |

---

## 🤖 AI-Assisted Development Workflow
This project was built using a structured, multi-model AI workflow — each tool assigned to the phase where it adds the most value. The output reflects deliberate engineering decisions; AI accelerated velocity and surfaced alternatives, but every architectural choice and code pattern was evaluated, challenged, and in several cases overridden based on the specific context of this framework.

### Tool Allocation by Phase
| Phase | Tool(s) | How It Was Used |
|---|---|---|
| **Test Case Discovery** | Perplexity | Research-phase ideation — surfacing edge cases, OWASP-aligned security scenarios, accessibility standards (WCAG 2AA criteria), and OrangeHRM domain-specific failure modes before writing a single line of code |
| **Architecture Decisions** | Claude, ChatGPT | Evaluating design trade-offs: fixture-based DI vs. beforeEach auth, global setup strategies, worker isolation patterns, error boundary design in teardown hooks |
| **Coding & Code Review** | Claude, ChatGPT, GitHub Copilot | First-draft generation of utilities, page objects, and fixture scaffolding; iterative review cycles identifying anti-patterns (point-in-time assertions, fragile navigation strategies, implicit `any` leakage) |
| **Debugging** | Claude, ChatGPT | Root-cause analysis on race conditions (parallel worker auth refresh), date boundary bugs, CI/local execution divergence, and Playwright retry behaviour edge cases |
| **Hands-Off Test Generation** | GitHub Copilot + Claude + Playwright MCP Agent | Agentic pipeline for spec file generation — MCP agent reads workspace structure and existing patterns, generates conformant test code against the established fixture and POM conventions, reviewed and refined before commit |

### What This Workflow Produced (and What It Didn't)
The AI pipeline meaningfully accelerated three things: **discovery** (edge cases that would have taken hours of manual analysis), **scaffolding** (boilerplate that matched established patterns), and **review cycles** (catching anti-patterns across files systematically rather than file-by-file).

Unlike the popular belief. AI needs HAND HOLDING, drawing fence line, more precise instructions, psuedo code and watchful eye. Otherwise, it causes "*shooting in the foot*" kind of situation, very easily!!

The `.github/copilot-instructions.md` file in the repository documents the coding standards and architectural patterns that constrain AI-generated code — ensuring generated output conforms to the framework's conventions before it is accepted.

---
## 📚 References

- [Playwright Documentation](https://playwright.dev)
- [Allure Reporting](https://docs.qameta.io/allure/)
- [Axe-Core Accessibility Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mailtrap API Docs](https://api-docs.mailtrap.io/)
- [Pino Logger](https://getpino.io/)
- [WCAG 2AA Guidelines](https://www.w3.org/WAI/WCAG2AA-Conformance)
- [Web Vitals & Lighthouse](https://web.dev/vitals/)

---

## 🎓 Deep Dives & Extended Reading

### Primary Document: AI-Augmented Development Operations
📖 **[AI-COLLABORATION.md](./AI-COLLABORATION.md)** — A comprehensive operational guide on building production systems with AI-assisted development. Covers:
- Tool allocation by development phase (discovery, architecture, coding, debugging, agentic generation)
- Velocity metrics & ROI analysis 
- Guardrail design patterns (soft + hard layers to prevent hallucinations and enforce standards)
- Challenge resolution & lessons learned (handling token limits, model drift, session discipline)
- Operational framework for teams scaling AI collaboration across projects

**Recommended for**: Engineering leaders, team architects, SDETs evaluating AI-assisted testing, hiring managers assessing engineering maturity.

---
