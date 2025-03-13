FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npx nx build front

FROM nginx:alpine
COPY --from=builder /app/dist/apps/front /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
