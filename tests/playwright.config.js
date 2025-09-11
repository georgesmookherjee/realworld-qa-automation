// tests/playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  
  // Timeout adapté pour environnement Docker
  timeout: 45000, // 45 secondes
  
  // Retry en cas d'instabilité réseau
  retries: 1,
  
  // Tests séquentiels pour éviter conflits DB
  workers: 1,
  
  use: {
    // URL du frontend dans Docker (communication inter-conteneurs)
    baseURL: process.env.BASE_URL || 'http://localhost:8082',
    
    // Mode headless obligatoire dans conteneur
    headless: true,
    
    // Captures d'écran et vidéos
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    
    // Viewport standard
    viewport: { width: 1280, height: 720 },
    
    // Timeouts réseau plus longs pour Docker
    actionTimeout: 2000,
    navigationTimeout: 30000,
  },

  // Navigateurs à tester
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Configuration pour environnement Docker
  globalSetup: './global-setup.js',
  globalTeardown: './global-teardown.js',
  
  // Attendre que les services soient prêts
  expect: {
    timeout: 3000,
  },

  // Rapports
  reporter: [
    ['html', { outputFolder: '../playwright-report' }],
    ['json', { outputFile: '../test-results/results.json' }],
    ['list'] // Console output
  ],

  outputDir: '../test-results',
});