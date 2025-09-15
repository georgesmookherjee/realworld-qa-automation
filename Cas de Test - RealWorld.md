# Cas de Test Détaillés - Scénario Inscription Utilisateur

## CT-001 : Inscription réussie avec données valides

### Informations générales
- **ID** : CT-001
- **Priorité** : Haute  
- **Module** : Authentification
- **Fonctionnalité** : Inscription utilisateur
- **Type** : Fonctionnel positif

### Objectif
Vérifier qu'un utilisateur peut s'inscrire avec succès en utilisant des données valides

### Prérequis
- Application RealWorld démarrée et accessible
- Base de données opérationnelle
- Navigateur web supporté (Chrome, Firefox, Safari)

### Données de test
```json
{
  "username": "johnsmith2025",
  "email": "john.smith@example.com", 
  "password": "SecurePass123!"
}
```

### Étapes de test
| Step | Action                   | Données                    | Résultat attendu             |
|------|--------------------------|----------------------------|------------------------------|
| 1    | Ouvrir l'application     | URL: http://localhost:4100 | Page d'accueil s'affiche     |
| 2    | Cliquer sur "Sign up"    | -                          | Redirection vers /#/register |
| 3    | Remplir champ Username   | "johnsmith2025"            | Valeur saisie visible        |
| 4    | Remplir champ Email      | "john.smith@example.com"   | Valeur saisie visible        |
| 5    | Remplir champ Password   | "SecurePass123!"           | Valeur masquée (***)         |
| 6    | Cliquer bouton "Sign up" | -                          | Formulaire soumis            |
| 7    | Vérifier requête API     | POST /api/users            | Code 200 + response JSON     |
| 8    | Vérifier redirection     | -                          | URL: /#/ (page accueil)      |
| 9    | Vérifier état connexion  | -                          | Header montre username       |
| 10   | Vérifier token stockage  | localStorage               | JWT token présent            |

### Résultats attendus

#### Réponse API attendue
```json
{
  "user": {
    "email": "john.smith@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "johnsmith2025", 
    "bio": null,
    "image": null
  }
}
```

#### Vérifications post-test
- ✅ Utilisateur créé en base de données
- ✅ Token JWT valide et non expiré
- ✅ Session utilisateur active
- ✅ Navigation possible vers pages protégées

---

## CT-002 : Inscription échoue - Email déjà existant

### Informations générales  
- **ID** : CT-002
- **Priorité** : Haute
- **Module** : Authentification  
- **Type** : Fonctionnel négatif

### Objectif
Vérifier que l'inscription échoue si l'email est déjà utilisé

### Prérequis
- Utilisateur existant : "existing@test.com"
- Application accessible

### Données de test
```json
{
  "username": "newuser",
  "email": "existing@test.com", 
  "password": "ValidPass123"
}
```

### Étapes de test
| Step | Action                      | Données             | Résultat attendu      |
|------|-----------------------------|---------------------|-----------------------|
| 1    | Naviguer vers inscription   | /#/register         | Page d'inscription    |
| 2    | Remplir username            | "newuser"           | Champ rempli          |
| 3    | Remplir email existant      | "existing@test.com" | Champ rempli          |
| 4    | Remplir password            | "ValidPass123"      | Champ rempli          |
| 5    | Soumettre formulaire        | -                   | Requête envoyée       |
| 6    | Vérifier erreur API         | POST /api/users     | Code 422              |
| 7    | Vérifier message erreur     | -                   | "Email already taken" |
| 8    | Vérifier pas de redirection | -                   | Reste sur /#/register |

### Résultats attendus

#### Réponse API attendue
```json
{
  "errors": {
    "email": ["has already been taken"]
  }
}
```

#### Vérifications
- ❌ Pas d'utilisateur créé en double
- ❌ Pas de token généré
- ✅ Message d'erreur explicite affiché
- ✅ Formulaire reste accessible pour correction

---

## CT-003 : Validation des champs obligatoires

### Informations générales
- **ID** : CT-003  
- **Priorité** : Moyenne
- **Module** : Authentification
- **Type** : Validation

### Objectif  
Vérifier que tous les champs obligatoires sont validés

### Données de test - Champs vides
```json
{
  "username": "",
  "email": "",
  "password": ""
}
```

