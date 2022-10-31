// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('SplashScreen', () => {

  test('app', async ({ page }) => {
    await page.goto('http://localhost:8080/');

    const screenBackground = page.locator('.screenBackground');
    await expect(screenBackground).toBeVisible;

    const dynamoLogo = page.locator('.dynamoLogo');
    await expect(dynamoLogo).toBeVisible;

    const welcomeRow = page.locator('.welcomeRow');
    await expect(welcomeRow).toHaveText('Welcome to Dynamo!');

    const dynamicOptions = page.locator('.dynamicOptions');
    await expect(dynamicOptions).toContainText('Dynamo Core');

    const progressBarContainer = page.locator('.progress-bar-container');
    await expect(progressBarContainer).toBeVisible;

    const progressBarIndicator = page.locator('.progress-bar-indicator');
    await expect(progressBarIndicator).toBeVisible;

    const loadingTimeFooter = page.locator('.loadingTimeFooter');
    await expect(loadingTimeFooter).toHaveText('Loading time:');
  });

});
