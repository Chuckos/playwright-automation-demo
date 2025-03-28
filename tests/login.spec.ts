import { test, expect } from '@playwright/test';
import {
  login,
  logout,
  verifyLoginSuccess,
  setupSession,
  saveAuthState,
  navigateToLoginPage,
  initiatePasswordReset,
  verifySocialLoginNavigation,
  triggerEmailValidation,
} from './helpers/auth-utilities';
import { getHudlCredentials } from '../utils/env';
import fs from 'fs';
import path from 'path';

/** Constants for application configuration */
const BASE_URL = 'https://www.hudl.com/en_gb/';
const STORAGE_FILE = 'storage/hudl-auth.json';

/**
 * Core authentication flow tests
 * Covers primary user journeys for authentication
 */
test.describe('Authentication flows', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToLoginPage(page);
  });

  // Core authentication tests
  test('successful login redirects to dashboard', async ({ page }) => {
    const { email, password } = getHudlCredentials();
    await login(page, email, password);
    await verifyLoginSuccess(page);
  });

  test('Logout redirects to login page', async ({ page }) => {
    const { email, password } = getHudlCredentials();
    await login(page, email, password);
    await logout(page);
    await expect(page).toHaveURL(/hudl\.com\/?/);
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();
  });

  test('Forgot password navigates correctly', async ({ page }) => {
    await initiatePasswordReset(page, 'test@gmail.com');
    await expect(page).toHaveURL(/reset-password/);
    await expect(page.getByRole('heading')).toContainText('Reset Password');
  });

  test('Google login button navigates to Google login page', async ({
    page,
  }) => {
    await verifySocialLoginNavigation(page, 'Google');
  });

  test('Facebook login button navigates to Facebook login page', async ({
    page,
  }) => {
    await verifySocialLoginNavigation(page, 'Facebook');
  });

  test('Apple login button navigates to Apple login page', async ({ page }) => {
    await verifySocialLoginNavigation(page, 'Apple');
  });
});

/**
 * Session persistence tests
 * Verifies that authentication state is maintained across browser sessions
 */
test.describe('Session management', () => {
  test('Should stay logged in after reopening browser with saved state', async ({
    browser,
  }) => {
    const { email, password } = getHudlCredentials();

    // PHASE 1: Initial login and save state
    // Creates a new context and saves authentication state
    const context1 = await browser.newContext();
    try {
      //don't need BASE_URL here
      const page1 = await context1.newPage();
      await navigateToLoginPage(page1);
      await login(page1, email, password);
      await saveAuthState(context1, STORAGE_FILE);
    } finally {
      await context1.close();
    }

    
    // Creates a new context with saved auth state and verifies login persistence
    const context2 = await browser.newContext({
      storageState: STORAGE_FILE,
    });
    try {
      const page2 = await context2.newPage();
      await navigateToLoginPage(page2);
      await verifyLoginSuccess(page2);
    } finally {
      await context2.close();
    }
  });
});

/**
 * Input validation tests
 * Verifies form validation and error handling
 */
test.describe('Validation checks', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToLoginPage(page);
  });

  test('Invalid email format shows validation error', async ({ page }) => {
    await triggerEmailValidation(page, 'invalid-email');
    await expect(page.getByText('Enter a valid email.')).toBeVisible();
  });

  test('Valid email with invalid password shows error', async ({ page }) => {
    const { email } = getHudlCredentials();
    await login(page, email, 'wrong-password');
    await expect(page.getByText('Your email or password is')).toBeVisible();
  });

  test('Empty email blocks login', async ({ page }) => {
    const emailInput = await triggerEmailValidation(page, '');

    // Check tooltip validation message
    const message = await emailInput.evaluate(
      (input: HTMLInputElement) => input.validationMessage
    );
    expect(message).toContain('Please fill in this field');
  });
});
