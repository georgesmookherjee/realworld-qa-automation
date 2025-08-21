# Dockerfile pour le frontend React/Redux
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (pas de package-lock.json)
RUN npm install

# Copier tout le code source
COPY . .

# Exposer le port 4100 (comme dans le README)
EXPOSE 4100

# Variables d'environnement
ENV PORT=4100
ENV REACT_APP_API_URL=http://api:3000/api
ENV REACT_APP_API_URL=http://localhost:3000/api

# Démarrer l'app en mode développement
CMD ["npm", "start"]