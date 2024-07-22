import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';

test('Search for game that does not exist and we cannot open filter modal', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // login method
    await loginPage.login();

    const searchPage = new SearchPage(page);
    // search for a game with no results
    await searchPage.goto();
    await searchPage.checkSearchHeader();
    await searchPage.fillSearchbar('Personaa');
    
    // verify that there are no games
    await searchPage.checkIfGamesNotPresent();
    
    // check that we cannot open the filter modal 
    await searchPage.openFilter();
    await searchPage.checkThatFilterModalDoesNotOpen();
  });

  test('Search for game that does not exist and filter bar gives no results', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    // login method
    await loginPage.login();

    const searchPage = new SearchPage(page);
    // search for a game with no results
    await searchPage.goto();
    await searchPage.checkSearchHeader();
    await searchPage.fillSearchbar('Personaa');
    
    // verify that there are no games
    await searchPage.checkIfGamesNotPresent();
    await searchPage.fillFilterBar('Persona');
    await searchPage.checkIfGamesNotPresent();
  });

  
test('Search for game that exists and we can open and close filter modal', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // login method 
  await loginPage.login();

  const searchPage = new SearchPage(page);
  
  // search for a game with multiple results
  await searchPage.goto();
  await searchPage.checkSearchHeader();
  await searchPage.fillSearchbar('Persona');
  await searchPage.checkIfGamesPresent();

  // check that we can open the filter modal 
  await searchPage.openFilter();
  await searchPage.checkThatFilterModalOpens();

  // close filter modal 
  await searchPage.closeFilter();
});

test('Search for game that exists and we can filter games using filter bar ', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // login method 
  await loginPage.login();

  const searchPage = new SearchPage(page);

  // search for a game with multiple results
  await searchPage.goto();
  await searchPage.checkSearchHeader();
  await searchPage.fillSearchbar('Persona');

  // count games 
  await searchPage.checkIfGamesPresent();
  const game_count = await searchPage.countGames();

  // check that we can filter specifically 
  await searchPage.fillFilterBar('Persona 5 Strikers');

  // check that theres only one game 
  await searchPage.compareAmountOfGames(1);

  // clear filters and check same amount of games 
  await searchPage.clearFilters();
  await searchPage.compareAmountOfGames(game_count);
});

test('Search for game that exists and we can filter using genre and platform options', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // login method 
  await loginPage.login();

  const searchPage = new SearchPage(page);
  
  // search for a game with multiple results
  await searchPage.goto();
  await searchPage.checkSearchHeader();
  await searchPage.fillSearchbar('Paper Mario');
  await searchPage.checkIfGamesPresent();
  const game_count = await searchPage.countGames();

  // check that we can open the filter modal 
  await searchPage.openFilter();
  await searchPage.checkThatFilterModalOpens();

  // click first platform and genre 
  await searchPage.clickFirstPlatformCategory();
  await searchPage.clickFirstGenreCategory();
  await searchPage.clickShowFilters();
  await searchPage.checkIfGamesPresent();

    // clear filters and check same amount of games 
  await searchPage.clearFilters();
  await searchPage.compareAmountOfGames(game_count);
});

test('Search for game that exists and we can filter only with genre option', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // login method 
  await loginPage.login();

  const searchPage = new SearchPage(page);
  
  // search for a game with multiple results
  await searchPage.goto();
  await searchPage.checkSearchHeader();
  await searchPage.fillSearchbar('Final Fantasy');
  await searchPage.checkIfGamesPresent();
  const game_count = await searchPage.countGames();

  // check that we can open the filter modal 
  await searchPage.openFilter();
  await searchPage.checkThatFilterModalOpens();

  // click first genre 
  await searchPage.clickFirstGenreCategory();
  await searchPage.clickShowFilters();
  await searchPage.checkResults();

    // clear filters and check same amount of games 
  await searchPage.clearFilters();
  await searchPage.compareAmountOfGames(game_count);
});

test('Search for game that exists and we can filter only with platform option', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // login method 
  await loginPage.login();

  const searchPage = new SearchPage(page);
  
  // search for a game with multiple results
  await searchPage.goto();
  await searchPage.checkSearchHeader();
  await searchPage.fillSearchbar('Metroid Prime');
  await searchPage.checkIfGamesPresent();
  const game_count = await searchPage.countGames();

  // check that we can open the filter modal 
  await searchPage.openFilter();
  await searchPage.checkThatFilterModalOpens();

  // click first platform  
  await searchPage.clickFirstPlatformCategory();
  await searchPage.clickShowFilters();

  // check if there are more than
  await searchPage.checkResults();
  
    // clear filters and check same amount of games 
  await searchPage.clearFilters();
  await searchPage.compareAmountOfGames(game_count);
});


test('Search for game that exists and we check last platform / genre, expecting no results ', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // login method 
  await loginPage.login();

  const searchPage = new SearchPage(page);
  
  // search for a game with multiple results
  await searchPage.goto();
  await searchPage.checkSearchHeader();
  await searchPage.fillSearchbar('Dragon Quest');
  await searchPage.checkIfGamesPresent();
  const game_count = await searchPage.countGames();

  // check that we can open the filter modal 
  await searchPage.openFilter();
  await searchPage.checkThatFilterModalOpens();

  // click last platform, genre  
  await searchPage.clickLastPlatformCategory();
  await searchPage.clickLastGenreCategory();
  await searchPage.clickShowFilters();

  // expect 0 games 
  await searchPage.compareAmountOfGames(0);

    // clear filters and check same amount of games 
  await searchPage.clearFilters();
  await searchPage.compareAmountOfGames(game_count);
});




