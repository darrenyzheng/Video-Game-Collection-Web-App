import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { StatisticsPage } from '../pages/StatisticsPage';
import { SearchPage } from '../pages/SearchPage';
import { CollectionPage } from '../pages/CollectionPage';


test('Search for game to add, add game, and check to see if it increases the total number in statistics, then delete game ', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // login method
    await loginPage.login();
    
    // count games before adding 
    const stastisticsPage = new StatisticsPage(page);
    await stastisticsPage.goto();
    const totalGamesBeforeAdd = await stastisticsPage.checkGames();
    const searchPage = new SearchPage(page);

    // add disgaea game  
    await searchPage.searchForGame('Disgaea: Hour of Darkness');
    await searchPage.addFirstGame();
    await searchPage.checkSuccessToast();
    await searchPage.leaveDialog();

    // check games 
    await stastisticsPage.goto();
    await stastisticsPage.compareAmountOfGames(totalGamesBeforeAdd+1);

    // delete the game from the collection
    const collectionPage = new CollectionPage(page);
    await collectionPage.goto();
    await collectionPage.deleteMostRecentGame();
    await collectionPage.checkSuccessToast();
    
    // check game count after deletion
    await stastisticsPage.goto();
    await stastisticsPage.compareAmountOfGames(totalGamesBeforeAdd);
  });

  
test('Search for game to add, add game, and check to see if it increases the total number in statistics, try to add it again', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // login method
    await loginPage.login();
    

    // count games before adding 
    const stastisticsPage = new StatisticsPage(page);
    await stastisticsPage.goto();
    const totalGamesBeforeAdd = await stastisticsPage.checkGames();
    const searchPage = new SearchPage(page);

    // add slay the spire 2 game  
    await searchPage.searchForGame('Slay the Spire II');
    await searchPage.addFirstGame();
    await searchPage.checkSuccessToast();
    await searchPage.leaveDialog();

    // check games 
    await stastisticsPage.goto();
    await stastisticsPage.compareAmountOfGames(totalGamesBeforeAdd+1);

    // try to add it again 
    await searchPage.searchForGame('Slay the Spire II');
    await searchPage.addFirstGame();
    await searchPage.checkWarningToast();
    await searchPage.leaveDialog();

    // check game count to see if its the same 
    await stastisticsPage.goto();
    await stastisticsPage.compareAmountOfGames(totalGamesBeforeAdd+1);

    // delete the game 
    const collectionPage = new CollectionPage(page);
    await collectionPage.goto();
    await collectionPage.deleteMostRecentGame();
    await collectionPage.checkSuccessToast();

    // check to see if the same amount of games 
    await stastisticsPage.goto();
    await stastisticsPage.compareAmountOfGames(totalGamesBeforeAdd);
  });


