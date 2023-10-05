import { test, expect } from '@playwright/test';

test('upload files', async ({ page }: any) => {
    // Go to your app's endpoint
    await page.goto('http://localhost:3000'); // replace this with your app's url

    // Upload a file
    const input = await page.locator('input[type="file"]');
    await input.setInputFiles('../app/src/assets/IMG_0234.HEIC'); // replace with the actual file path

    // Click the upload button
    await page.locator('button').withText('Upload Serially to Azure').click();

    // Check if uploading text is displayed
    expect(await page.locator('p').withText('Uploading...')).toBeVisible();

    // Wait for the upload duration text to appear
    await page.locator('p').withText(/Upload duration: \d+ milliseconds/).waitFor();

    // Additional assertions can be placed here to check the state of your application
});