### Étapes de test
| Step | Action                      | Données     | Résultat attendu |
|------|-----------------------------|-------------|-----------------------------|
| 1    | Accéder au formulaire       | /#/register | Formulaire affiché          |
| 2    | Laisser champs vides        | ""          | Champs non remplis          |
| 3    | Cliquer "Sign up"           | -           | Validation échoue           |
| 4    | Vérifier messages erreur    | -           | Erreurs pour champs requis  |
| 5    | Vérifier pas de requête API | -           | Pas de call POST /api/users |

### Résultats attendus
- ✅ Validation côté client avant envoi
- ✅ Messages d'erreur spécifiques par champ
- ✅ Pas de requête API inutile
- ✅ Focus sur premier champ en erreur

#### Messages d'erreur attendus
- Username: "Username is required"
- Email: "Email is required" 
- Password: "Password is required"

---

## CT-004 : Validation format email invalide

### Informations générales
- **ID** : CT-004
- **Priorité** : Moyenne
- **Module** : Authentification
- **Type** : Validation

### Objectif
Vérifier la validation du format d'email

### Données de test
```json
{
  "username": "validuser",
  "email": "invalid-email-format",
  "password": "ValidPass123"
}
```

### Étapes de test
| Step | Action                | Données                | Résultat attendu       |
|------|-----------------------|------------------------|------------------------|
| 1    | Remplir username      | "validuser"            | OK                     |
| 2    | Saisir email invalide | "invalid-email-format" | Valeur saisie          |
| 3    | Remplir password      | "ValidPass123"         | OK                     |
| 4    | Soumettre formulaire  | -                      | Validation échoue      |
| 5    | Vérifier erreur email | -                      | "Invalid email format" |

### Résultats attendus
- ✅ Validation côté client du format email
- ✅ Message d'erreur explicite
- ✅ Champ email mis en surbrillance
- ❌ Pas d'envoi de requête si format invalide

---

## CT-005 : Validation longueur du mot de passe

### Informations générales
- **ID** : CT-005
- **Priorité** : Moyenne
- **Module** : Authentification  
- **Type** : Sécurité

### Objectif
Vérifier les règles de longueur minimum du mot de passe

### Données de test
```json
{
  "username": "testuser",
  "email": "test@valid.com",
  "password": "123" // Trop court
}
```

### Étapes de test
| Step | Action                    | Données        | Résultat attendu     |
|------|---------------------------|----------------|----------------------|
| 1    | Remplir données valides   | username/email | OK                   |
| 2    | Saisir mot de passe court | "123"          | Valeur saisie        |
| 3    | Soumettre formulaire      | -              | Validation échoue    |
| 4    | Vérifier erreur password  | -              | "Password too short" |

### Résultats attendus
- ✅ Mot de passe minimum 8 caractères
- ✅ Message d'erreur informatif
- ✅ Indication des critères requis

---

## CT-006 : Validation unicité du username

### Informations générales
- **ID** : CT-006
- **Priorité** : Haute
- **Module** : Authentification
- **Type** : Fonctionnel négatif

### Objectif
Vérifier que les usernames doivent être uniques

### Prérequis
- Utilisateur existant avec username "existinguser"

### Données de test
```json
{
  "username": "existinguser", // Déjà pris
  "email": "newemail@test.com",
  "password": "ValidPass123"
}
```

### Étapes de test
| Step | Action                    | Données             | Résultat attendu         |
|------|---------------------------|---------------------|--------------------------|
| 1    | Remplir username existant | "existinguser"      | Champ rempli             |
| 2    | Remplir email neuf        | "newemail@test.com" | Champ rempli             |
| 3    | Remplir password valide   | "ValidPass123"      | Champ rempli             |
| 4    | Soumettre formulaire      | -                   | Requête envoyée          |
| 5    | Vérifier erreur API       | POST /api/users     | Code 422                 |
| 6    | Vérifier message erreur   | -                   | "Username already taken" |

### Résultats attendus

#### Réponse API attendue
```json
{
  "errors": {
    "username": ["has already been taken"]
  }
}
```

---

## CT-007 : Test de sécurité - Injection SQL

### Informations générales
- **ID** : CT-007
- **Priorité** : Critique
- **Module** : Authentification
- **Type** : Sécurité

