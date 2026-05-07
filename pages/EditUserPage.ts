import {Page, Locator} from "../tests/base";

export class EditUserPage {
    private readonly page: Page;
    private readonly editUserContainer: Locator;
    private readonly statusContainer: Locator;
    private readonly statusDropdown: Locator;
    private readonly formActionsContainer: Locator;
    private readonly saveBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.editUserContainer = page.locator('.orangehrm-card-container').filter({ hasText: /edit/i}).locator('.oxd-form');
        this.statusContainer = this.editUserContainer.locator('.oxd-input-group').filter({ hasText: /Status/i});
        this.statusDropdown = this.statusContainer.locator('.oxd-select-text');
        this.formActionsContainer = this.editUserContainer.locator('.oxd-form-actions');
        this.saveBtn = this.formActionsContainer.locator('button').filter({ hasText: /Save/i});
    }

    getStatusDropdown(): Locator {
        return this.statusDropdown;
    }

    getSaveButton(): Locator {
        return this.saveBtn;
    }
}