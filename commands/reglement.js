const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reglement')
    .setDescription('Envoie le règlement du serveur avec un bouton pour accepter')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('Le salon où envoyer le règlement')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Par défaut limité aux admins
  
  async execute(interaction) {
    // Vérifier que l'utilisateur a le rôle autorisé
    const hasPermission = interaction.member.roles.cache.has(config.authorizedRoleId);
    
    if (!hasPermission && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: 'Vous n\'avez pas la permission d\'utiliser cette commande.',
        ephemeral: true
      });
    }
    
    const channel = interaction.options.getChannel('channel');
    
    // Créer l'embed du règlement
    const rulesEmbed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📜 Règlement du serveur de support')
      .setDescription('Veuillez lire attentivement le règlement ci-dessous et cliquer sur le bouton pour obtenir accès au serveur.')
      .addFields(
        { name: '1. Respect mutuel', value: 'Soyez respectueux envers tous les membres. Aucune forme de harcèlement, de discrimination ou de comportement toxique ne sera tolérée.' },
        { name: '2. Contenu inapproprié', value: 'Pas de contenu NSFW, violent, politique ou discriminatoire. Tout contenu inapproprié sera supprimé et les récidivistes seront bannis.' },
        { name: '3. Spam et publicité', value: 'Le spam et la publicité non autorisée sont interdits. Demandez la permission à un modérateur avant de partager des liens.' },
        { name: '4. Canaux appropriés', value: 'Utilisez les canaux appropriés pour vos discussions. Respectez le sujet de chaque canal.' },
        { name: '5. Aide et Support', value: 'Soyez patients lorsque vous demandez de l\'aide. Fournissez suffisamment d\'informations pour permettre aux autres de vous aider efficacement.' },
        { name: '6. Commandes du bot', value: 'N\'abusez pas des commandes du bot. L\'utilisation excessive ou inappropriée peut entraîner une restriction d\'accès.' },
        { name: '7. Signalement', value: 'Signalez tout comportement inapproprié à un modérateur plutôt que de répondre directement.' },
        { name: '8. Modifications du règlement', value: 'Ce règlement peut être modifié à tout moment. Il est de votre responsabilité de vous tenir informé des changements.' }
      )
      .setFooter({ text: 'En cliquant sur le bouton ci-dessous, vous acceptez de respecter ce règlement.' })
      .setTimestamp();
    
    // Créer le bouton
    const acceptButton = new ButtonBuilder()
      .setCustomId('accept-rules')
      .setLabel('J\'accepte le règlement')
      .setStyle(ButtonStyle.Success)
      .setEmoji('✅');
    
    const row = new ActionRowBuilder().addComponents(acceptButton);
    
    // Envoyer l'embed avec le bouton
    await channel.send({
      embeds: [rulesEmbed],
      components: [row]
    });
    
    // Répondre à l'interaction
    await interaction.reply({
      content: `Le règlement a été envoyé avec succès dans ${channel}!`,
      ephemeral: true
    });
  },
}; 