const { Client, GatewayIntentBits, Collection, Events, REST, Routes, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Création du client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

// Collection pour stocker les commandes
client.commands = new Collection();

// Chargement des commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] La commande dans ${filePath} manque de propriétés requises.`);
  }
}

// Événement quand le bot est prêt
client.once(Events.ClientReady, () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
});

// Gestion des interactions (commandes slash et boutons)
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'Une erreur est survenue lors de l\'exécution de cette commande !',
        ephemeral: true
      });
    }
  } else if (interaction.isButton()) {
    // Gestion des boutons
    if (interaction.customId === 'accept-rules') {
      try {
        // Ajouter le rôle à l'utilisateur
        const role = interaction.guild.roles.cache.get(config.rulesRoleId);
        if (!role) return interaction.reply({ content: 'Le rôle n\'a pas été trouvé.', ephemeral: true });
        
        // Vérifier que le bot a la permission d'attribuer ce rôle
        const botMember = interaction.guild.members.cache.get(client.user.id);
        if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
          return interaction.reply({ 
            content: 'Je n\'ai pas la permission de gérer les rôles. Veuillez demander à un administrateur de me donner cette permission.', 
            ephemeral: true 
          });
        }
        
        // Vérifier que le rôle du bot est plus haut que le rôle à attribuer
        const botRole = botMember.roles.highest;
        if (botRole.position <= role.position) {
          return interaction.reply({ 
            content: 'Je ne peux pas attribuer ce rôle car il est placé plus haut ou au même niveau que mon rôle le plus élevé dans la hiérarchie.', 
            ephemeral: true 
          });
        }
        
        await interaction.member.roles.add(role);
        await interaction.reply({ content: 'Vous avez accepté le règlement et reçu votre rôle!', ephemeral: true });
      } catch (error) {
        console.error(error);
        await interaction.reply({ 
          content: `Une erreur est survenue lors de l'attribution du rôle: ${error.message}`, 
          ephemeral: true 
        });
      }
    }
  }
});

// Déploiement des commandes
const deployCommands = async () => {
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  const commands = [];
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command) {
      commands.push(command.data.toJSON());
    }
  }

  const rest = new REST().setToken(config.token);

  try {
    console.log('Déploiement des commandes slash...');

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );

    console.log('Commandes slash déployées avec succès!');
  } catch (error) {
    console.error(error);
  }
};

// Connexion du bot et déploiement des commandes
client.login(config.token)
  .then(() => deployCommands()); 