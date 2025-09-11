// tests/auth/signup.spec.js
import { test, expect } from '@playwright/test';
import { expectURL } from '../utils/test-helpers.js';

test.describe('Authentification - Inscription', () => {

  test('CT-001 - Inscription réussie avec données valides', async ({ page }) => {
    // Données de test
    const testUser = {
      username: `johnsmith${Date.now()}`,
      email: `john.smith+${Date.now()}@example.com`,
      password: 'SecurePass123!'
    };

    // await page.waitForTimeout(500);

    // Étape 1 : Ouvrir l'application (URL Docker)
    await page.goto('/'); // baseURL définie dans config
    
    // Vérifier que la page d'accueil s'affiche
    await expect(page).toHaveTitle(/Conduit/);

    // await page.waitForTimeout(500);
    
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
    await expectURL(page, '/');  // Pattern regex flexible

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
    await expect(page.locator('text=New Post')).toBeVisible();
    await expect(page.locator('text=Settings')).toBeVisible();
  });
  
  test.describe('Authentification - Inscription', () => {
  
  // ... tes autres tests ...

  test('CT-002 - Inscription échoue - Email déjà existant', async ({ page }) => {
    // Données de test avec un email qui existe déjà
    // Important : utilise un email créé par CT-001 ou créé manuellement
    const existingUser = {
      username: `newuser${Date.now()}`,        // Username différent
      email: "admin@gmail.com",                // Email déjà existant (même que CT-006)
      password: "ValidPass123!"
    };

    // Étape 1: Naviguer vers la page d'inscription
    await page.goto('/register');
    await expect(page).toHaveURL('/register');

    // Étape 2-4: Remplir le formulaire avec l'email existant
    await page.fill('input[placeholder="Username"]', existingUser.username);
    await page.fill('input[placeholder="Email"]', existingUser.email);
    await page.fill('input[placeholder="Password"]', existingUser.password);

    // Vérifier que les champs sont bien remplis
    await expect(page.locator('input[placeholder="Username"]')).toHaveValue(existingUser.username);
    await expect(page.locator('input[placeholder="Email"]')).toHaveValue(existingUser.email);

    // Étape 5-6: Soumettre le formulaire et vérifier l'erreur API
    const responsePromise = page.waitForResponse('**/api/users');
    await page.click('button[type="submit"]');

    const response = await responsePromise;
    
    // Vérifier que l'API retourne une erreur 422 (Unprocessable Entity)
    expect(response.status()).toBe(422);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('errors');
    
    // Vérifier le message d'erreur spécifique pour l'email
    expect(responseBody.errors.email).toBeDefined();
    expect(responseBody.errors.email).toContain('has already been taken');

    // Étape 7: Vérifier que le message d'erreur s'affiche dans l'interface
    await expect(page.locator('.error-messages')).toBeVisible({ timeout: 5000 });
    
    // Alternative si la classe CSS est différente :
    // await expect(page.locator('text=has already been taken')).toBeVisible();
    // ou await expect(page.locator('[class*="error"]')).toBeVisible();

    // Étape 8: Vérifier qu'il n'y a pas de redirection (reste sur /register)
    await expect(page).toHaveURL('/register');

    // Vérifications supplémentaires
    // S'assurer qu'aucun token n'est créé
    const token = await page.evaluate(() => {
      return localStorage.getItem('jwt') || localStorage.getItem('token');
    });
    expect(token).toBeNull();

    // Vérifier que l'utilisateur n'est pas connecté
    await expect(page.locator('text=Settings')).not.toBeVisible();
    
    console.log('✅ CT-002: Email déjà existant - Test passé');
  });

  test('CT-002 - Variante robuste avec retry', async ({ page }) => {
    const existingUser = {
      username: `testuser${Date.now()}`,
      email: "admin@gmail.com",  // Email connu existant
      password: "TestPass456!"
    };

    await page.goto('/register');
    
    // Attendre que le formulaire soit bien chargé
    await page.waitForSelector('input[placeholder="Email"]');
    
    await page.fill('input[placeholder="Username"]', existingUser.username);
    await page.fill('input[placeholder="Email"]', existingUser.email);
    await page.fill('input[placeholder="Password"]', existingUser.password);

    // Intercepter la requête avec Promise.all pour plus de robustesse
    const [response] = await Promise.all([
      page.waitForResponse(response => 
        response.url().includes('/api/users') && 
        response.request().method() === 'POST'
      ),
      page.click('button[type="submit"]')
    ]);

    // Vérifications des erreurs
    expect(response.status()).toBe(422);
    
    const errorData = await response.json();
    expect(errorData.errors).toBeDefined();
    
    // Vérification flexible du message d'erreur (différentes formulations possibles)
    const emailError = errorData.errors.email || errorData.errors['email'];
    expect(emailError).toBeDefined();
    
    // Messages d'erreur possibles selon l'API
    const errorMessages = ['has already been taken', 'already exists', 'is already registered'];
    const hasValidErrorMessage = errorMessages.some(msg => 
      JSON.stringify(emailError).toLowerCase().includes(msg.toLowerCase())
    );
    expect(hasValidErrorMessage).toBe(true);

    // Attendre l'affichage de l'erreur dans l'UI avec plusieurs sélecteurs possibles
    await Promise.race([
      page.waitForSelector('.error-messages', { timeout: 5000 }).catch(() => null),
      page.waitForSelector('[class*="error"]', { timeout: 5000 }).catch(() => null),
      page.waitForSelector('text=already', { timeout: 5000 }).catch(() => null)
    ]);

    // Vérifier qu'on reste sur la page d'inscription
    await page.waitForTimeout(1000); // Petite pause pour s'assurer qu'il n'y a pas de redirection tardive
    await expect(page).toHaveURL('/register');
  });

});

  test.afterEach(async ({ page }) => {
    // Nettoyage : supprimer l'utilisateur de test si besoin
    // Ou réinitialiser la base de données pour les tests suivants
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

});