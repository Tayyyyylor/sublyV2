

## 🐳 Configuration Docker

### Prérequis
- Docker
- Docker Compose
- Node.js (pour le développement local)

### Configuration de l'environnement

1. Créez un fichier `.env` à la racine du projet :
```env
# Configuration du serveur
PORT=3000
NODE_ENV=development

# Ajoutez ici vos autres variables d'environnement
# DATABASE_URL=
# JWT_SECRET=
# etc...
```

### Démarrage avec Docker

Pour lancer l'application en mode développement :

```bash
# Construction et démarrage des conteneurs
docker-compose up --build

# Pour lancer en arrière-plan (détaché)
docker-compose up --build -d
```
test
En production : 
```bash

docker-compose -f docker-compose.yml up --build
```

### Commandes Docker utiles

```bash
# Arrêter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f

# Reconstruire une image spécifique
docker-compose build subly-back
```

## 🔧 Structure du projet

L'application utilise une architecture Docker multi-stage pour optimiser la taille de l'image et la sécurité :
- Stage de build : Compilation du code TypeScript
- Stage de production : Image légère pour l'exécution

## 📝 Notes importantes

- Assurez-vous que toutes les variables d'environnement nécessaires sont définies dans le fichier `.env`
- L'application utilise Node.js 20 avec Alpine pour une image légère et sécurisée
- Le mode production est activé par défaut dans le conteneur

## 🚀 Développement

Pour le développement local sans Docker, aller dans le sous dossier /subly-back puis :

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run start:dev
```
