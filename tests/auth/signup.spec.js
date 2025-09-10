// tests/auth/signup.spec.js
import { test, expect } from '@playwright/test';

test.describe('Authentification - Inscription', () => {

  test('CT-001 - Inscription réussie avec données valides', async ({ page }) => {
    // Données de test
    const testUser = {
      username: `johnsmith${Date.now()}`,
      email: `john.smith+${Date.now()}@example.com`,
      password: 'SecurePass123!'
    };

    await page.waitForTimeout(2000);

    // Étape 1 : Ouvrir l'application (URL Docker)
    await page.goto('/'); // baseURL définie dans config
    
    // Vérifier que la page d'accueil s'affiche
    await expect(page).toHaveTitle(/Conduit/);

    await page.waitForTimeout(2000);
    
    // Étape 2 : Cliquer sur "Sign up"
    await page.click('text=Sign up', { force: true });
    
    // Vérifier redirection vers page d'inscription  
    await expect(page).toHaveURL('/register');
    //await expect(page.locator('h1')).toContainText('Sign up'); à checker plus tard

    // Étape 3-5 : Remplir le formulaire d'inscription
    await page.locator('input').nth(0).fill(testUser.username);    // Premier input
    await page.locator('input').nth(1).fill(testUser.email);       // Deuxième input  
    await page.locator('input').nth(2).fill(testUser.password);    // Troisième input

    // Vérifier que les valeurs sont bien saisies
    await expect(page.locator('input[placeholder="Username"]')).toHaveValue(testUser.username);
    await expect(page.locator('input[placeholder="Email"]')).toHaveValue(testUser.email);
    
    // Étape 6 : Soumettre le formulaire et intercepter la requête API
    const responsePromise = page.waitForResponse('**/api/users');
    await page.click('button[type="submit"]');

    // Étape 7 : Vérifier la réponse API
    const response = await responsePromise;
    expect(response.status()).toBe(201); // Pourrait être 200 selon l'API utilisée
    
    const responseBody = await response.json();
    expect(responseBody.user).toBeDefined();
    expect(responseBody.user.email).toBe(testUser.email);
    expect(responseBody.user.username).toBe(testUser.username);
    expect(responseBody.user.token).toBeDefined();

    // Étape 8 : Vérifier la redirection vers page d'accueil
    await expect(page).toHaveURL('http://nginx/');  // Pattern regex flexible

    // Étape 9 : Vérifier que l'utilisateur est connecté (username dans header)
    await expect(page.locator('.nav-link').filter({ hasText: testUser.username })).toBeVisible();
    
    // Étape 10 : Vérifier que le token est stocké en localStorage
    const token = await page.evaluate(() => {
      return localStorage.getItem('jwt') || localStorage.getItem('token');
    });
    expect(token).toBeDefined();
    expect(token).toContain('.'); // Format JWT (contient des points)

    // Vérifications supplémentaires
    // Vérifier que les liens "Sign in/Sign up" ont disparu
    await expect(page.locator('text=Sign in')).not.toBeVisible();
    await expect(page.locator('text=Sign up')).not.toBeVisible();
    
    // Vérifier que les liens authentifiés sont visibles
    await expect(page.locator('text=New Article')).toBeVisible();
    await expect(page.locator('text=Settings')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    // Nettoyage : supprimer l'utilisateur de test si besoin
    // Ou réinitialiser la base de données pour les tests suivants
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

});