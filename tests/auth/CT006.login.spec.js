import { test, expect } from '@playwright/test';
import { expectURL } from '../utils/test-helpers.js';

test.describe('Authentification - Connexion', () => {
  test('CT-006 - Connexion réussie avec identifiants valides', async ({ page }) => {
    // Prérequis : utilisateur existant (créé via CT-001 ou manuellement)
    const testUser = {
      email: "admin@axample.com", 
      password: "SecurePass123!"
    };

    // Étape 1: Accéder à la page de connexion
    await page.goto('/login');
    await expectURL(page, '/login');

    // Étape 2: Saisir l'email
    await page.fill('input[placeholder="Email"]', testUser.email);

    // Étape 3: Saisir le mot de passe
    await page.fill('input[placeholder="Password"]', testUser.password);

    // Étape 4: Cliquer sur "Sign in"
    await page.click('button[type="submit"]');

    // Étape 5: Vérifier la réponse API de connexion
    const loginResponse = await page.waitForResponse(
      response => response.url().includes('/api/users/login') && response.status() === 200
    );
    
    // Vérifier que la réponse contient un utilisateur avec un token JWT
    const responseData = await loginResponse.json();
    expect(responseData).toHaveProperty('user');
    expect(responseData.user).toHaveProperty('token');
    expect(responseData.user.token).toBeTruthy();

    // Étape 6: Vérifier la redirection vers la page d'accueil
    await expect(page).toHaveURL(/.*#?\/?$/);

    // Étape 7: Vérifier que l'utilisateur est connecté (username dans le header)
    await expect(page.locator('text=admin')).toBeVisible({ timeout: 10000 });
    // Alternative si le username exact varie :
    // await expect(page.locator('[href="#/settings"]')).toBeVisible();

    // Étape 8: Vérifier que le token JWT est stocké dans localStorage
    const token = await page.evaluate(() => {
      return localStorage.getItem('jwt') || localStorage.getItem('token');
    });
    expect(token).toBeTruthy();
    
    // Vérifier que c'est un JWT valide (format basique)
    expect(token.split('.')).toHaveLength(3);

    // Étape bonus: Vérifier que les liens authentifiés sont visibles
    await expect(page.locator('text=New Post')).toBeVisible();
    await expect(page.locator('text=Settings')).toBeVisible();
    
    console.log('✅ CT-006: Connexion réussie - Test passé');
  });

  test('CT-006 - Variante avec attente explicite', async ({ page }) => {
    const testUser = {
      email: "admin@axample.com",
      password: "SecurePass123!"
    };

    await page.goto('/login');

    // Attendre que la page soit complètement chargée
    await page.waitForSelector('input[placeholder="Email"]');
    
    await page.fill('input[placeholder="Email"]', testUser.email);
    await page.fill('input[placeholder="Password"]', testUser.password);

    // Intercepter la requête de connexion avant de cliquer
    const [response] = await Promise.all([
      page.waitForResponse('/api/users/login'),
      page.click('button[type="submit"]')
    ]);

    expect(response.status()).toBe(200);

    // Attendre explicitement la navigation
    await page.waitForURL(/.*#?\/?$/);
    
    // Attendre que l'interface utilisateur soit mise à jour
    await page.waitForSelector('text=Settings', { timeout: 15000 });
    
    const isLoggedIn = await page.locator('text=New Post').isVisible();
    expect(isLoggedIn).toBe(true);
  });
});