# 🐛 Bugs & Issues Discovered in OrangeHRM
This framework identified several functional, security, and UX defects in OrangeHRM that should be addressed:

## Functional Issues
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

## Security Issues
| Issue | Impact | Recommendation |
|---|---|---|
| **No DDOS/Rate Limiting** | There is no detection or mitigation for distributed denial-of-service (DDOS) attacks or brute-force login attempts. Multiple failed login attempts are not rate-limited. | Implement rate limiting (e.g., max 5 login attempts per IP per 15 minutes), IP-based throttling, or CAPTCHA after N failures. |
| **Sensitive Data Exposure** | No field masking for sensitive data (e.g., SSN, tax ID); displayed in plain text in employee records. | Mask sensitive fields in UI; display only last 4 digits; enforce role-based visibility (HR/Payroll only). |

## Usability Issues
| Issue | Impact | Recommendation |
|---|---|---|
| **User Menu Keyboard Inaccessibility** | Top-right user menu is **NOT** keyboard-navigable (no Tab key support, no `tabindex`). Violates WCAG 2AA keyboard accessibility. | Add `tabindex="0"` to menu trigger; implement arrow-key navigation in dropdown; test with keyboard-only users. |
| **Browser Back-Button UX** | After login, pressing browser back button returns to login page, but re-entering credentials does not refresh/redirect to dashboard — the page remains on login. | On successful login, replace history entry (use `history.replaceState()`); redirect to dashboard; prevent back-button loops. |
| **Password Field Contrast Violation** | Password field label has a contrast ratio of 3.2:1 against its background — below the WCAG 2AA minimum of 4.5:1 for small text. | Increase contrast to 4.5:1+; use darker label color or lighter background; validate with Axe-Core. |
| **Username Display Clutter** | Long usernames displayed next to profile picture in header create layout overflow and clunky presentation. | Truncate username (e.g., first 20 chars) with ellipsis; show full name on hover via tooltip. |

## Performance Issues
Chrome DevTools Lighthouse metrics show areas for improvement:

| Metric | Current | Target | Action |
|---|---|---|---|
| **LCP (Largest Contentful Paint)** | Varies | < 4s | Lazy-load off-screen images; reduce main bundle size |
| **CLS (Cumulative Layout Shift)** | Varies | < 0.25 | Pre-allocate space for dynamic content; avoid layout thrashing |
| **TBT (Total Blocking Time)** | Varies | < 600ms | Break long tasks into smaller chunks; defer non-critical work |
| **FCP (First Contentful Paint)** | Varies | < 3s | Inline critical CSS; defer non-critical scripts |
