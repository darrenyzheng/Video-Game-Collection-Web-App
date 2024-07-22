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

export class RegisterPage {
    readonly page: Page;
    readonly registerLink: Locator;
    readonly createAccountHeading: Locator;
    readonly startCollectingHeading: Locator;
    readonly usernameField: Locator;
    readonly emailAddressField: Locator;
    readonly passwordField: Locator;
    readonly registerButton: Locator;
    readonly usernameError: Locator;
    readonly emailAddressError: Locator;
    readonly passwordError: Locator;
    readonly successToastTitle: Locator;
    readonly successToastMessage: Locator;
    readonly warningToastTitle: Locator;
    readonly warningToastMessage: Locator;
    readonly failureToastTitle: Locator;
    readonly failureToastMessage: Locator;
    readonly closeToast: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerLink = page.getByRole('link', { name: 'Register' });
        this.createAccountHeading = page.getByRole('heading', { name: 'Create an account' });
        this.startCollectingHeading = page.getByRole('heading', { name: 'Start collecting.' });
        this.usernameField = page.getByPlaceholder('Username');
        this.emailAddressField = page.getByPlaceholder('Email Address');
        this.passwordField = page.getByPlaceholder('Password');
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.usernameError = page.locator('[aria-describedby="usernameError"]');
        this.emailAddressError = page.locator('[aria-describedby="emailAddressError"]');
        this.passwordError = page.locator('[aria-describedby="passwordError"]');
        this.successToastTitle = page.locator('[aria-label="success-title"]');
        this.successToastMessage = page.locator('[aria-label="success-message"]');
        this.warningToastTitle = page.locator('[aria-label="warning-title"]');
        this.warningToastMessage = page.locator('[aria-label="warning-message"]');
        this.failureToastTitle = page.locator('[aria-label="failure-title"]');
        this.failureToastMessage = page.locator('[aria-label="failure-message"]');
        this.closeToast = page.locator('[aria-label="closeToast"]');
    }

    async goto() {
        await this.page.goto('http://localhost:3000/');
        await this.registerLink.click();
        await expect(this.page.url()).toBe('http://localhost:3000/register');
    }

    async checkRegisterHeaders() {
        await expect(this.createAccountHeading).toBeVisible();
        await expect(this.startCollectingHeading).toBeVisible();
    }

    async fillUsernameCorrectly() {
        await this.usernameField.click();
        await this.usernameField.fill(getEnvVar('USERNAME_SUCCESS'));
    }

    async fillTakenUsername() {
        await this.usernameField.click();
        await this.usernameField.fill(getEnvVar('USERNAME_IN_USE'));
    }

    async fillUsernameIncorrectly() {
        await this.usernameField.click();
        await this.usernameField.fill(getEnvVar('USERNAME_FAILURE'));
    }

    async fillEmailAddressCorrectly() {
        await this.emailAddressField.click();
        await this.emailAddressField.fill(getEnvVar('EMAIL_SUCCESS'));
    }

    async fillTakenEmailAddress() {
        await this.emailAddressField.click();
        await this.emailAddressField.fill(getEnvVar('EMAIL_IN_USE'));
    }

    async fillEmailAddressIncorrectly() {
        await this.emailAddressField.click();
        await this.emailAddressField.fill(getEnvVar('EMAIL_FAILURE'));
    }

    async fillPasswordCorrectly() {
        await this.passwordField.click();
        await this.passwordField.fill(getEnvVar('PASSWORD_SUCCESS'));
    }

    async fillPasswordIncorrectly() {
        await this.passwordField.click();
        await this.passwordField.fill(getEnvVar('PASSWORD_FAILURE'));
    }

    async checkDuplicateUsernameError() {
        await expect(this.usernameError).toBeVisible();
        await expect(this.usernameError).toHaveText('This username already exists, please pick another username. ');
    }

    async checkValidUsernameError() {
        await expect(this.usernameError).toBeVisible();
        await expect(this.usernameError).toHaveText('Usernames must be between 5 and 16 characters and contains only alphanumeric characters.');
    }

    async checkDuplicateEmailAddressError() {
        await expect(this.emailAddressError).toBeVisible();
        await expect(this.emailAddressError).toHaveText('This email already exists, please pick another email address.');
    }

    async checkValidEmailAddressError() {
        await expect(this.emailAddressError).toBeVisible();
        await expect(this.emailAddressError).toHaveText('Please enter a valid email address.');
    }

    async checkPasswordError() {
        await expect(this.passwordError).toBeVisible();
        await expect(this.passwordError).toHaveText('Passwords must contain one letter (uppercase or lowercase), a number, one special character from the set @$!%*?& and be between 6 and 16 characters.');
    }

    async clickRegisterButton() {
        await this.registerButton.click();
    }

    async checkSuccessToast() {
        await expect(this.successToastTitle).toBeVisible();
        await expect(this.successToastTitle).toHaveText('Success!');
        await expect(this.successToastMessage).toBeVisible();
        await expect(this.successToastMessage).toHaveText('User can now log in.');
    }

    async checkWarningToast() {
        await expect(this.warningToastTitle).toBeVisible();
        await expect(this.warningToastTitle).toHaveText('Warning!')
        await expect(this.warningToastMessage).toBeVisible();
        await expect(this.warningToastMessage).toHaveText('Check for errors.');
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

}