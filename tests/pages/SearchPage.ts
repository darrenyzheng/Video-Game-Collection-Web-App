import { expect, type Locator, type Page } from '@playwright/test';


export class SearchPage {
    readonly page: Page;
    readonly searchLink: Locator;
    readonly searchHeader: Locator;
    readonly searchButton: Locator;
    readonly searchBar: Locator; 
    readonly filterBar: Locator; 
    readonly filterModal: Locator;
    readonly filterButton: Locator;
    readonly gamesList: Locator;
    readonly game: Locator;
    readonly closeFilterModal: Locator;
    readonly clearFiltersButton: Locator;
    readonly platformOption: Locator;
    readonly genreOption: Locator;
    readonly showFilters: Locator;
    readonly platformsForGame: Locator;
    readonly conditionsForGame: Locator;
    readonly addToCollectionButton: Locator;
    readonly successToastTitle: Locator;
    readonly successToastMessage: Locator;
    readonly warningToastTitle: Locator;
    readonly warningToastMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchLink = page.getByRole('link', { name: 'Search' });
        this.searchHeader = page.getByRole('heading', { name: 'Search' });
        this.searchButton = page.getByLabel('Search');
        this.searchBar = page.getByPlaceholder('Search');
        this.filterBar = page.getByPlaceholder('Filter');
        this.filterModal = page.getByLabel('FilterModal');
        this.filterButton = page.getByLabel('Filter Modal Button');
        this.gamesList = page.getByLabel('List of Games');
        this.game = page.locator('.gameWrapper');
        this.closeFilterModal = page.getByLabel('Close filter');
        this.clearFiltersButton = page.getByRole('button', { name: 'Clear Filters' });
        this.platformOption = page.locator('.platformFilterOption');
        this.genreOption = page.locator('.genreFilterOption');
        this.showFilters = page.getByRole('button', { name: 'Filter' });
        this.platformsForGame = page.locator('input[name="platform"]');
        this.conditionsForGame = page.locator('input[name="condition"]');
        this.addToCollectionButton = page.getByRole('button', { name: 'Add to Collection' });
        this.warningToastTitle = page.locator('[aria-label="warning-title"]');
        this.warningToastMessage = page.locator('[aria-label="warning-message"]');
        this.successToastTitle = page.locator('[aria-label="success-title"]');
        this.successToastMessage = page.locator('[aria-label="success-message"]');

    }
    
    async goto() {
        await this.searchLink.click();
        expect(this.page.url()).toBe('http://localhost:3000/search');
    }

    async checkSearchHeader() {
        await expect(this.searchHeader).toBeVisible();
    }

    async fillSearchbar(query: string) {
        await this.searchBar.click();
        await this.searchBar.fill(query);
        await this.searchButton.click();
    }

    async checkIfGamesPresent() {
        await expect(this.gamesList).toBeVisible();
    }
    
    async checkIfGamesNotPresent() {
        await expect(this.gamesList).not.toBeVisible();
    }

    async openFilter() {
        await this.filterButton.click();
    }

    async checkThatFilterModalOpens() {
        await expect(this.filterModal).toBeVisible();
    }

    async checkThatFilterModalDoesNotOpen() {
        await expect(this.filterModal).not.toBeVisible();
    }

    async closeFilter() {
        await this.closeFilterModal.click();
    }

    async fillFilterBar(query: string) {
        await this.filterBar.click();
        await this.filterBar.fill(query)
    }

    async compareAmountOfGames(expectation: number) {
        const gameCount = await this.game.count();
        expect(gameCount).toBe(expectation);
    }

    async clearFilters() {
        await this.clearFiltersButton.click();
    }

    async countGames() {
        const gameCount = await this.game.count();
        return gameCount;
    }

    async clickShowFilters() {
        await this.showFilters.click();
    }

    async clickFirstPlatformCategory() {
        await this.platformOption.first().scrollIntoViewIfNeeded();
        await this.platformOption.first().click({ force: true });
        await this.platformOption.first().isChecked();
    }

    async clickFirstGenreCategory() {
        await this.genreOption.first().scrollIntoViewIfNeeded();
        await this.genreOption.first().click();
        await this.genreOption.first().isChecked();

    }

    async checkResults() {
        const gameCount = await this.game.count();
        expect(gameCount).toBeGreaterThan(1);
    }

    
    async clickLastPlatformCategory() {
        await this.platformOption.last().scrollIntoViewIfNeeded();
        await this.platformOption.last().click({ force: true });
        await this.platformOption.last().isChecked();
    }

    async clickLastGenreCategory() {
        await this.genreOption.last().scrollIntoViewIfNeeded();
        await this.genreOption.last().click({ force: true });
        await this.genreOption.last().isChecked();
    }

    async searchForGame(gameToLookFor: string) {
        await this.goto();
        await this.checkSearchHeader();
        await this.fillSearchbar(gameToLookFor);
    }

    async checkSuccessToast() {
        await expect(this.successToastTitle).toBeVisible();
        await expect(this.successToastTitle).toHaveText('Success!');
        await expect(this.successToastMessage).toBeVisible();
        await expect(this.successToastMessage).toHaveText('Game successfully added!');
    }


    async checkWarningToast() {
        await expect(this.warningToastTitle).toBeVisible();
        await expect(this.warningToastTitle).toHaveText('Warning!')
        await expect(this.warningToastMessage).toBeVisible();
        await expect(this.warningToastMessage).toHaveText('This game and condition already exist in the database.');
    }
    
    async addFirstGame() {
        await this.game.first().click();
        await this.platformsForGame.first().click();
        await this.platformsForGame.first().isChecked();
        await this.conditionsForGame.first().click();
        await this.conditionsForGame.first().isChecked();
        await this.addToCollectionButton.click();
    }

    async leaveDialog() {
        await this.page.getByRole('dialog').press('Escape');
    }
}

