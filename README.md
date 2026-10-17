# OrangeHRM Playwright Automation Suite

## 🎯 What This Project Does

This is a **pro-grade UI automation framework** for OrangeHRM, an enterprise HR management system used by many organisations world wide. It validates critical business workflows — employee lifecycle management, authentication, role-based access control, leave processing, security hardening, and system resilience — across three major browsers with minimal manual intervention.

The framework goes beyond functional testing: instrumented with structured logging, automated accessibility scanning (WCAG 2AA), email interception, credential leakage detection, and Lighthouse performance assertions. It is architected as a PORTFOLIO demonstration of what a senior SDET can offer — not a collection of scripts, but a maintainable engineering system.

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

## 💼 Business Value Delivered

- **Test coverage at speed** — ~65 test cases execute in parallel across three browsers, catching auth gaps, validation failures, and access-control violations
- **Cross-browser confidence** — Chrome, Firefox, and Safari run simultaneously in CI; significant reduction of feedback time + major browsers covered!!
- **Employee onboarding defect detection before UAT** — PIM form validation tests cover 12+ failure modes (photo upload edge cases, field masking, mandatory field bypass), preventing late-stage rework
- **Built-in accessibility compliance gate** — Automated WCAG 2AA scanning on every auth and PIM flow; discovered password field *contrast* violations (3.2:1 vs. required 4.5:1) before release
- **Instant post-incident root cause data** — Video, DOM trace, and screenshot captured on every failure; reduced average debugging time 
- **Basic Security coverage** — Credential leakage scanning across all HTTP traffic (including redirects and resource loads), CSRF token validation, and sensitive field masking checks run on every regression cycle

---

## 🔗 Quick Links
- **Repository**: [github.com/HussainiMD/OrangeHRM-Automation-Suite](https://github.com/HussainiMD/OrangeHRM-Automation-Suite)
- 🎬 ***Demo***: Hybrid API + UI Password Reset Flow - CLICK on the LINK below
     - [![DEMO video]<img width="50" height="50" alt="password_reset_thumbnail_under_50kb" src="https://github.com/user-attachments/assets/c83dfbb1-7c3b-4b46-8bd9-777b9c9e1af1" />](https://youtu.be/3aTzZftW2K0)
          - <small>Playwright pauses after triggering reset → Mailtrap inbox shows email landing in real time → script resumes, pulls link via API, completes recovery across browsers.</small>
- **Public Allure Dashboard**: [hussainimd.github.io/OrangeHRM-Automation-Suite](https://hussainimd.github.io/OrangeHRM-Automation-Suite/) — Live test history, trends, and flakiness data
     - <img width="1862" height="835" alt="Allur_Report_Screenshot" src="https://github.com/user-attachments/assets/8303a5c0-f1cb-484d-9536-bcb443973f5f" />
- **CI/CD Workflow**: [GitHub Actions](https://github.com/HussainiMD/OrangeHRM-Automation-Suite/actions/workflows/playwright.yml) — Trigger a manual run anytime *without* a code push

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

**Mid Flight Auto Refresh which is safe (& consistent) from parallel workers**
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

The leave allocation utility ensures that leaves are pre alloted in the global setup phase. During testing the leave application validation test cases, underlying API response based verification is used to ensure that test stays TRULY INDEPENDENT. There by ensuring that tests can be run in Parallel

**6. YAGNI-Driven API Architecture (balancing right setup and future proofing)**

By design Single Responsibility principle is embraced: Each need has a dedicated utility (e.g auth manager). Cross cutting concerns like logging, setup and data clean up in AUT are abstracted away from the test case. All of them happen behind the scenes!!

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

## 🐛 Bugs & Issues Discovered in OrangeHRM

👉 **[Read BUGS-DISCOVERED.md →](./BUGS-DISCOVERED.md)** to know details of bugs/issues discovered during testing.

---

## 🏔️ Challenges Faced & Solutions Implemented

👉 **[Read CHALLENGES-SOLUTIONS.md →](./CHALLENGES-SOLUTIONS.md)** to know details of challenges and solutions (for them) while working on this project

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
| **Lighthouse & Response times** | 13.1.0 | Performance SLA assertions (load time, API response time) |
| **Mailtrap** | 4.5.1 | Email sandbox API for password-reset flow interception |
| **dotenv** | 17.4.2 | Environment variable management |
| **Node.js** | 24 LTS | Runtime |
| **Perplexity, ChatGPT, Claude, GitHub Copilot + Playwright MCP** | — | AI-assisted test discovery, architecture decisions, code generation, review & debugging |

---

## 📖 Key Learnings & Best Practices

👉 **[Read KEY-LEARNINGS.md →](./KEY-LEARNINGS.md)** to know details of my learnings on this project. Also the best practices followed!!

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

This framework demonstrates **structured AI collaboration** at SCALE — using Claude, ChatGPT, GitHub Copilot, and Playwright MCP to accelerate development without sacrificing quality or control. The approach combines agentic automation with deterministic guardrails. 

**How It Works**: AI handles discovery, scaffolding, and pattern-matching; engineers retain *full authority* over architecture, trade-offs, and validation. Soft guardrails (detailed instructions, pattern examples) are layered with **hard** guardrails (ESLint rules, pre-commit gates, code review checklists).

This demonstrates operational maturity in AI collaboration — not replacing engineers, but amplifying their impact through **disciplined supervision and systematic guardrail design**. The framework is PORTABLE across teams and projects.

👉 **[Read AI-COLLABORATION.md →](./AI-COLLABORATION.md)** for a deep dive into tools, methodologies, metrics, and operational lessons learned.


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

Unlike the popular belief. AI needs HAND HOLDING, drawing fence line, more precise instructions, psudo code and watchful eye. Otherwise, it causes "*shooting in the foot*" kind of situation, very easily!!

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
- Velocity estimates 
- Guardrail design patterns (soft + hard layers to prevent hallucinations and enforce standards)
- Challenge resolution & lessons learned (handling token limits, model drift, session discipline)
- Operational framework for teams scaling AI collaboration across projects

**Recommended for**: Engineering leaders, team architects, SDETs evaluating AI-assisted testing, hiring managers assessing engineering maturity.

---
