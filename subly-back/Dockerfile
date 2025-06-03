# 1) Stage de build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copier l’ensemble du code source
COPY . .

# Compiler le projet NestJS en JS (dist/)
RUN npm run build

# 2) Stage de production
FROM node:20-alpine

WORKDIR /app

# Indiquer qu’on se place en prod (pour npm ci --only=production)
ENV NODE_ENV=production

# Copier uniquement package.json & lockfile
COPY package.json package-lock.json ./

# Installer uniquement les dépendances de production
RUN npm ci --only=production

# Copier le code compilé du builder (dist/) dans ce conteneur
COPY --from=builder /app/dist ./dist

# (Optionnel) Copier les fichiers de configuration (ormconfig, .env.example, etc.), si nécessaire
# COPY --from=builder /app/.env ./

# Exposer le port sur lequel tourne NestJS (par défaut 3000)
EXPOSE 3000

# Commande pour lancer le serveur
CMD ["node", "dist/main"]
