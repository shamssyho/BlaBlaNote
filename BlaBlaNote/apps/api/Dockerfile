# 1. Utiliser une image Node.js
FROM node:18-alpine

# 2. Définir le répertoire de travail
WORKDIR /app

# 3. Copier uniquement les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# 4. Copier les fichiers buildés depuis `dist/apps/api`
COPY dist/apps/api /app

# 5. Exposer le port NestJS
EXPOSE 3000

# 6. Lancer l'application avec le bon chemin
CMD ["node", "main.js"]
