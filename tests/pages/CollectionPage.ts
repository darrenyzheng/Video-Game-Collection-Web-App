import { expect, type Locator, type Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export class CollectionPage {
    readonly page: Page;
    readonly collectionLink: Locator;
    readonly collectionHeader: Locator;
    readonly game: Locator;
    readonly deleteGame: Locator;
    readonly successToastTitle: Locator;
    readonly successToastMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.collectionLink = page.getByRole('link', { name: 'Collection' });
        this.collectionHeader = page.getByRole('heading', { name: 'Collection' });
        this.game = page.locator('.gameWrapper');
        this.deleteGame = page.getByLabel('Delete Game');
        this.successToastTitle = page.locator('[aria-label="success-title"]');
        this.successToastMessage = page.locator('[aria-label="success-message"]');
    }

    async goto() {
        await this.collectionLink.click();
        await this.page.waitForTimeout(500);
        expect(this.page.url()).toBe('http://localhost:3000/collection');
        await this.checkCollectionHeader();
    }   

    async checkCollectionHeader() {
        await expect(this.collectionHeader).toBeVisible();
    }

    async countGames() {
        const gameCount = await this.game.count();
        return gameCount;
    }

    async compareAmountOfGames(expectation: number) {
        const gameCount = await this.game.count();
        expect(gameCount).toBe(expectation);
    }    

    async deleteMostRecentGame() {

        await this.game.last().hover();
        await this.deleteGame.last().click();
        await this.page.waitForTimeout(500);
    }

    async checkSuccessToast() {
        await expect(this.successToastTitle).toBeVisible();
        await expect(this.successToastTitle).toHaveText('Success!');
        await expect(this.successToastMessage).toBeVisible();
        await expect(this.successToastMessage).toHaveText('Game successfully deleted!');
    }

}