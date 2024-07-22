import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { CollectionPage } from '../pages/CollectionPage';


test('Search for game to add, check count and delete game, check count', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // login method
    await loginPage.login();
    
    const collectionPage = new CollectionPage(page);
    await collectionPage.goto();

    // count games before adding 
    const gameCountBeforeAdd = await collectionPage.countGames();
    const searchPage = new SearchPage(page);

    // add paper mario game 
    await searchPage.searchForGame('Paper Mario');
    await searchPage.addFirstGame();
    await searchPage.checkSuccessToast();
    await searchPage.leaveDialog();
    await collectionPage.goto();

    // check that we have one more game, delete the game  
    await collectionPage.compareAmountOfGames(gameCountBeforeAdd+1);
    await collectionPage.deleteMostRecentGame();
    await collectionPage.checkSuccessToast();
    
    // check game after 
    await collectionPage.compareAmountOfGames(gameCountBeforeAdd);

  });

  test('Search for game to add, add duplicate game, count', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // login method
    await loginPage.login();
    
    const collectionPage = new CollectionPage(page);
    await collectionPage.goto();

    // count games before adding 
    const gameCountBeforeAdd = await collectionPage.countGames();
    const searchPage = new SearchPage(page);
    await searchPage.goto();

    // add kingdom hearts II and check toast messages 
    await searchPage.searchForGame('Kingdom Hearts II');
    await searchPage.addFirstGame();
    await searchPage.checkSuccessToast();
    await searchPage.leaveDialog();
    await collectionPage.goto();

    // count game
    await collectionPage.compareAmountOfGames(gameCountBeforeAdd+1);

    // try to add kingdom hearts II again 
    await searchPage.goto();
    await searchPage.searchForGame('Kingdom Hearts II');
    await searchPage.addFirstGame();
    await searchPage.checkWarningToast();
    await searchPage.leaveDialog();

    // count games 
    await collectionPage.goto();
    await collectionPage.compareAmountOfGames(gameCountBeforeAdd+1);
    await collectionPage.deleteMostRecentGame();
    await collectionPage.checkSuccessToast();
    
    // check game count after deletion
    await collectionPage.compareAmountOfGames(gameCountBeforeAdd);

  });