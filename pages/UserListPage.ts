import { Page, Locator} from "../tests/base";

export class UserListPage {
    private readonly page: Page;
    private readonly searchAreaContainer: Locator;
    private readonly searchUserNameContainer: Locator;
    private readonly searchUserNameInput: Locator;
    private readonly formActionsContainer: Locator;
    private readonly searchBtn: Locator;
    private readonly searchResultsContainer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchAreaContainer = page.locator('.oxd-table-filter').filter({ hasText: /Users/i}).locator('.oxd-table-filter-area > .oxd-form');
        this.searchUserNameContainer = this.searchAreaContainer.locator('.oxd-input-group').filter({ hasText: /Username/i});
        this.searchUserNameInput = this.searchUserNameContainer.locator('input.oxd-input');
        this.formActionsContainer = this.searchAreaContainer.locator('.oxd-form-actions');
        this.searchBtn = this.formActionsContainer.locator('button').filter({ hasText: /Search/i});
        this.searchResultsContainer = page.locator('.orangehrm-container').getByRole("table").getByRole("rowgroup");
    }

    getSearchUserNameInput(): Locator {
        return this.searchUserNameInput;
    }

    getSearchButton(): Locator {
        return this.searchBtn;
    }

    getSearchResultsBy(username: string): Locator {
        const usernameRegEx = new RegExp(username, 'i');
        return this.searchResultsContainer.getByRole("row").filter({ hasText: usernameRegEx});
    }

    getEditButtonFor(row: Locator): locator {
        const rowButtons: Locator = row.locator('.oxd-table-cell-actions > button');
        return rowButtons.filter({ has: row.locator('.bi-pencil-fill')}).or(rowButtons.last());//fall back if pencil icon is changed
    }
}