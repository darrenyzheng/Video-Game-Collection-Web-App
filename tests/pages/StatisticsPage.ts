import { expect, type Locator, type Page } from '@playwright/test';

export class StatisticsPage {
    readonly page: Page;
    readonly statisticsHeading: Locator;
    readonly statisticsLink: Locator;
    readonly platformHeading: Locator;
    readonly genreHeading: Locator;
    readonly totalGames: Locator;

    constructor(page: Page) {
        this.page = page;
        this.statisticsLink = page.getByRole('link', { name: 'Statistics' });
        this.statisticsHeading = page.getByRole('heading', { name: 'Statistics' });
        this.platformHeading = page.getByRole('heading', { name: 'Platforms' });
        this.genreHeading = page.getByRole('heading', { name: 'Genres' })
        this.totalGames = page.getByText('Total games:');
    }

    async checkStatisticsHeaders() {
        await expect(this.statisticsHeading).toBeVisible();
        await expect(this.platformHeading).toBeVisible();
        await expect(this.genreHeading).toBeVisible();
    }

    async goto() {
        await this.statisticsLink.click();
        expect(this.page.url()).toBe('http://localhost:3000/statistics');
        await this.checkStatisticsHeaders();
    }

    async checkGames() {
        const textContent = await this.totalGames.textContent();
        const match =  textContent ? textContent.match(/\d+/) : null;
        const gamesNumber = match ? parseInt(match[0], 10) : 0;
        return gamesNumber;
    }

    async compareAmountOfGames(expectation: number) {
        const gameCount = await this.checkGames();
        expect(gameCount).toBe(expectation);
    }    


}