### Objectif
Vérifier que l'application résiste aux tentatives d'injection SQL

### Données de test malveillantes
```json
{
  "username": "admin'; DROP TABLE users; --",
  "email": "test@example.com",
  "password": "password123"
}
```

### Étapes de test
| Step | Action                       | Données                        | Résultat attendu                |
|------|------------------------------|--------------------------------|---------------------------------|
| 1    | Saisir username avec SQL     | "admin'; DROP TABLE users; --" | Valeur saisie                   |
| 2    | Compléter autres champs      | email/password valides         | OK                              |
| 3    | Soumettre formulaire         | -                              | Requête traitée                 |
| 4    | Vérifier traitement sécurisé | -                              | Pas d'exécution SQL malveillant |
| 5    | Vérifier base de données     | -                              | Tables intactes                 |
| 6    | Vérifier sanitisation        | -                              | Caractères échappés             |

### Résultats attendus
- ✅ Injection SQL bloquée/neutralisée
- ✅ Base de données non compromise
- ✅ Logs de sécurité générés
- ✅ Caractères spéciaux correctement traités

---

## CT-008 : Test de performance - Inscription simultanée

### Informations générales
- **ID** : CT-008
- **Priorité** : Basse
- **Module** : Authentification
- **Type** : Performance

### Objectif
Vérifier les performances lors d'inscriptions simultanées

### Données de test
- 10 utilisateurs avec données différentes
- Soumission simultanée des formulaires

### Étapes de test
| Step | Action                           | Données             | Résultat attendu         |
|------|----------------------------------|---------------------|--------------------------|
| 1    | Préparer 10 jeux de données      | users_1 à users_10  | Données prêtes           |
| 2    | Lancer inscriptions parallèles   | -                   | 10 requêtes simultanées  |
| 3    | Mesurer temps de réponse         | -                   | < 2 secondes par requête |
| 4    | Vérifier succès des inscriptions | -                   | 10 utilisateurs créés    |
| 5    | Contrôler intégrité base         | -                   | Pas de doublons          |

### Résultats attendus
- ✅ Temps de réponse acceptable (< 2s)
- ✅ Pas de race conditions
- ✅ Intégrité des données maintenue
- ✅ Pas d'erreurs de concurrence

---

## CT-009 : Test cross-browser

### Informations générales
- **ID** : CT-009
- **Priorité** : Moyenne
- **Module** : Authentification
- **Type** : Compatibilité

### Objectif
Vérifier le fonctionnement sur différents navigateurs

### Environnements de test
- Chrome (dernière version)
- Firefox (dernière version) 
- Safari (macOS)
- Edge (Windows)

### Données de test
```json
{
  "username": "crossbrowseruser",
  "email": "cross@browser.com",
  "password": "TestPass123"
}
```

### Étapes de test
| Step | Action          | Navigateur | Résultat attendu   |
|------|-----------------|------------|--------------------|
| 1    | Exécuter CT-001 | Chrome     | ✅ Inscription OK |
| 2    | Exécuter CT-001 | Firefox    | ✅ Inscription OK |
| 3    | Exécuter CT-001 | Safari     | ✅ Inscription OK |
| 4    | Exécuter CT-001 | Edge       | ✅ Inscription OK |
| 5    | Vérifier UI/UX  | Tous       | Rendu cohérent     |

### Résultats attendus
- ✅ Fonctionnalité identique tous navigateurs
- ✅ Interface utilisateur cohérente
- ✅ Pas d'erreurs JavaScript spécifiques
- ✅ Performance similaire

---

## CT-010 : Test responsive design

### Informations générales
- **ID** : CT-010
- **Priorité** : Moyenne
- **Module** : Authentification
- **Type** : Responsive

### Objectif
Vérifier l'affichage sur différentes tailles d'écran

### Résolutions de test
- Desktop : 1920x1080
- Tablet : 768x1024
- Mobile : 375x667

### Étapes de test
| Step | Action                  | Résolution | Résultat attendu  |
|------|-------------------------|------------|-------------------|
| 1    | Ouvrir page inscription | 1920x1080  | Affichage desktop |
| 2    | Redimensionner à tablet | 768x1024   | Layout adapté     |
| 3    | Redimensionner à mobile | 375x667    | Layout mobile     |
| 4    | Tester formulaire       | Toutes     | Utilisable        |
| 5    | Vérifier boutons        | Toutes     | Taille appropriée |

