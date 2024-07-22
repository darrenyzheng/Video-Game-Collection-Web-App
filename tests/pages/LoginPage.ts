import { expect, type Locator, type Page } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const getEnvVar = (varName: string): string => {
    const envVar = process.env[varName];
    if (!envVar) {
        throw new Error(`Environment variable ${varName} is not defined`);
    }
    return envVar;
};

export class LoginPage {
    readonly page: Page;
    readonly loginLink: Locator;
    readonly welcomeBackHeading: Locator;
    readonly continueAdventureHeading: Locator;
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly loginButton: Locator;
    readonly usernameError: Locator;
    readonly passwordError: Locator;
    readonly warningToastTitle: Locator;
    readonly warningToastMessage: Locator;
    readonly failureToastTitle: Locator;
    readonly failureToastMessage: Locator;
    readonly closeToast: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loginLink = page.getByRole('link', { name: 'Login' });
        this.welcomeBackHeading = page.getByRole('heading', { name: 'Welcome back' })
        this.continueAdventureHeading = page.getByRole('heading', { name: 'Continue your adventure.' });
        this.usernameField = page.getByPlaceholder('Username');
        this.passwordField = page.getByPlaceholder('Password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.usernameError = page.locator('[aria-describedby="usernameError"]');
        this.passwordError = page.locator('[aria-describedby="passwordError"]');
        this.warningToastTitle = page.locator('[aria-label="warning-title"]');
        this.warningToastMessage = page.locator('[aria-label="warning-message"]');
        this.failureToastTitle = page.locator('[aria-label="failure-title"]');
        this.failureToastMessage = page.locator('[aria-label="failure-message"]');
        this.closeToast = page.locator('[aria-label="closeToast"]');
        this.logoutLink = page.getByText('Logout');
    }

    async goto() {
        await this.page.goto('http://localhost:3000/');
        await this.loginLink.click();
        expect(this.page.url()).toBe('http://localhost:3000/login');
    }

    async login() {
        await this.goto();
        await this.checkLoginHeaders();
        await this.fillUsernameCorrectly();
        await this.fillPasswordCorrectly();
        await this.clickLoginButton();
        await this.checkOnCollection();
    }

    async checkLoginHeaders() {
        await expect(this.welcomeBackHeading).toBeVisible();
        await expect(this.continueAdventureHeading).toBeVisible();
    }


    async fillUsernameCorrectly() {
        await this.usernameField.click();
        await this.usernameField.fill(getEnvVar('USERNAME_IN_USE'));
    }

    async fillUsernameIncorrectly() {
        await this.usernameField.click();
        await this.usernameField.fill(getEnvVar('USERNAME_FAILURE'));
    }

    async fillPasswordCorrectly() {
        await this.usernameField.click();
        await this.passwordField.fill(getEnvVar('PASSWORD_SUCCESS'));
    }

    async fillPasswordIncorrectly() {
        await this.passwordField.click();
        await this.passwordField.fill(getEnvVar('PASSWORD_FAILURE'));
    }

    async fillWrongPassword() {
        await this.passwordField.click();
        await this.passwordField.fill(getEnvVar('PASSWORD_INCORRECT'));
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async checkUsernameError() {
        await expect(this.usernameError).toBeVisible();
        await expect(this.usernameError).toHaveText('Usernames must be between 5 and 16 characters and contains only alphanumeric characters.')
    }

    async checkPasswordError() {
        await expect(this.passwordError).toBeVisible();
        await expect(this.passwordError).toHaveText('Passwords must contain one letter (uppercase or lowercase), a number, one special character from the set @$!%*?& and be between 6 and 16 characters.')
    }

    async checkWarningToast() {
        await expect(this.warningToastTitle).toBeVisible();
        await expect(this.warningToastTitle).toHaveText('Warning!')
        await expect(this.warningToastMessage).toBeVisible();
        await expect(this.warningToastMessage).toHaveText('Incorrect username or password. Please try again.');
    }

    async checkFailureToast() {
        await expect(this.failureToastTitle).toBeVisible();
        await expect(this.failureToastTitle).toHaveText('Failure!');
        await expect(this.failureToastMessage).toBeVisible();
        await expect(this.failureToastMessage).toHaveText('Server error.');
    }

    async clickCloseToast() {
        await expect(this.closeToast).toBeVisible();
        await this.closeToast.click();
    }

    async checkOnCollection() {
        await this.page.waitForURL('http://localhost:3000/collection');
        expect(this.page.url()).toBe('http://localhost:3000/collection');
    }

    async checkLoggedOut() {
        await this.logoutLink.click();
        expect(this.page.url()).toBe('http://localhost:3000/login');
    }
}