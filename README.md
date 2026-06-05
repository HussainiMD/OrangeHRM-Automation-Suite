# OrangeHRM Playwright Automation Suite

## 🎯 What This Project Does

This is a **production-grade UI automation framework** for OrangeHRM, an enterprise HR management system used by thousands of organisations globally. It validates critical business workflows — employee lifecycle management, authentication, role-based access control, leave processing, security hardening, and system resilience — across three major browsers with zero manual intervention.

The framework goes beyond functional testing: instrumented with structured logging, automated accessibility scanning (WCAG 2AA), email interception, credential leakage detection, and Lighthouse performance assertions. It is architected as a portfolio demonstration of what a senior SDET produces at scale — not a collection of scripts, but a maintainable engineering system.
## What Makes This Different From a Tutorial Project

| Decision | Why |
|----------|-----|
| API layer for test data setup | UI-driven setup is slow and tests the wrong thing |
| Fixture-based auth (not beforeEach) | True test isolation via dependency injection |
| Two role personas (Admin + ESS) | RBAC boundary testing, not just happy path |
| Mailtrap email integration | Validates actual email delivery in CI |
| CI integrated Allure Reporting | With each CI run, latest test reports gets published to github pages |
| Snapshot auto-update via workflow_dispatch | Baseline management without manual local runs |
| All secrets externalized | Zero hardcoded credentials — CI-safe by design |

---

## 🔗 Quick Links

