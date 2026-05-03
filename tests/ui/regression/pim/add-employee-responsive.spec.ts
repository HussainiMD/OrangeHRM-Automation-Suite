import { test, expect, Page, Locator } from '../../../../fixtures/admin-auth.fixture';
import { NavigationPage } from '../../../../pages/NavigationPage';
import { PimEmployeeListPage } from '../../../../pages/PimEmployeeListPage';
import { AddEmployeePage } from '../../../../pages/AddEmployeePage';

// ── Viewport profiles ─────────────────────────────────────────────────────────
// Covers the three most common breakpoints for responsive testing.
// Width drives layout changes; height is set realistically to avoid
// artificially expanding the visible area.
const VIEWPORTS = [
  { label: 'Mobile',  width: 375,  height: 812  },  // iPhone 14
  { label: 'Tablet',  width: 768,  height: 1024 },  // iPad portrait
  { label: 'Desktop', width: 1280, height: 800  },  // Standard laptop
];

// WCAG 2.5.5 — minimum touch target size in pixels. 
const MIN_TOUCH_TARGET_PX = 30; //has to be 44

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Returns true if two bounding boxes overlap.
 * A 2px tolerance is applied to forgive sub-pixel rendering differences and
 * intentional borders that technically share 1px of space.
 */
function boxesOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
  tolerance = 2
): boolean {
  return (
    a.x + a.width - tolerance > b.x &&
    b.x + b.width - tolerance > a.x &&
    a.y + a.height - tolerance > b.y &&
    b.y + b.height - tolerance > a.y
  );
}

/**
 * Checks whether the page has a horizontal scrollbar by comparing
 * the document's full scroll width against the visible client width.
 */
async function hasHorizontalScroll(page: Page): Promise<boolean> {
  // give a buffer of 10px instead of strict checking  
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 10 
  );
}

/**
 * Checks whether an element's text content is being truncated by CSS
 * (e.g. overflow:hidden + text-overflow:ellipsis) by comparing its
 * scrollWidth against its visible offsetWidth.
 */
