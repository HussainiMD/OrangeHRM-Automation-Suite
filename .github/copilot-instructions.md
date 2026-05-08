<!-- -
description: Describe when these instructions should be loaded by the agent based on task context
applyTo: "**"
- -->

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

<!-- Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.-->

<!-- Mimic Karapthy: https://github.com/forrestchang/andrej-karpathy-skills/blob/main/CLAUDE.md-->

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

<!-- workspace specifics -->
You are an expert in TypeScript, Frontend development, and Playwright end-to-end testing.
You write concise, technical TypeScript code with accurate examples and the correct types.

## Playwright Best Practices
- Always use the recommended built-in and role-based locators (getByRole, getByLabel, etc.)
- Prefer to use web-first assertions whenever possible
- Use built-in config objects like devices whenever possible
- Avoid hardcoded timeouts
- Reuse Playwright locators by using variables
- Follow the guidance and best practices described on playwright.dev
<!-- - Avoid commenting the resulting code -->

## OrangeHRM Project Guidelines

### Test Execution
- Run tests with: `npm run testscript -- [filter] --project=staging-chrome` (NEVER use `playwright test` directly)
- Tests extend from `tests/base.ts` which includes logger fixture
- Use specific fixtures: `admin-auth.fixture.ts`, `essUser-auth.fixture.ts` for authenticated tests

### Page Object Model (POM) Pattern
- Location: `pages/` directory
- Structure: Class with private selectors + public async methods
- Imports: Use `import {Locator, Page, Response} from "../tests/base"`
- Example: `LoginPage.ts` has `signInWithCredentials()` method
- Extract all page interactions to page objects (not inline in tests)
<!--
### Authentication Flow (Critical)
1. Extract CSRF token from GET /web/index.php/auth/login
2. Validate credentials via POST /web/index.php/auth/validate with CSRF token
3. Store auth state to file (`admin-auth-{PID}.json`)
4. Create browser context with stored auth state
5. Pre-test validation checks token freshness via API
6. Auto-refresh on expiry (lock flag prevents race conditions)
-->
### Component Organization (pages/components/)
- Components are reusable, independent UI elements used across multiple pages
- Structure: `pages/components/[intent]/[category]/ComponentName.ts`
  - **Intent** (outer folder): What the component is intended for (e.g., `auth`, `dashboard`, `admin`, `common`)
  - **Category** (inner folder): Functional area (e.g., `forms`, `menus`, `navigation`, `modals`, `buttons`)
  - **Component**: The actual reusable component class
- Example: `pages/components/auth/forms/LoginForm.ts` or `pages/components/common/navigation/Sidebar.ts`
- Follow POM pattern: private selectors + public async methods
- Import pattern: `import {Locator, Page} from "../../tests/base"`

### Fixture Usage
- Located in `fixtures/`
- For Imports, Figure out the relative path from project structure. Levels can be dynamic (3, 4..etc)
- Provide pre-authenticated contexts (admin, ESS user)
- Auto-cleanup via `use()` pattern
- Example: `adminUserAuthPage` fixture provides pre-authenticated page
- Always use fixtures for authenticated contexts

### Utilities & Helpers
- `logger.ts` → Pino logger (use: `logger.info()`, `logger.warn()`)
-  Log all the failures as warning. And errors as error in logger.
-  Log all important information - calculations, objects returned by functions, response of async operations
- `auth-manager.utils.ts` → Token refresh + validation
- `waits-manager.util.ts` → Use `doRetriedPolling()` for retries (avoid arbitrary waits)
- `users-manager.util.ts` → Create employees/users via API
- Use `doRetriedPolling()` utility for timing-dependent assertions

### File Organization Rules
- Tests: `tests/ui/smoke/*.spec.ts`, `tests/ui/regression/**/*.spec.ts`, `tests/api/**/*.spec.ts`
- Pages: `pages/PageName.ts`
- Fixtures: `fixtures/name-auth.fixture.ts`
- Utilities: `utils/feature-name.utils.ts` or `utils/feature-name.util.ts`
- Types: `tests/types/TypeName.ts`
- Errors: `tests/errors/error-name.ts`

### Type Safety & Code Quality
- Strict mode ON in tsconfig.json
- Define interfaces for custom types
- No unused variables (unless prefixed with `_`)
- Avoid axios (use Playwright request instead)
- All Promises must be awaited
- Import `@playwright/test` only in `tests/base.ts` or test files

### Timeouts & Configuration
- Global timeout: 30s (env var: `test_global_timeout`)
- Expect timeout: 30s (env var: `test_expect_timeout`)
- API timeout: 30s (env var: `api_timeout`)
- Browsers: staging-chrome, staging-firefox, staging-webkit
- Base URL: from `autCred.env` as `base_url`

### Best Practices for New Tests
- Keep tests focused (one scenario per test)
- Use descriptive test names matching test case IDs
- Extract page interactions to page objects
- Use logger for all important steps
- Define custom errors for domain-specific issues (extend from Error)
- Always use fixtures for authenticated contexts
- Leverage TypeScript interfaces for type safety
- Assertion & Wait Strategies: 
- always use playwright provided implicit waits
- Example: use "await expect(locator).toBeVisible()" instead of "await page.waitForLoadState('domcontentloaded')" 
- expect function should provide meaningful message when it fails
- Example: expect(value, 'Clear description of what failed').toBe(true)

### Global Setup/Teardown
- `apis/global-setup.ts` → Runs before all tests (create test employee, add ESS user)
- `apis/global-cleanup.ts` → Runs after all tests (cleanup resources)

### Custom Errors
- Location: `tests/errors/` folder
- Extend Error class with descriptive message
- Use in tests for domain-specific error handling