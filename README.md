# Groupomania
# Créez un réseau social d'entreprise
Ceci est le projet 7 du parcours développeur web


![AwesomeCourses](https://badgen.net/badge/Project/OpenClassrooms/purple)
![FrontEnd](https://badgen.net/badge/Frontend/Angular/red)
![BackEnd](https://badgen.net/badge/Backend/Node.js/green)
![Database](https://badgen.net/badge/Database/MySQL/blue)
![Style](https://badgen.net/badge/Style/Sass/pink)


## Mission
Le projet consiste à construire un réseau social interne pour les employés de Groupomania. Le but de cet outil est de faciliter les interactions entre collègues. Le département RH de Groupomania a laissé libre cours à son imagination pour les fonctionnalités du réseau et a imaginé plusieurs briques pour favoriser les échanges entre collègues.

Perimètre :    
- la présentation des fonctionnalités doit être simple    
- la création d’un compte doit être simple et possible depuis un téléphone mobile
- le profil doit contenir très peu d’informations pour que sa complétion soit rapide
- la suppression du compte doit être possible
- l’accès à un forum où les salariés publient des contenus multimédias doit être présent
- l’accès à un forum où les salariés publient des textes doit être présent
- les utilisateurs doivent pouvoir facilement repérer les dernières participations des employés
- le ou la chargé-e de communication Groupomania doit pouvoir modérer les interactions entre salariés


## Installation
### 1. Cloner le dépot
Depuis le terminal :
- `git clone https://github.com/Jerome-Baille/JeromeBaille_7_23022022`
- `cd JeromeBaille_7_23022022`

### 2. Initialiser le back-end
- Commencer par vous placer dans le dossier backend avec la commande : `cd backend`
- Créez un dossier images (où serons stockées toutes les images uploader par les utilisateurs): `mkdir images`
- Installer les dépendances : `npm install` 

- Créez un fichier `.env` et y renseigner les variables d'environnement suivantes pour faire fonctionner l'application :
ACCESS_TOKEN="RANDOM_TOKEN_SECRET"
REFRESH_TOKEN="ANOTHER_TOKEN"

(L'access token a une durée de vie de 1h et le refresh token de 30 jours. Lorsque l'access token expire, il est renouvelé grâce au refresh token, permettant à l'utilisateur de rester connecté.)

- Créez la base de donnée : `sequelize db:create`
- Créez les tables : `sequelize db:migrate`

- Lancer le serveur back-end : `nodemon server` 


### 3. Installer le front-end
Dans votre terminal et depuis le dossier "JeromeBaille_7_23022022" :
- Exécutez la commande : `cd frontend`
- Puis pour installer les dépendances : `npm install`  
- Pour lancer le serveur front-end : `ng serve` 