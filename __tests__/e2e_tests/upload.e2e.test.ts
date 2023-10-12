import { test, expect } from '@playwright/test';

test('upload files', async ({ page }: any) => {
    // Go to your app's endpoint
    await page.goto('http://localhost:3000'); // replace this with your app's url

    // Upload a file
    const input = await page.locator('input[type="file"]');
    await input.setInputFiles('app/src/assets/test.HEIC'); // replace with the actual file path

    // Click the upload button
    await page.click('text=Upload Serially to Azure');

    // Check if uploading text is displayed
    expect(await page.locator('text=Uploading...')).toBeVisible();

    // Wait for the upload duration text to appear
    await page.locator('text=/Upload duration: \\d+ milliseconds/').waitFor();

    // Additional assertions can be placed here to check the state of your application
});

