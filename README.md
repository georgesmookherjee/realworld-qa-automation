# 🚀 RealWorld QA Automation

> **Projet showcase démontrant une architecture microservices complète avec tests E2E automatisés**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/georgesmookherjee/realworld-qa-automation)
[![Tests](https://img.shields.io/badge/tests-e2e%20automated-blue)](https://github.com/georgesmookherjee/realworld-qa-automation)
[![Docker](https://img.shields.io/badge/docker-compose-2496ED)](https://github.com/georgesmookherjee/realworld-qa-automation)
[![Node.js](https://img.shields.io/badge/node.js-22.19.0-339933)](https://github.com/georgesmookherjee/realworld-qa-automation)
[![Playwright](https://img.shields.io/badge/playwright-automated-45ba4b)](https://github.com/georgesmookherjee/realworld-qa-automation)

## 📋 Description

Application **Conduit** (clone de Medium) avec architecture microservices complète, orchestrée par Docker Compose et testée automatiquement avec Playwright. Ce projet démontre l'implémentation de bonnes pratiques DevOps et de tests E2E dans un environnement production-ready.

### ✨ Fonctionnalités principales

- 🔐 **Authentification JWT** (signup/login)
- 📝 **Gestion d'articles** avec support Markdown
- 💬 **Système de commentaires** interactif
- 👥 **Follow/Favoris** entre utilisateurs
- 📰 **Feed personnalisé** et global
- 🏷️ **Tags et pagination** avancés

## 🏗️ Architecture

### Vue d'ensemble

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   React+Redux   │◄──►│  Node.js+Prisma │◄──►│  PostgreSQL 15  │
│   Port: 4100    │    │   Port: 3004    │    │   Port: 5433    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Reverse Proxy  │    │  E2E Tests      │    │  Orchestration  │
│  Nginx          │    │  Playwright     │    │  Docker Compose │
│  Port: 8082     │    │  Automated      │    │  Multi-services │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Stack technique

| Service | Technologie | Port | Description |
|---------|-------------|------|-------------|
| **Frontend** | React 16+, Redux | 4100 | Interface utilisateur avec state management |
| **Backend** | Node.js, Express, Prisma ORM | 3004 | API REST avec authentification JWT |
| **Database** | PostgreSQL 15 | 5433 | Base de données relationnelle |
| **Proxy** | Nginx | 8082 | Reverse proxy et load balancer |
| **Tests** | Playwright | - | Tests E2E automatisés avec record/playback |

## 🚀 Quick Start

### Prérequis

- Docker et Docker Compose installés
- 8 GB RAM disponible
- Ports 8082, 3004, 4100, 5433 libres

### Installation rapide

```bash
# 1. Cloner le projet
git clone https://github.com/georgesmookherjee/realworld-qa-automation.git
cd realworld-qa-automation

# 2. Lancer l'infrastructure complète
docker-compose up --build

# 3. Accéder à l'application
# Frontend: http://localhost:8082
# API: http://localhost:3004/api
```

### Lancement des tests E2E

```bash
# Tests automatiques
./run-playwright.bat

# Mode interactif avec codegen
./run-codegen.bat
```

## 📁 Structure du projet

```
realworld-qa-automation/
├── 📂 react-redux-realworld-example-app/   # Frontend React+Redux
│   ├── src/                                # Sources React
│   ├── public/                             # Assets statiques
│   └── Dockerfile                          # Container frontend
│
├── 📂 node-express-realworld-example-app/  # Backend Node.js
│   ├── src/                                # Sources API
│   ├── prisma/                             # Schema et migrations
│   └── Dockerfile                          # Container backend
│
├── 📂 tests/                               # Tests E2E Playwright (DÉVELOPPEMENT PRINCIPAL)
│   ├── auth/                               # Tests d'authentification
│   │   ├── CT001.signup.spec.js            # Inscription utilisateur
│   │   ├── CT002.signup-duplicate.spec.js  # Email déjà utilisé  
│   │   └── CT006.login.spec.js             # Connexion réussie
│   ├── utils/                              # Helpers et utilitaires
│   ├── global-setup.js                     # Setup global des tests
│   ├── playwright.config.js                # Configuration Playwright
│   ├── package.json                        # Dependencies tests
│   └── run-codegen.bat                     # Script génération tests
│
├── 📂 documentation/                       # Documentation technique (COLLABORATION)
│   ├── Cas de Test - RealWorld.md          # Spécifications détaillées CT-001 à CT-010
│   ├── strategie_test_realworld.md         # Stratégie de test complète
│   ├── scenarios_test_realworld.md         # Scénarios et matrices de test
│   └── CdR - module authentification.md    # Cahier des charges module auth
│
├── 📂 node-v22.19.0-win-x64/              # Node.js portable (Windows)
├── 🐳 docker-compose.yml                  # Orchestration services
├── 🌐 nginx.conf                          # Configuration proxy
├── 🔧 run-playwright.bat                  # Script tests E2E
└── 🔧 run-codegen.bat                     # Script génération tests
```

## 🛠️ Guide des services

### Frontend (React + Redux)

**Port:** 4100 | **URL:** http://localhost:8082

```bash
# Développement local
cd react-redux-realworld-example-app
npm install
npm start

# Build production
npm run build
```

**Fonctionnalités:**
- Single Page Application (SPA)
- State management avec Redux
- Routing avec React Router
- Hot reload en développement

### Backend (Node.js + Prisma)

**Port:** 3004 | **URL:** http://localhost:3004/api

```bash
# Développement local
cd node-express-realworld-example-app
npm install
npm run dev

# Migrations base de données
npx prisma migrate dev
npx prisma generate
```

**API Endpoints:**
- `POST /api/users/login` - Authentification
- `GET /api/articles` - Liste des articles
- `POST /api/articles` - Création d'article
- `GET /api/tags` - Tags disponibles

### Base de données (PostgreSQL)

**Port:** 5433 | **Accès:** Adminer ou psql

```bash
# Connexion directe
psql -h localhost -p 5433 -U postgres -d realworld

# Via Adminer (si configuré)
http://localhost:8080
```

### Tests E2E (Playwright)

```bash
# Tests complets
cd tests
npm test

# Tests avec interface
npm run test:ui

# Génération de tests
npm run codegen
```

## 🔧 Scripts utilitaires

### Scripts Windows (.bat)

| Script | Description |
|--------|-------------|
| `run-playwright.bat` | Lance les tests E2E complets |
| `run-codegen.bat` | Mode enregistrement de tests |

### Scripts npm disponibles

```bash
# Frontend
npm start          # Développement
npm run build      # Build production
npm test           # Tests unitaires

# Backend  
npm run dev        # Développement avec nodemon
npm run start      # Production
npm run test       # Tests API

# Tests E2E
npm run test       # Tests Playwright
npm run test:ui    # Interface graphique
npm run report     # Rapport de tests
```

## 🐳 Configuration Docker

### Services définits

```yaml
services:
  database:    # PostgreSQL 15 - Port 5433
  api:         # Backend Node.js - Port 3004  
  frontend:    # React App - Port 4100
  nginx:       # Reverse Proxy - Port 8082
  e2e-tests:   # Playwright - À la demande
```

### Commandes Docker utiles

```bash
# Lancement complet
docker-compose up --build

# Services individuels
docker-compose up database api
docker-compose up frontend nginx

# Nettoyage
docker-compose down -v
docker system prune -f
```

## 🔍 Tests et qualité

> **Note importante :** Le développement principal s'est concentré sur l'implémentation des **tests E2E automatisés** dans le dossier `/tests/`, accompagné d'une **documentation technique complète** créée en collaboration dans `/documentation/`.

### Travail réalisé

#### Tests automatisés (/tests/)
- ✅ **Tests E2E Playwright** - Scripts automatisés avec cas de tests documentés
- ✅ **Configuration Docker** - Intégration tests dans l'environnement containerisé  
- ✅ **Scripts d'automatisation** - Fichiers .bat pour Windows
- ✅ **Setup environnement** - Configuration multi-navigateurs et multi-environnements

#### Documentation technique (/documentation/)
- ✅ **Spécifications complètes** - 10 cas de tests détaillés (CT-001 à CT-010)
- ✅ **Stratégie de test** - Approche méthodologique et outils
- ✅ **Scénarios de test** - Matrices de couverture et traçabilité
- ✅ **Cahier des charges** - Module authentification avec exigences

### Cas de tests implémentés

| ID Test | Module | Description | Documentation | Implémentation |
|---------|--------|-------------|---------------|----------------|
| CT-001 | Authentification | Inscription avec données valides | ✅ Complète | ✅ Playwright |
| CT-002 | Authentification | Email déjà utilisé | ✅ Complète | ✅ Playwright |
| CT-006 | Authentification | Connexion réussie | ✅ Complète | ✅ Playwright |
| CT-007 | Sécurité | Protection injection SQL | ✅ Documenté | 📋 Planifié |
| CT-008 | Performance | Inscription simultanée | ✅ Documenté | 📋 Planifié |
| CT-009 | Compatibilité | Tests cross-browser | ✅ Documenté | 📋 Planifié |
| CT-010 | Responsive | Design adaptatif | ✅ Documenté | 📋 Planifié |

### Exécution des tests

```bash
# Tests séquentiels (recommandé)
./run-playwright.bat

# Tests parallèles (développement)
npm run test -- --workers=4

# Tests spécifiques
npm run test -- --grep "login"
```

## 🚨 Troubleshooting

### Problèmes courants

#### Port déjà utilisé
```bash
# Identifier les processus
netstat -ano | findstr :8082
netstat -ano | findstr :3004

# Arrêter Docker
docker-compose down
```

#### Base de données inaccessible
```bash
# Vérifier le service
docker-compose ps database

# Recréer le volume
docker-compose down -v
docker-compose up database
```

#### Tests en échec
```bash
# Vérifier les services
docker-compose ps

# Logs détaillés
docker-compose logs api
docker-compose logs frontend

# Réinitialiser les tests
cd tests && npm run test:clean
```

#### Node.js portable
```bash
# Si problème de PATH
set PATH=%CD%\node-v22.19.0-win-x64;%PATH%

# Vérifier la version
node --version  # Doit afficher v22.19.0
```

### Logs et debugging

```bash
# Logs applicatifs
docker-compose logs -f api        # Backend
docker-compose logs -f frontend   # Frontend
docker-compose logs -f nginx      # Proxy

# Tests en mode debug
npm run test:debug

# Interface Playwright
npm run test:ui
```

## 🤝 Contributing

### Workflow de contribution

1. **Fork** du projet
2. **Branch** pour feature (`git checkout -b feature/amazing-feature`)
3. **Commit** des changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branch (`git push origin feature/amazing-feature`)
5. **Pull Request** avec description détaillée

### Standards de code

- **ESLint** - Respect des règles JavaScript/TypeScript
- **Prettier** - Formatage automatique
- **Conventional Commits** - Messages de commit standardisés
- **Tests requis** - Couverture minimum 80%

### Environnement de développement

```bash
# Configuration complète développement
git clone https://github.com/georgesmookherjee/realworld-qa-automation.git
cd realworld-qa-automation

# Installation des hooks pre-commit
npm install husky --save-dev
npx husky install

# Lancement env développement
docker-compose -f docker-compose.dev.yml up
```

## 🗺️ Roadmap

### Phase 1 - Foundation ✅
- [x] Architecture microservices
- [x] Tests E2E Playwright
- [x] Orchestration Docker
- [x] Configuration multi-environnement

### Phase 2 - CI/CD 🔄
- [ ] Pipeline GitHub Actions
- [ ] Tests automatisés sur PR
- [ ] Déploiement automatique
- [ ] Monitoring et alertes

### Phase 3 - Advanced Features 📋
- [ ] Tests de performance (K6/Gatling/Jmeter)
- [ ] Tests de sécurité (OWASP ZAP)
- [ ] Monitoring application (Prometheus)
- [ ] Documentation interactive (Swagger)

### Phase 4 - Cloud Native 🌥️
- [ ] Kubernetes deployment
- [ ] Helm charts
- [ ] Service mesh (Istio)
- [ ] Observabilité complète

## 📈 Métriques du projet

> **Focus développement :** Tests E2E automatisés et infrastructure Docker

### Travail réalisé
- **Tests E2E implémentés :** 3 scénarios automatisés (CT-001, CT-002, CT-006)
- **Cas de tests documentés :** 10 cas détaillés avec matrices de traçabilité
- **Documentation technique :** Stratégie, spécifications, cahier des charges
- **Configuration Playwright :** Multi-navigateurs et environnements
- **Scripts d'automatisation :** 2 scripts .bat Windows + setup global

### Architecture intégrée
- **Services Docker :** 5 containers orchestrés
- **Configuration réseau :** Communication inter-services
- **Base de données :** PostgreSQL avec données de test
- **Reverse proxy :** Nginx pour routage
- **Node.js portable :** Version 22.19.0 intégrée

### Performance tests
- **Temps d'exécution :** ~3-5 minutes (tests E2E)
- **Setup environnement :** ~2 minutes (Docker compose)
- **Coverage tests :** Module authentification complet

## 📧 Contact & Support

- **Auteur:** [Georges Mookherjee]
- **Email:** [georgesmookherjee@gmail.com]
- **LinkedIn:** [(https://www.linkedin.com/in/georges-mookherjee-0684812ab/)]
- **Issues:** [GitHub Issues](https://github.com/georgesmookherjee/realworld-qa-automation/issues)

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !**

> 💡 **Note:** Ce projet est conçu comme un showcase technique démontrant les bonnes pratiques en matière d'architecture microservices, tests automatisés et DevOps. Il constitue un exemple production-ready pour des applications web modernes.