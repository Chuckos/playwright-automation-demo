# Hudl Login Automation Tests

This project contains automated end-to-end tests for [Hudl's](https://www.hudl.com/en_gb/) authentication flows using [Playwright](https://playwright.dev/).

## Prerequisites

- Recent version of [Node.js](https://nodejs.org/en)
- Recent version of [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) 

## Installation

Clone the repository and then install the dependencies:
```bash
git clone https://github.com/Chuckos/playwright-automation-demo.git
cd Hudl
npm install
```
## Environment Setup for Login Tests

To run the login tests, you need to set up environment variables in a .env file. You can do this by renaming the .env.example file to .env, which already contains the necessary variables.  From here just edit `.env` with your credentials:
```
HUDL_EMAIL=your-email@example.com
HUDL_PASSWORD=your-password
```

## Storage Setup

The tests require a storage folder for saving authentication state. Set this up by:

Creating the folder structure in root:
```bash
mkdir -p storage
touch storage/hudl-auth.json
echo "{}" > storage/hudl-auth.json
```

Or running the provided setup script:
```bash
npm run setup
```

## Project Structure

```
Hudl/
├── tests/
│   ├── helpers/
│   │   └── auth-utilities.ts    # Helper functions for authentication
│   ├── login.spec.ts            # Main test specifications
│   └── utils/
│       └── env.ts               # Environment configuration
├── .env                         # Environment variables (git-ignored)
├── playwright.config.ts         # Playwright configuration
└── package.json                 # Project dependencies and scripts
```

## Browser Support
The tests run on multiple browsers:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)


## Running Tests

Run all tests:
```bash
npm test
```

Run specific test file:
```bash
npx playwright test login.spec.ts
```

Run tests in debug mode:
```bash
npx playwright test --debug
```

Run tests in headed mode:
```bash
npx playwright test --headed
```
Run tests on a specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Coverage

The automation suite covers:
- Login functionality
- Logout flow
- Password reset
- Social login navigation
- Session management
- Form validation

## Test Not Covered
- Security testing – Checking account lockout behaviour after repeated failed logins, and the login again.
- Mobile browser coverage – test logins across varying viewport sizes.
- Performance metrics – test login response times, especially under high concurrency or from different global regions (e.g. CDN or caching effects).
- Visual regression testing – Detecting unexpected UI changes via snapshot.

## Helper Functions

Key utilities available in `auth-utilities.ts`:
- `navigateToLoginPage()`: Navigate to Hudl login page
- `login()`: Perform login with credentials
- `logout()`: Perform logout
- `verifyLoginSuccess()`: Verify successful login
- `triggerEmailValidation()`: Test email validation
- `verifySocialLoginNavigation()`: Test social login flows

## 🤔 Considerations
- For this project, I chose not to use the Page Object Model (POM).  While POM is still useful in many contexts, it can be too rigid for modern, component-based applications with too much abstraction which can difficult to maintain and debug with larger test suites. Instead, I’ve used `function-based helpers` for actions like login() and navigateToLoginPage().  This keeps the tests simpler, more flexible, and better aligned with Playwright’s native patterns.

## Areas for improvement

- Centralised Selectors.
- Group helper functions by purpose with comments. 

## 🐛 Minor Issue found:

For the test `Empty email blocks login`. The test passed in Chromium, but failed in WebKit and Firefox due to differences in native validation messages:

- Chromium "Please fill out this field"
- WebKit: "Fill out this field"
- Firefox: "Please fill out this field."



