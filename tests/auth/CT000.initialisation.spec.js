import { test, expect } from '@playwright/test';
import { expectURL } from '../utils/test-helpers.js';

test('test', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Sign up' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Email' }).fill('admin@axample.com');
  await page.getByRole('textbox', { name: 'Email' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('SecurePass123!');
  await page.getByRole('button', { name: 'Sign up' }).click();
});