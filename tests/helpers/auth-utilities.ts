import { Page, Browser, BrowserContext, expect } from '@playwright/test';
import { getHudlCredentials } from '../../utils/env';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Navigates to the Hudl login page from the homepage
 * @param page - Playwright page object
 */
export async function navigateToLoginPage(page: Page) {
  await page.goto('https://www.hudl.com/en_gb/');
  await page.getByRole('link', { name: 'Log in' }).click();
  await page.getByRole('link', { name: 'Hudl logo mark Hudl' }).click();
}

/**
 * Performs login with provided credentials
 * @param page - Playwright page object
 * @param email - User's email address
 * @param password - User's password
 */
export async function login(page: Page, email: string, password: string) {
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Continue' }).click();
}

/**
 * Verifies successful login by checking for user-specific elements
 * @param page - Playwright page object
 */
export async function verifyLoginSuccess(page: Page) {
  await expect(page.getByRole('heading', { name: 'CA' })).toBeVisible();
  await expect(page.locator('#ssr-webnav')).toContainText('Charles A');
  await expect(page.locator('#main')).toBeVisible();
}

/**
 * Performs logout by clicking user menu and logout link
 * @param page - Playwright page object
 */
export async function logout(page: Page) {
  await page.getByText('Charles A').click();
  await page.getByRole('link', { name: 'Log Out' }).click();
}

/**
 * Sets up a new browser session and navigates to login
 * @param context - Playwright browser context
 * @param url - Base URL to navigate to
 * @returns Playwright page object
 */
export async function setupSession(context: BrowserContext, url: string) {
  const page = await context.newPage();
  await page.goto(url);
  await page.getByRole('link', { name: 'Log in' }).click();
  return page;
}

/**
 * Saves the current authentication state to a file
 * @param context - Playwright browser context
 * @param filePath - Path where the auth state will be saved
 */
export async function saveAuthState(context: BrowserContext, filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  await context.storageState({ path: filePath });
}

/**
 * Initiates the password reset flow
 * @param page - Playwright page object
 * @param email - Email address for password reset
 */
export async function initiatePasswordReset(page: Page, email: string) {
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('link', { name: 'Forgot Password' }).click();
}

/**
 * Verifies navigation to social login providers
 * @param page - Playwright page object
 * @param provider - Social login provider ('Google', 'Facebook', or 'Apple')
 */
export async function verifySocialLoginNavigation(
  page: Page,
  provider: 'Google' | 'Facebook' | 'Apple'
) {
  const buttonConfig = {
    Google: {
      buttonName: 'Continue with Google',
      expectedURL: /accounts\.google\.com/,
      expectedText: 'Sign in with Google',
    },
    Facebook: {
      buttonName: 'Continue with Facebook',
      expectedURL: /facebook\.com/,
      expectedText: 'Log in to Facebook',
    },
    Apple: {
      buttonName: 'Continue with Apple',
      expectedURL: /appleid\.apple\.com/,
      expectedText: 'Apple Account',
    },
  };

  const config = buttonConfig[provider];
  const button = page.getByRole('button', { name: config.buttonName });

  await expect(button).toBeVisible();
  await button.click();
  await expect(page).toHaveURL(config.expectedURL);
  await expect(
    page.getByText(
      config.expectedText,
      provider === 'Apple' ? { exact: true } : undefined
    )
  ).toBeVisible();
}

/**
 * Triggers email validation by entering an email and clicking continue
 * @param page - Playwright page object
 * @param email - Email address to validate
 * @returns The email input element
 */
export async function triggerEmailValidation(page: Page, email: string) {
  const emailInput = page.getByRole('textbox', { name: 'Email' });
  await emailInput.click();
  await emailInput.fill(email);
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  return emailInput;
}
