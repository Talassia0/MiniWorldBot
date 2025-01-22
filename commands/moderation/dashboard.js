const Discord = require("discord.js");
const ms = require("ms");
const { PermissionsBitField } = require("discord.js")
let language  = {
  "pt-BR": {
    titleMenu: "Configuração de (guild)",
    descriptionMenu: "Para configurar cada função,  selecione pelo menu abaixo.",
    reaction: "Registro de Reações",
    menuNome: "Lista de funções",
    menuDescription: "Clique na opção para selecionar",
    noUser: "Apenas (@user) pode interagir nesses botões!",

    reactionMenu: "Canal de texto para registros de Reações: (#channel)\n\nStatus do sistema: (status)",
    statusOn: "Ativado",
    statusOf: "Desativado",
    noChannel: "**`Nenhum canal ativo.`**",
    buttonReaction: "Selecionar Canal",
    reactionText: "Mencione o canal de texto para configurar."
  },
  "es-ES": {
  "titleMenu": "Configuración de (guild)",
  "descriptionMenu": "Para configurar cada rol, selecciona desde el menú abajo.",
  "reaction": "Registro de Reacciones",
  "menuNome": "Lista de roles",
  "menuDescription": "Haz clic en la opción para seleccionar",
  "noUser": "¡Solo (@user) puede interactuar con estos botones!",

  "reactionMenu": "Canal de texto para registros de reacciones: (#channel)\n\nEstado del sistema: (status)",
  "statusOn": "Activado",
  "statusOf": "Desactivado",
  "noChannel": "**`Ningún canal activo.`**",
  "buttonReaction": "Seleccionar Canal",
  "reactionText": "Menciona el canal de texto para configurar."
  }
}

module.exports = {
  name: "configure",
  description: "Activate administration systems on your server!",
  type: 1,
  default_member_permissions: (1 << 5),
  name_localizations: {
    "pt-BR": "configurar",
    "es-ES": "configurar"
  },
  description_localizations: {
    "pt-BR": "Ative sistemas de administração do seu servidor",
    "es-ES": "Activa sistemas de administración en tu servidor"
  },
  run: async(client, interaction) => {

    if (!interaction.member.permissions.has(PermissionsBitField.ManageGuild)) return interaction.editReply({
      content: "Você não tem permissão de gerenciar o servidor!"
    })


    let serverdb = await client.serverdb.findOne({
      guildId: interaction.guild.id
    })

    if (!serverdb) {
      let newguild = new client.serverdb({
        guildId: interaction.guild.id,
        language: interaction.locale
      })

      await newguild.save()

      serverdb = await client.serverdb.findOne({
      guildId: interaction.guild.id
    })
    }

    let response = language[interaction.locale] ? language[interaction.locale] : {
  "titleMenu": "Configuration of (guild)",
  "descriptionMenu": "To configure each role, select it from the menu below.",
  "reaction": "Reaction Log",
      menuNome: "List of systems",
  "menuDescription": "Click on the option to select",
      noUser: "Only (@user) can interact with this button.",
      "reactionMenu": "Text channel for Reaction Logs: (#channel)\n\nSystem status: (status)",
  "statusOn": "Enabled",
  "statusOf": "Disabled",
  "noChannel": "**`No active channel.`**",
  "buttonReaction": "Select Channel",
  "reactionText": "Mention the text channel to configure."

    }



    
    let embed = new Discord.EmbedBuilder()
    .setTitle(response.titleMenu.replace("(guild)", interaction.guild.name))
    .setDescription(response.descriptionMenu)
    .setColor("Orange")
    .setThumbnail(`${interaction.guild.iconURL()}`)
    .setTimestamp()


    let menu = new Discord.StringSelectMenuBuilder()
			.setCustomId('configure')
			.setPlaceholder(response.menuNome)
      .addOptions({
        label: response.reaction,
        description: response.menuDescription,
        value: "1"
      })

    menu = new Discord.ActionRowBuilder()
    .addComponents(menu)
      
    let msg = await interaction.editReply({
      content: `${interaction.user}`,
      embeds: [embed],
      components: [menu]
    })

    const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.StringSelect })

    const collectorButton = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button })

    collectorButton.on('collect', async i => {
      if (i.customId === "reactionStatus"){
        await i.deferUpdate();
    if (msg.id !== i.message.id) return;
    if (i.user.id !== interaction.user.id){

      await i.followUp({
        content: response.noUser.replace("(@user)", interaction.user),
        ephemeral: true
      })      
    } else {

      if (!serverdb.logs.reactionStatus){
         serverdb.logs.reactionStatus = true;
      } else if (serverdb.logs.reactionStatus){
        serverdb.logs.reactionStatus = false;
      }

      console.log(serverdb.logs.reactionStatus)
      await serverdb.save()

      let buttonSelectChannel = new Discord.ButtonBuilder()
      .setLabel(response.buttonReaction)
      .setCustomId("buttonReact")
      .setStyle(Discord.ButtonStyle.Secondary)

      let buttonStatus = new Discord.ButtonBuilder()
    .setCustomId("reactionStatus")


      if (serverdb.logs.reactionStatus){
        buttonStatus.setLabel(response.statusOn)
        buttonStatus.setStyle(Discord.ButtonStyle.Success)
      
      
      } else {
        buttonStatus.setLabel(response.statusOf)
        buttonStatus.setStyle(Discord.ButtonStyle.Danger)
      }

     let channel = response.noChannel;
      if (serverdb.logs.reaction !== "no") channel = interaction.guild.channels.cache.get(serverdb.logs.reaction)

      let status = response.statusOf;
      if (serverdb.logs.reactionStatus) status = response.statusOn

      let embedReaction = new Discord.EmbedBuilder()
      .setTitle(response.titleMenu.replace("(guild)", interaction.guild.name))
    .setDescription(response.reactionMenu.replace("(#channel)", channel).replace("(status)", status))
    .setColor("Blue")
    .setThumbnail(`${interaction.guild.iconURL()}`)
    .setTimestamp()

      await i.editReply({
        embeds: [embedReaction],
        components: [menu, new Discord.ActionRowBuilder().addComponents(buttonSelectChannel, buttonStatus)]
      })
    }
      }
      if (i.customId === "buttonReact"){
        await i.deferUpdate();
    if (msg.id !== i.message.id) return;
    if (i.user.id !== interaction.user.id){

      await i.followUp({
        content: response.noUser.replace("(@user)", interaction.user),
        ephemeral: true
      })      
    } else {

      let msgBot = await msg.reply(response.reactionText);

      let msgC = interaction.channel.createMessageCollector({ time: ms("5m") });

msgC.on('collect', async m => {
	if (m.author.bot) return;
  if (m.author.id !== interaction.user.id) return;

  let channelSelect = interaction.guild.channels.cache.get(m.mentions.channels.first().id);
 // console.log(channel)
  if (!channelSelect) {
    await m.delete();
    await msgBot.delete();
    await msgC.stop();
  } else {

    await m.delete();
    await msgBot.delete();
    await msgC.stop();

    serverdb.logs.reaction = channelSelect.id;
    await serverdb.save();

    let buttonSelectChannel = new Discord.ButtonBuilder()
      .setLabel(response.buttonReaction)
      .setCustomId("buttonReact")
      .setStyle(Discord.ButtonStyle.Secondary)

      let buttonStatus = new Discord.ButtonBuilder()
    .setCustomId("reactionStatus")


      if (serverdb.logs.reactionStatus){
        buttonStatus.setLabel(response.statusOn)
        buttonStatus.setStyle(Discord.ButtonStyle.Success)
      
      
      } else {
        buttonStatus.setLabel(response.statusOf)
        buttonStatus.setStyle(Discord.ButtonStyle.Danger)
      }

     let channel = response.noChannel;
      if (serverdb.logs.reaction !== "no") channel = interaction.guild.channels.cache.get(serverdb.logs.reaction)

      let status = response.statusOf;
      if (serverdb.logs.reactionStatus) status = response.statusOn

      let embedReaction = new Discord.EmbedBuilder()
      .setTitle(response.titleMenu.replace("(guild)", interaction.guild.name))
    .setDescription(response.reactionMenu.replace("(#channel)", channel).replace("(status)", status))
    .setColor("Blue")
    .setThumbnail(`${interaction.guild.iconURL()}`)
    .setTimestamp()

      await i.editReply({
        embeds: [embedReaction],
        components: [menu, new Discord.ActionRowBuilder().addComponents(buttonSelectChannel, buttonStatus)]
      })
  }
});
    }
      }
    })

                                                