### Résultats attendus
- ✅ Formulaire utilisable sur tous écrans
- ✅ Boutons accessibles tactile
- ✅ Texte lisible sans zoom
- ✅ Pas de débordement horizontal

---

## Matrice de traçabilité

| Exigence      | CT-001  | CT-002 | CT-003 | CT-004 | CT-005 | CT-006 | CT-007 | CT-008 | CT-009 | CT-010 |
|---------------|---------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
| REQ-          |         |        |        |        |        |        |        |        |        |        |
  AUTH-001:     |         |        |        |        |        |        |        |        |        |        |
  Inscription   |  OK     |        |        |        |        |        |        |        |        |        |
  avec          |         |        |        |        |        |        |        |        |        |        |
  données       |         |        |        |        |        |        |        |        |        |        |
  valides       |_________|________|________|________|________|________|________|________|________|________|
| REQ-          |         |        |        |        |        |        |        |        |        |        |
  AUTH-002:     |         |   OK   |        |        |        |        |        |        |        |        |
  Validation    |         |        |        |        |        |        |        |        |        |        |
  unicité email |_________|________|________|________|________|________|________|________|________|________|     
| REQ-          |         |        |        |        |        |        |        |        |        |        |
  AUTH-003:     |         |        |   OK   |        |        |        |        |        |        |        |
  Champs        |         |        |        |        |        |        |        |        |        |        |
  obligatoires  |_________|________|________|________|________|________|________|________|________|________|
| REQ-          |         |        |        |        |        |        |        |        |        |        |
  AUTH-004:     |         |        |        |  OK    |        |        |        |        |        |        |
  Format email  |         |        |        |        |        |        |        |        |        |        |
  valide        |_________|________|________|________|________|________|________|________|________|________|
| REQ-          |         |        |        |        |        |        |        |        |        |        |
  AUTH-005:     |         |        |        |        |  OK    |        |        |        |        |        |
  Mot de        |         |        |        |        |        |        |        |        |        |        |
  passe         |         |        |        |        |        |        |        |        |        |        |
  sécurisé      |_________|________|________|________|________|________|________|________|________|________|
| REQ-          |         |        |        |        |        |        |        |        |        |        |
  AUTH-006:     |         |        |        |        |        |  OK    |        |        |        |        |
  Username      |         |        |        |        |        |        |        |        |        |        |
  unique        |_________|________|________|________|________|________|________|________|________|________|
| REQ-          |         |        |        |        |        |        |        |        |        |        |
  SEC-001:      |         |        |        |        |        |        |  OK    |        |        |        |
  Protection    |         |        |        |        |        |        |        |        |        |        |
  injection     |         |        |        |        |        |        |        |        |        |        |
  SQL           |_________|________|________|________|________|________|________|________|________|________|
| REQ-          |         |        |        |        |        |        |        |        |        |        |
  PERF-001:     |         |        |        |        |        |        |        |  OK    |        |        |
  Performance   |         |        |        |        |        |        |        |        |        |        |
  acceptable    |_________|________|________|________|________|________|________|________|________|________|
| REQ-          |         |        |        |        |        |        |        |        |        |        |
  COMP-001:     |         |        |        |        |        |        |        |        |  OK    |        |
  Cross-        |         |        |        |        |        |        |        |        |        |        |
  browser       |_________|________|________|________|________|________|________|________|________|________|
| REQ-UI-001:   |         |        |        |        |        |        |        |        |        |  OK    |
  Responsive    |         |        |        |        |        |        |        |        |        |        |
  design        |         |        |        |        |        |        |        |        |        |        |

---

## Critères de validation globaux

### Critères de succès
- ✅ 100% des cas de test fonctionnels passent
- ✅ 0 vulnérabilité de sécurité critique
- ✅ Temps de réponse < 2 secondes
- ✅ Compatible 4+ navigateurs principaux
- ✅ Responsive sur 3+ résolutions

### Critères d'échec
- ❌ Faille de sécurité détectée
- ❌ Perte de données utilisateur
- ❌ Temps de réponse > 5 secondes
- ❌ Dysfonctionnement sur navigateur principal
- ❌ Interface inutilisable sur mobile