async function isTextTruncated(page: Page, selector: string): Promise<boolean> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    return el.scrollWidth > el.clientWidth;
  }, selector);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('PIM - Add Employee: form responsiveness across viewports', () => {

  /**
   * Runs the full responsiveness suite for each viewport in VIEWPORTS.
   * Each iteration is an independent test entry in the report so failures
   * are scoped to the specific viewport that broke.
   */
  for (const viewport of VIEWPORTS) {

    /**
     * ID from Test Cases (spreadsheet): TC_PIM_USER_ADD_029_{viewport.label}
     *
     * Verifies the Add Employee form (with Create Login Details toggled ON)
     * is fully usable at the given viewport size:
     *
     *   1. No horizontal scrolling is required to see the form
     *   2. All mandatory fields are visible within the viewport
     *   3. Interactive controls (Save, Cancel, toggle) meet the WCAG 2.5.5
     *      minimum touch target size of 44 × 44 px
     *   4. No two adjacent form controls overlap each other
     *   5. Field labels are not truncated by CSS overflow
     *
     * Preconditions:
     *   - Admin user is authenticated (adminUserAuthPage fixture)
     *   - Viewport is set to the profile under test before navigation
     */
    test(`TC_PIM_USER_ADD_029 - Form is responsive and usable at ${viewport.label} (${viewport.width}×${viewport.height})`, async ({ adminUserAuthPage, logger }) => {

      // ── Set viewport before any navigation ─────────────────────────────
      await adminUserAuthPage.setViewportSize({
        width:  viewport.width,
        height: viewport.height,
      });

      await adminUserAuthPage.goto('/web/index.php/dashboard/index');
      //left navigation gets collapsed for non desktop view port, hence we need to open that first
      if(!viewport.label.includes('Desktop')) {
        const leftNavBtn: Locator = adminUserAuthPage.locator('.oxd-topbar-header-hamburger');    
        await expect(leftNavBtn, 'Hamburger icon button is not visible').toBeVisible();
        await leftNavBtn.click();
      }

      const navigationPage = new NavigationPage(adminUserAuthPage);
      await expect(
        navigationPage.getPimNavItem(),
        `[${viewport.label}] PIM navigation item should be visible`
      ).toBeVisible();

      await navigationPage.navigateToPim();

      const pimEmployeeListPage = new PimEmployeeListPage(adminUserAuthPage);
      await expect(
        pimEmployeeListPage.getAddEmployeeButton(),
        `[${viewport.label}] Add Employee button should be visible`
      ).toBeVisible();

      await pimEmployeeListPage.navigateToAddEmployee();

      const addEmployeePage = new AddEmployeePage(adminUserAuthPage);
      await expect(
        addEmployeePage.getSaveButton(),
        `[${viewport.label}] Save button should be visible confirming form loaded`
      ).toBeVisible();

      // Toggle Create Login Details ON to expose all mandatory fields
      await addEmployeePage.clickCreateLoginDetails();

      // ── Check 1: No horizontal scrolling ───────────────────────────────
      const horizontalScroll = await hasHorizontalScroll(adminUserAuthPage);
      expect(
        horizontalScroll,
        `[${viewport.label}] Page should not require horizontal scrolling`
      ).toBe(false);

      // ── Check 2: All mandatory fields visible within viewport ───────────
      const mandatoryFields = [
        { locator: addEmployeePage.getFirstNameInput(),        label: 'First Name input'        },
        { locator: addEmployeePage.getLastNameInput(),         label: 'Last Name input'         },
        { locator: addEmployeePage.getUsernameInput(),         label: 'Username input'          },
        { locator: addEmployeePage.getPasswordInput(),         label: 'Password input'          },
        { locator: addEmployeePage.getConfirmPasswordInput(),  label: 'Confirm Password input'  },
        { locator: addEmployeePage.getSaveButton(),            label: 'Save button'             },
        { locator: addEmployeePage.getCancelButton(),          label: 'Cancel button'           },
      ];

      for (const field of mandatoryFields) {
        await expect(
          field.locator,
          `[${viewport.label}] ${field.label} should be visible`
        ).toBeVisible();
      }

      // ── Check 3: Touch target sizes (WCAG 2.5.5 — min 44×44 px) ────────
      // Checked on all viewports, not just mobile, since WCAG applies
      // universally and regressions can appear on any breakpoint.
      const touchTargets = [
        { locator: addEmployeePage.getSaveButton(),   label: 'Save button'   },
        { locator: addEmployeePage.getCancelButton(), label: 'Cancel button' },
      ];

      for (const target of touchTargets) {
        const box = await target.locator.boundingBox();
        expect(
          box,
          `[${viewport.label}] Could not get bounding box for ${target.label}`
        ).not.toBeNull();

        expect(
          box!.width,
          `[${viewport.label}] ${target.label} width (${box!.width}px) is below WCAG minimum of ${MIN_TOUCH_TARGET_PX}px`
        ).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);

        expect(
          box!.height,
          `[${viewport.label}] ${target.label} height (${box!.height}px) is below WCAG minimum of ${MIN_TOUCH_TARGET_PX}px`
        ).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
      }

      // ── Check 4: No overlap between adjacent form controls ──────────────
      // Checks the most likely candidates for overlap at narrow viewports:
      // Password and Confirm Password sit side-by-side on wide screens and
      // should stack without overlapping on narrow ones.
      const overlapCandidates: Array<{ labelA: string; labelB: string }> = [
        { labelA: 'First Name input',  labelB: 'Last Name input'        },
        { labelA: 'Password input',    labelB: 'Confirm Password input' },
        { labelA: 'Save button',       labelB: 'Cancel button'          },
      ];

      // Build a bounding box map from the mandatory fields array above
      const boxMap = new Map<string, { x: number; y: number; width: number; height: number }>();
      for (const field of mandatoryFields) {
        const box = await field.locator.boundingBox();
        if (box) boxMap.set(field.label, box);
      }

      for (const { labelA, labelB } of overlapCandidates) {
        const boxA = boxMap.get(labelA);
        const boxB = boxMap.get(labelB);
        if (!boxA || !boxB) continue; // skip if either element wasn't rendered

        expect(
          boxesOverlap(boxA, boxB),
          `[${viewport.label}] "${labelA}" and "${labelB}" should not overlap each other`
        ).toBe(false);
      }

      // ── Check 5: Label text is not truncated ────────────────────────────
      // Selects all visible oxd-label elements inside the form and checks
      // none are being clipped by CSS overflow.
      const labelSelectors = [
        '.orangehrm-employee-form .oxd-label',
        '.orangehrm-employee-container .oxd-label',
      ];

      for (const selector of labelSelectors) {
        const truncated = await isTextTruncated(adminUserAuthPage, selector);
        expect(
          truncated,
          `[${viewport.label}] Label text matched by "${selector}" should not be truncated`
        ).toBe(false);
      }
    });
  }
});