import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('Submit form with invalid username and invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // navigate to login page 
    await loginPage.goto();
    await loginPage.checkLoginHeaders();

    // fill in login form 
    await loginPage.fillUsernameIncorrectly();
    await loginPage.fillPasswordIncorrectly();
    await loginPage.clickLoginButton();

    // check for client side errors preventing form submissions
    await loginPage.checkUsernameError();
    await loginPage.checkPasswordError();
});

test('Submit form with correct username and wrong password when server is up', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // navigate to login page
    await loginPage.goto();
    await loginPage.checkLoginHeaders();

    // fill in login form 
    await loginPage.fillUsernameCorrectly();
    await loginPage.fillWrongPassword();
    await loginPage.clickLoginButton();

    // close toast 
    await loginPage.checkWarningToast();
    await loginPage.clickCloseToast();
});

test('Submit form with correct username and correct password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // navigate to login page 
    await loginPage.goto();
    await loginPage.checkLoginHeaders();

    // fill in login form
    await loginPage.fillUsernameCorrectly();
    await loginPage.fillPasswordCorrectly();
    await loginPage.clickLoginButton();

    // check url
    await loginPage.checkOnCollection();
    await loginPage.checkLoggedOut();
});

test('Submit form with correct username and wrong password when server is down', async ({ page }) => {
    const loginPage = new LoginPage(page);
    // navigate to login page 

    await loginPage.goto();
    await loginPage.checkLoginHeaders();
    // fill in login form

    await loginPage.fillUsernameCorrectly();
    await loginPage.fillWrongPassword();
    await loginPage.clickLoginButton();

    // close toast
    await loginPage.checkFailureToast();
    await loginPage.clickCloseToast();
});