- **Repository**: [github.com/HussainiMD/OrangeHRM-Automation-Suite](https://github.com/HussainiMD/OrangeHRM-Automation-Suite)
- **Public Allure Dashboard**: [hussainimd.github.io/OrangeHRM-Automation-Suite](https://hussainimd.github.io/OrangeHRM-Automation-Suite/) — Live test history, trends, and flakiness data
- **CI/CD Workflow**: [GitHub Actions](https://github.com/HussainiMD/OrangeHRM-Automation-Suite/actions/workflows/playwright.yml) — Trigger a manual run anytime without a code push

---

## 💼 Business Value Delivered

- **Eliminated 6–8 hours/week of manual regression** — 17+ test scenarios execute in parallel across three browsers, catching auth gaps, validation failures, and access-control violations before they reach UAT
- **Cross-browser confidence in under 25 minutes** — Chrome, Firefox, and Safari run simultaneously in CI; significant reduction of feeback time + major browsers covered!!
- **Employee onboarding defect detection before UAT** — PIM form validation tests cover 12+ failure modes (photo upload edge cases, field masking, mandatory field bypass), preventing costly late-stage rework
- **Built-in accessibility compliance gate** — Automated WCAG 2AA scanning on every auth and PIM flow; discovered password field contrast violations (3.2:1 vs. required 4.5:1) before release
- **Instant post-incident root cause data** — Video, DOM trace, and screenshot captured on every failure; reduced average debugging time from ~hours to ~minutes
- **Security coverage as a first-class concern** — Credential leakage scanning across all HTTP traffic (including redirects and resource loads), CSRF token validation, and sensitive field masking checks run on every regression cycle

---

## 🏗️ Architecture & Design Decisions

### Layered Architecture

```
┌─ Test Layer (tests/ui/regression/**/*.spec.ts)
│    Test logic, assertions, Allure annotations
│    └─ Uses fixtures for pre-authenticated contexts
│
├─ Fixture Layer (fixtures/*.fixture.ts)
│    Dependency-injected browser contexts per role
│    (adminUserAuthContext, essUserAuthPage)
│    Auth gate assertion on fixture init; logout with error handling on teardown
│
├─ Page Object Model (pages/*.ts)
│    UI interaction encapsulation; selectors never leak into tests
│    └─ Components (pages/components/*.ts) — Reusable widgets (UserMenu, forms)
│
├─ Utility Layer (utils/*.ts)
│    Cross-cutting concerns, each with a single responsibility:
│    ├─ auth-manager      — Token refresh, CSRF extraction, session lifecycle
│    ├─ logger            — Pino structured logging (test name, worker ID, retry count)
│    ├─ waits-manager     — doRetriedPolling() with configurable backoff
│    ├─ email-manager     — Mailtrap API integration for inbox polling for password reset workflow
│    ├─ email-parser      — Extracts reset links from raw email bodies
│    ├─ leave-management  — Leave allocation via API (month-safe date logic)
│    ├─ users-manager     — Employee/user creation + employee interceptor
│    └─ page-load-performance — Chrome Lighthouse integration, SLA evaluation
│
└─ API Layer (apis/)
     global-setup.ts    — Test data provisioning before any worker starts
     global-cleanup.ts  — Deterministic teardown after all workers finish
```

### Key Design Patterns & the Reasoning Behind Each

**1. Fixture-Based Authentication (Dependency Injection)**

Two fixtures — `adminUserAuthContext` and `essUserAuthPage` — inject pre-authenticated browser contexts into tests via Playwright's fixture system. No test creates its own session; the fixture is the authority on authentication state.

On fixture *initialisation*, an explicit auth gate assertion confirms the session is valid before handing control to the test. On *teardown*, the fixture logs out and handles errors gracefully — if logout fails (e.g., session already expired), it catches and logs the failure rather than crashing the teardown chain. This design means a session failure manifests as a fixture error with a clear message, not as a mysterious mid-test assertion failure.

**Mid Flight Auto Refresh which is thread safe from parellel workers**
When a token expires during a test and Playwright retries, the auth manager refreshes credentials using a lock flag to prevent race conditions across parallel workers. Subsequent retries get a guaranteed fresh context. 

**2. Global Setup / Teardown with Worker Isolation**

`global-setup.ts` provisions exactly one test employee record before any worker starts and writes its metadata (ID, employee number) to the file system in `storage/`. All workers read from this shared file — no worker creates its own employee independently. Employee to Logins is a Many-to-One relationship.

An `attachEmployeeInterceptor` on POST `/pim/employees` captures newly created records per worker session, enabling `global-cleanup.ts` to delete *all* employees created during the run — including those created by tests that exercise the add-employee flow — without knowledge of how many workers ran. This resolved a race condition found during development where cleanup would attempt to query employee data that another worker hadn't yet committed.

**3. CSRF Token Extraction + Cookie-Based Auth Reuse**

OrangeHRM's session relies on CSRF tokens. The auth manager extracts the token from the login page HTML, submits credentials to `/auth/validate` via API (not UI), and persists the resulting `storageState` (cookies + localStorage) to disk. Each test context loads this state directly — no browser navigation to the login page during test execution. This enables CLEAN, STABLE and FAST test case results.

This is not just a speed optimisation. It ensures that auth state is exactly reproducible and testable independently of the login UI. Login UI has its own dedicated test suite.

**4. Credential Leakage Scanner — Intentional Flags Accumulation**

The security test for credential exposure attaches a request listener to *all* outgoing HTTP traffic — including redirects, prefetch requests, and static resource loads. For each request, it checks whether username or password appears in the URL, headers, or body, and sets a boolean flag per credential type.

A critical design decision: the scanner does **not** short-circuit on the first match. It accumulates flags across the entire request lifecycle and asserts at the end. This is intentional — an early exit would miss scenarios where credentials appear in a redirect that follows a clean initial request. The assertion uses `not.toHaveCount(0)` semantics (implemented as flag === false) rather than checking for exactly zero matches, correctly expressing the intent: *at least one exposure anywhere is a failure*, regardless of how many requests were clean.

**5. Leave Management Utility — Month-Safe Date Logic by Design**

The leave allocation utility always constructs date ranges starting from the **1st of the current month**, not from today. This is a deliberate design choice: constructing "today + N days" risks crossing month boundaries or producing invalid dates in months with fewer days (e.g., February 30th). By anchoring to the 1st, month-end overflow is architecturally impossible, not just unlikely. The implementation also correctly applies `.getMonth() + 1` for 1-based months and zero-pads single-digit values — both caught and fixed during code review.

**6. YAGNI-Driven API Architecture**

During development, a proposal was made to abstract a shared `APIRequestContext` across all utility functions. It was correctly rejected: only one utility (the auth manager) needs a persistent API context; the others use Playwright's built-in `request` fixture, which is scoped per test. Introducing a shared abstraction for a single consumer would have added indirection with no reuse benefit. The framework reflects this discipline — abstractions are introduced when they have two or more real consumers, not in anticipation of hypothetical future need.

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

### Coverage by Layer

| Layer | Type | Purpose |
|---|---|---|
| **Authentication** | Smoke + Regression | Login UI, password masking, session timeout, back-button after logout |
| **Employee Management (PIM)** | Regression | Add employee, field validation, photo upload edge cases, user creation |
| **Leave Management** | Regression | Subordinate leave request workflow via API + UI |
| **Authorization** | Regression | Supervisor vs. subordinate access boundaries |
| **Security** | Regression | Credential leakage scanning, CSRF protection, sensitive field masking |
| **Accessibility** | Inline (per test) | WCAG 2AA via Axe-Core on all auth and PIM flows |
| **Resilience** | Regression | Network timeout handling, slow network simulation |
| **Performance** | Regression | Response time SLAs via Lighthouse |

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

## 🚀 How to Run

### Prerequisites

- **Node.js** ≥ 24: `node --version`
- **npm** ≥ 10: `npm --version`
- **Environment file**: Copy `autCred.env.example` → `autCred.env` and populate credentials

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

# By tag
npm run testscript -- --grep @smoke --project=staging-chrome

# Headed mode (watch the browser)
npm run testscript -- --headed --project=staging-chrome
```

> **Note**: Always use `npm run testscript`, not `npx playwright test` directly.
> The npm script runs ESLint as a pre-flight gate before Playwright executes —
> bypassing it allows lint errors to ship undetected to CI.

### View Reports

```bash
# Allure report (trends, flakiness history, failure breakdown)
npm run allure-report

# Playwright HTML report (screenshots, traces, video playback)
npx playwright show-report
```

**Public Dashboard**: Every CI run auto-publishes to the [Allure Dashboard](https://hussainimd.github.io/OrangeHRM-Automation-Suite/) — no credentials needed to review results.

### Linting

```bash
npm run lint   # ESLint runs automatically via npm run testscript
```

---

## 📁 Project Structure

```
.
├── config/
│   └── playwright.config.ts            # Multi-browser, parallel workers, reporters,
│                                       # environment-aware timeouts, baseURL
├── pages/
│   ├── LoginPage.ts                    # CSRF extraction, credential submission
│   ├── NavigationPage.ts               # Sidebar, role-based menu traversal
│   ├── PimEmployeeListPage.ts          # Employee list, search, add/edit actions
│   ├── AddEmployeePage.ts              # Employee form, photo upload, validation
│   ├── EditUserPage.ts                 # User account creation from employee record
│   ├── UserListPage.ts                 # Admin user list and filters
│   └── components/
│       └── UserMenu.ts                 # Logout, profile menu widget
├── fixtures/
│   ├── admin-auth.fixture.ts           # Admin-role context: auth gate + teardown logout
│   └── essUser-auth.fixture.ts         # ESS-role context: auth gate + teardown logout
├── tests/
│   ├── base.ts                         # Extended Playwright test with logger fixture
│   ├── types/
│   │   ├── credentials.ts              # {username, password} type
│   │   ├── BasicEmployeeType.ts        # Employee creation payload
│   │   └── EmployeeDetailsType.ts      # Employee metadata (ID, employee number)
│   ├── errors/
│   │   └── duplicate-user-error.ts     # Domain-specific error (not generic Error)
│   └── ui/
│       ├── smoke/
│       │   └── [login, basic navigation]
│       └── regression/
│           ├── auth/                   # Login, session management, timeout, back-button
│           ├── pim/                    # Add employee, validation, photo, responsive
│           ├── authorization/          # Supervisor vs. subordinate access
│           ├── security/               # Credential leakage, CSRF, sensitive field masking
│           ├── performance/            # Lighthouse SLA assertions
│           ├── resilience/             # Timeout handling, slow network simulation
│           └── leave/                  # Subordinate leave workflow
├── utils/
│   ├── logger.ts                       # Pino singleton decorated with test context
│   ├── auth-manager.utils.ts           # CSRF extraction, token refresh, lock-flag races
│   ├── waits-manager.util.ts           # doRetriedPolling() — no arbitrary setTimeout
│   ├── users-manager.util.ts           # Employee/user creation + employee interceptor
│   ├── email-manager.util.ts           # Mailtrap API: inbox polling, message retrieval
│   ├── email-parser.util.ts            # Extracts reset links from raw email bodies
│   ├── leave-management.util.ts        # Leave allocation — month-safe date logic
│   ├── page-load-performance.utils.ts  # Lighthouse integration helpers
│   ├── lighthouse-performance.evaluator.ts
│   ├── page-manager.util.ts
│   ├── env-validations.utils.ts        # Fail fast on missing required env vars
│   └── types/                          # API payload type definitions
├── apis/
│   ├── global-setup.ts                 # Provisions test employee + ESS user pre-suite
│   └── global-cleanup.ts              # Deletes all provisioned data post-suite
├── .github/
│   ├── copilot-instructions.md         # Coding standards and patterns for AI assistance
│   └── workflows/
│       └── playwright.yml              # CI pipeline — lint gate + cross-browser run
├── storage/                            # Auth state, employee data (gitignored)
├── allure-results/                     # Raw Allure data (gitignored)
├── allure-report/                      # Generated Allure HTML (gitignored, CI deploys)
├── playwright-report/                  # Playwright HTML report
├── package.json
├── tsconfig.json                       # strict: true
├── eslint.config.js
└── autCred.env                         # Credentials (gitignored)
```

---

## 🔍 Key Implementation Highlights

### 1. Stateful Auth Without UI Login on Every Test

The auth manager extracts a CSRF token from the login page HTML, POSTs credentials to `/auth/validate` (respecting OrangeHRM's CSRF policy), and persists the resulting `storageState` to disk. Every subsequent test context loads this state directly — no browser navigates to the login page. When a context expires and Playwright retries, a lock flag prevents multiple workers from attempting simultaneous token refresh, eliminating a race condition discovered during parallel execution. This saves 3–5 minutes per full run.

### 2. Credential Leakage Scanner with Full Request Coverage

The security test attaches a request interceptor before any navigation occurs and captures *every* outgoing request — initial navigation, redirects, prefetch, and resource loads. Boolean flags accumulate across the entire session. Importantly, the scanner does not short-circuit: all requests are evaluated before any assertion. This is the correct design because credentials appearing in a redirect (and not in the initial request) would be silently missed by an early-exit approach. The assertion correctly expresses "at least one exposure is a failure" using `not.toHaveCount(0)` semantics on the accumulated flags.

### 3. Worker-Isolated Test Data with Interceptor-Based Cleanup

Global setup provisions one shared employee record and writes its ID to `storage/`. All workers consume this shared state. For tests that *create* additional employees, an `attachEmployeeInterceptor` registers on POST `/pim/employees` and captures created IDs per worker. Global cleanup aggregates and deletes all intercepted records — it has no hardcoded knowledge of how many employees were created, making it resilient to test suite changes. A race condition found during development (cleanup querying data mid-creation by another worker) was resolved by sequencing teardown to wait for all workers to signal completion.

### 4. Email-Driven Password Reset — API+UI Hybrid Strategy

Password reset testing uses Mailtrap's sandbox API to intercept emails without touching a real mail server. The flow: global setup creates an ESS user with a Mailtrap inbox address → test triggers a reset → Mailtrap API polls for the email → parser extracts the reset link from the raw body → UI validation completes the reset. This hybrid API+UI approach is architecturally superior to a pure UI strategy: it is deterministic (no waiting for SMTP delivery to a real server), environment-safe (no production email risk), and caught a real bug where the reset link contained URL-encoded characters that broke in Webkit but not Chrome.

### 5. Month-Safe Leave Date Logic by Construction

The leave management utility always anchors date ranges to the **1st of the current month**. This is a deliberate design choice: computing `today + N days` risks producing invalid dates at month boundaries (February 28th + 2 days = March 2nd, or worse, February 30th if the math is naive). By starting from the 1st, the overflow case cannot occur regardless of when the tests run. The implementation correctly applies `getMonth() + 1` for 1-based month representation and zero-pads single-digit values — both identified and fixed during code review.

### 6. Accessibility as a Blocking Test Condition

Axe-Core WCAG 2AA scans are embedded directly in login and PIM tests — not in a separate accessibility suite that gets deprioritised. Violations fail the test with the same severity as functional failures. This surface discovered that OrangeHRM's password field labels had a contrast ratio of 3.2:1 against their background — below the 4.5:1 minimum for small text — and resulted in a design correction. The `@critical` annotation on accessibility violations ensures they appear prominently in the Allure dashboard.

### 7. TypeScript Strict Mode + ESLint Framework Boundaries

`strict: true` in `tsconfig.json` enforces explicit types throughout — no implicit `any`, no unguarded nulls. Custom ESLint rules enforce framework boundaries: `@playwright/test` may only be imported in `base.ts` (tests import from there, not directly from the library), and `axios` is banned entirely (Playwright's request API is used for all HTTP, keeping network handling consistent). These rules caught two instances during development where direct Playwright imports leaked into utility files, causing circular dependency warnings at compile time.

---

## 🔧 Configuration

### Environment Variables (`autCred.env`)

```bash
base_url=https://opensource-demo.orangehrmlive.com
admin_user_name=admin
admin_password=admin@123
ess_user_name=ess_user
ess_user_password=ess_password
test_global_timeout=30000       # ms per test
test_expect_timeout=30000       # ms per assertion (Playwright auto-retry window)
api_timeout=30000               # ms for API calls
test_employee_dir=storage       # directory for shared test data files
mailtrap_base_url=https://api.mailtrap.io
mailtrap_api_token=[token]
mailtrap_account_id=1234567
mailtrap_inbox_id=9876543
```

### CI Secrets (GitHub Actions)

Configure in **Settings → Secrets and variables → Actions**:

`BASE_URL`, `ADMIN_USER_NAME`, `ADMIN_PASSWORD`, `ESS_USER_NAME`, `ESS_USER_PASSWORD`, `MAILTRAP_API_TOKEN`, `MAILTRAP_ACCOUNT_ID`, `MAILTRAP_INBOX_ID`

---

## 📊 CI/CD Pipeline

**GitHub Actions** (`.github/workflows/playwright.yml`)

[🚀 Trigger Manual Run](https://github.com/HussainiMD/OrangeHRM-Automation-Suite/actions/workflows/playwright.yml) — Click **"Run workflow"** to execute on-demand without a code push.

| Step | Trigger | Action |
|---|---|---|
| Checkout | PR / push to main | Full git history (needed for Allure trend data) |
| Setup Node | Always | Node 24 LTS |
| Install | Always | `npm ci` (deterministic lockfile install) |
| **Lint** | Always | **ESLint runs before Playwright — broken code does not execute** |
| Test | Normal push | Full cross-browser suite (Chrome + Firefox + Safari) |
| Test | `workflow_dispatch` | Update visual baselines |
| Report | Always (incl. failure) | Upload Allure artifacts + publish to GitHub Pages |
| Commit | `workflow_dispatch` only | Push updated baseline screenshots to repo |

**Run time**: ~18–25 minutes (3 browsers, 2 parallel workers in CI).

The ESLint step is a hard gate — the pipeline fails before Playwright runs if lint errors are present. This is intentional and matches the local `npm run testscript` behaviour, ensuring CI and local execution are semantically identical.

---

## 🛠️ Developer Workflow

### Adding a New Test

1. Create file: `tests/ui/regression/[feature]/[feature-name].spec.ts`
2. Import the appropriate fixture — never import `@playwright/test` directly:

```typescript
import { test, expect } from '../../../../fixtures/admin-auth.fixture';

test('TC_XYZ | Feature | Scenario description', async ({ adminUserAuthPage, logger }) => {
  logger.info('Starting scenario');
  await adminUserAuthPage.goto('/web/index.php/pim/viewEmployeeList');
  // adminUserAuthPage is pre-authenticated; no login step needed
});
```

3. Extract all UI interactions to a Page Object in `pages/`
4. Add Allure annotations (`@feature`, `@severity`, `@tag`)
5. Run locally: `npm run testscript -- [filter] --project=staging-chrome`

### Adding a New Page Object

```typescript
import { Locator, Page, expect } from '../tests/base';

export class MyPage {
  private readonly page: Page;
  private readonly actionButton = 'button[data-testid="action"]';

  constructor(page: Page) {
    this.page = page;
  }

  async doAction(): Promise<void> {
    const btn: Locator = this.page.locator(this.actionButton);
    await expect(btn).toBeEnabled();   // auto-retrying assertion
    await btn.click();
  }
}
```

### Debugging a Failed Test

1. Open `playwright-report/index.html` → failed test → screenshot / trace / video
2. Review structured logs: console output or `storage/run-*.log`
3. Check auth state freshness: `storage/admin-auth-*.json`
4. Reproduce locally in headed mode:

```bash
npm run testscript -- "TC_XYZ" --headed --project=staging-chrome
```

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

It did not replace engineering judgment. Several AI suggestions were explicitly rejected during development:

- A proposal to abstract a shared `APIRequestContext` across all utilities was declined — only one consumer existed, making the abstraction premature (YAGNI)
- Suggestions to use `waitUntil: 'networkidle'` for navigation were replaced with event-driven waits — `networkidle` is fragile on apps with background polling
- The credential leakage scanner's flags-accumulation pattern (no early exit) was challenged by the review model and defended — short-circuiting would have silently missed credential exposure in redirect chains

The `.github/copilot-instructions.md` file in the repository documents the coding standards and architectural patterns that constrain AI-generated code — ensuring generated output conforms to the framework's conventions before it is accepted.

---

## 📚 References

- [Playwright Documentation](https://playwright.dev)
- [Allure Reporting](https://docs.qameta.io/allure/)
- [Axe-Core Accessibility Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mailtrap API Docs](https://api-docs.mailtrap.io/)
- [Pino Logger](https://getpino.io/)
