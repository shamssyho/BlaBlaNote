# ---- Builder phase ----
FROM node:23-alpine AS builder

WORKDIR /app

# Copie des fichiers de config
COPY package*.json ./
COPY tsconfig*.json ./
COPY nx.json ./
COPY eslint.config.mjs ./

# Copie du code source
COPY apps ./apps
COPY apps/api/prisma ./prisma
COPY .env .env

# Installation des dépendances complètes pour le build
RUN npm install

# Génération du client Prisma
RUN npx prisma generate

# Build de l'application NestJS (via Nx)
RUN npx nx build api

# ---- Production image ----
FROM node:23-alpine

WORKDIR /app

# Installation des dépendances de prod uniquement
COPY package*.json ./
RUN npm install --only=production

# Copie du code compilé et du client Prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/dist/apps/api ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