collector.on('collect', async i => {
	if (i.customId === "configure"){
    const selection = i.values[0];

    if (selection === "1") {

    await i.deferUpdate();
    if (msg.id !== i.message.id) return;
    if (i.user.id !== interaction.user.id){

      await i.followUp({
        content: response.noUser.replace("(@user)", interaction.user),
        ephemeral: true
      })      
    } else {
      let buttonSelectChannel = new Discord.ButtonBuilder()
      .setLabel(response.buttonReaction)
      .setCustomId("buttonReact")
      .setStyle(Discord.ButtonStyle.Secondary)

      let buttonStatus = new Discord.ButtonBuilder()
    .setCustomId("reactionStatus")


      if (serverdb.logs.reactionStatus){
        buttonStatus.setLabel(response.statusOn)
        buttonStatus.setStyle(Discord.ButtonStyle.Success)
      
      
      } else {
        buttonStatus.setLabel(response.statusOf)
        buttonStatus.setStyle(Discord.ButtonStyle.Danger)
      }

     let channel = response.noChannel;
      if (serverdb.logs.reaction !== "no") channel = interaction.guild.channels.cache.get(serverdb.logs.reaction)

      let status = response.statusOf;
      if (serverdb.logs.reactionStatus) status = response.statusOn

      let embedReaction = new Discord.EmbedBuilder()
      .setTitle(response.titleMenu.replace("(guild)", interaction.guild.name))
    .setDescription(response.reactionMenu.replace("(#channel)", channel).replace("(status)", status))
    .setColor("Blue")
    .setThumbnail(`${interaction.guild.iconURL()}`)
    .setTimestamp()

      await i.editReply({
        embeds: [embedReaction],
        components: [menu, new Discord.ActionRowBuilder().addComponents(buttonSelectChannel, buttonStatus)]
      })
    }
  }
  }
});
  }
}