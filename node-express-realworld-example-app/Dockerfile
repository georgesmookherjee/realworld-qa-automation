# Dockerfile pour le backend Node.js/Express/Prisma (Node standard au lieu d'Alpine)
FROM node:lts

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=3000

# Script de démarrage qui attend la DB et fait les migrations
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm start"]