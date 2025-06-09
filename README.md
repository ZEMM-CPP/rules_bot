# Bot de Règlement Discord

Ce bot permet d'envoyer un embed contenant le règlement du serveur avec un bouton. Lorsqu'un utilisateur clique sur le bouton, il reçoit automatiquement un rôle spécifique.

## Installation

1. Clonez ce dépôt
2. Installez les dépendances avec `npm install`
3. Modifiez le fichier `config.json` avec vos informations:
   ```json
   {
     "token": "",
     "clientId": "",
     "guildId": "",
     "authorizedRoleId": "",
     "rulesRoleId": ""
   }
   ```
4. Démarrez le bot avec `npm start`

## Utilisation

La commande `/reglement channel:#nom-du-salon` permet d'envoyer l'embed du règlement dans le salon spécifié.

Cette commande ne peut être utilisée que par:
- Les administrateurs du serveur
- Les membres ayant le rôle spécifié dans `authorizedRoleId`

## Personnalisation

Vous pouvez personnaliser le contenu du règlement en modifiant le fichier `commands/reglement.js`. Vous pouvez ajuster:
- Le titre et la description de l'embed
- Les règles (champs de l'embed)
- Le texte du bouton
- Les couleurs et le style

## Permissions nécessaires

Le bot a besoin des permissions suivantes:
- `SEND_MESSAGES` - Pour envoyer l'embed
- `EMBED_LINKS` - Pour envoyer des embeds
- `MANAGE_ROLES` - Pour attribuer des rôles
- `USE_APPLICATION_COMMANDS` - Pour les commandes slash

Assurez-vous que le rôle du bot est placé au-dessus du rôle qu'il doit attribuer dans la hiérarchie des rôles du serveur. 
