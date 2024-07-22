import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import dotenv from 'dotenv';
dotenv.config();

const getEnvVar = (varName: string): string => {
    const envVar = process.env[varName];
    if (!envVar) {
        throw new Error(`Environment variable ${varName} is not defined`);
    }
    return envVar;
};

test('Submit form with invalid username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.checkLoginHeaders();
    await loginPage.clickUsernameField();
    await loginPage.fillUsernameIncorrectly();
    await loginPage.clickPasswordField();
    await loginPage.fillPasswordIncorrectly();
    await loginPage.clickLoginButton();
    await loginPage.checkUsernameError();
    await loginPage.checkPasswordError();
});

test('Submit form with invalid username and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.checkLoginHeaders();
    await loginPage.clickUsernameField();
    await loginPage.fillUsernameCorrectly();
    await loginPage.clickPasswordField();
});  
