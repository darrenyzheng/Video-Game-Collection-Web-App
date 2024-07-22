import { test } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { verifyUser, deleteUser } from '../../game/src/models/user_model.mjs'; 
import dotenv from 'dotenv';
dotenv.config();

const getEnvVar = (varName: string): string => {
  const envVar = process.env[varName];
  if (!envVar) {
      throw new Error(`Environment variable ${varName} is not defined`);
  }
  return envVar;
};

test('User registration success', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  // navigate to register page 
  await registerPage.goto();
  await registerPage.checkRegisterHeaders();

  // fill in register form
  await registerPage.fillUsernameCorrectly();
  await registerPage.fillEmailAddressCorrectly();
  await registerPage.fillPasswordCorrectly();
  await registerPage.clickRegisterButton();

  // verify successful toast and close
  await registerPage.checkSuccessToast();
  await registerPage.clickCloseToast();
  
  // delete the user that was created
  await verifyUser(getEnvVar('USERNAME_SUCCESS'));
  await deleteUser(getEnvVar('USERNAME_SUCCESS'));
});

test('Test invalid username, email address, and password', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  // navigate to register page
  await registerPage.goto();
  await registerPage.checkRegisterHeaders();
  
  // fill in invalid username, email address and password
  await registerPage.fillUsernameIncorrectly();
  await registerPage.fillEmailAddressIncorrectly();
  await registerPage.fillPasswordIncorrectly();
  await registerPage.clickRegisterButton();

  // check for client side errors preventing form submission
  await registerPage.checkValidUsernameError();
  await registerPage.checkValidEmailAddressError();
  await registerPage.checkPasswordError();
});

test('Test duplicate username and email address', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  // navigate to register page 
  await registerPage.goto();
  await registerPage.checkRegisterHeaders();

  // fill in form with username and address that already exist 
  await registerPage.fillTakenUsername();
  await registerPage.fillTakenEmailAddress();
  await registerPage.fillPasswordCorrectly();
  await registerPage.clickRegisterButton();

  // check for errors that display duplicate error text
  await registerPage.checkDuplicateUsernameError();
  await registerPage.checkDuplicateEmailAddressError();

  // verify warning toast and close
  await registerPage.checkWarningToast();
  await registerPage.clickCloseToast();
});

test('Test form submission when server down', async ({ page }) => {
  const registerPage = new RegisterPage(page);

  // navigate to register page 
  await registerPage.goto();
  await registerPage.checkRegisterHeaders();

  // fill in form with username and address that already exist 
  await registerPage.fillTakenUsername();
  await registerPage.fillTakenEmailAddress();
  await registerPage.fillPasswordCorrectly();
  await registerPage.clickRegisterButton();

  // verify failure toast and close
  await registerPage.checkFailureToast();
  await registerPage.clickCloseToast();
});