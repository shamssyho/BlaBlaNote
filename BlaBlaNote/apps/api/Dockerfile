# ---- Builder phase ----
FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nx.json ./
COPY eslint.config.mjs ./
COPY apps ./apps
COPY apps/api/prisma ./prisma

RUN npm install
RUN npx prisma generate
RUN npx nx build api

# ---- Production image ----
FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma

COPY --from=builder /app/dist/apps/api ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
