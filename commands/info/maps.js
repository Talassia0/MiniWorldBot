const Discord = require("discord.js");
const ms = require("ms")
let language = {
  send: {
    "pt-BR": {
       modal_title: "Gerenciamento de Mapas",
       modal_option: "Qual o nome de seu mapa?",
       modal_option2: "Diga uma descrição de seu mapa",
      response: "Clique no botão (🌐) para enviar seu mapa."
    },
    "es-ES": {
      modal_title: "Gestión de Mapas",
modal_option: "¿Cuál es el nombre de tu mapa?",
modal_option2: "Describe tu mapa.",
response: "Pressiona el botón (🌐) para enviar tu mapa."

    }
  },

  edit: {
     "pt-BR": {
       noMaps: "Você não tem nenhum mapa salvo.",
       edit: "Para editar um mapa, selecione no menu abaixo.",
       menu: "Seleção de mapas",
       noUser: "Apenas (@user) pode interagir esse botão.",
       buttonTitle: "Nome",
       buttonDescription: "Descrição",
       buttonImage: "Imagem",
       buttonConhecedor: "Enviar a Conhecedores", 
       buttonUpdate: "Anunciar Atualização", 
       "buttonDelete": "Deletar",

       titleMsg: "Envie no chat o novo título do seu mapa.",
       descriptionMsg: "Envie no chat a nova descrição do seu mapa.",

       mapDeleted: "O seu mapa foi deletado. Use o comando novamente.",

       modal_titleUpdate: "Atualização de Mapa",
       modal_optionUpdate: "Fale sobre a nova atualização...",

       updateMap: "Últimas atualizações"
     },

    "es-ES": {
      noMaps: "No tienes ningún mapa guardado.",
edit: "Para editar un mapa, selecciona en el menú de abajo.",
menu: "Selección de mapas",
noUser: "Solo (@user) puede interactuar con este botón.",
buttonTitle: "Nombre",
buttonDescription: "Descripción",
buttonImage: "Imagen",
buttonConhecedor: "Enviar a Conocedores",
buttonUpdate: "Anunciar Actualización",
buttonDelete: "Eliminar",

titleMsg: "Envía en el chat el nuevo título de tu mapa.",
descriptionMsg: "Envía en el chat la nueva descripción de tu mapa.",

mapDeleted: "Tu mapa ha sido eliminado. Usa el comando nuevamente.",

modal_titleUpdate: "Actualización de Mapa",
modal_optionUpdate: "Habla sobre la nueva actualización...",

updateMap: "Últimas actualizaciones"

    }
  }
}

module.exports = {
  name: "map",
  description: "Grupo de Comando relacionado aos mapas",
  type: 1,

  name_localizations: {
    "pt-BR": "mapa",
    "es-ES": "mapa"
  },

  options: [{
    name: "send",
    description: "Send a map to appear in your map list",
    type: 1,

    name_localizations: {
      "pt-BR": "enviar",
      "es-ES": "enviar"
    },

    description_localizations: {
      "pt-BR": "Envie um mapa para a sua lista de mapas",
      "es-ES": "Envía un mapa para que aparezca en tu lista de mapas"
    }
  },{
    name: "edit",
    description: "Edit a map you have already submitted to the map list",
    type: 1,
    name_localizations: {
      "pt-BR": "editar",
      "es-ES": "editar"
    }, 
    description_localizations: {
      "pt-BR": "Edite um mapa que você ja enviou a lista de mapas",
      "es-ES": "Edita un mapa que ya has enviado a la lista de mapas"
    }
  }],

  run: async(client, interaction) => {

    let cmd = interaction.options.getSubcommand();

    if (cmd === "edit"){

      let userdb = await client.userdb.findOne({
        userId: interaction.user.id
      })

      if (!userdb){
        let newuser = new client.userdb({
          userId: interaction.user.id
        })

        await newuser.save()

        userdb = await client.userdb.findOne({
        userId: interaction.user.id
      })
      }

      let response = language.edit[interaction.locale] ? language.edit[interaction.locale] : {
        noMaps: "You don't have any saved maps.",
        edit: "To edit a map, select one from the menu below.",
        menu: "Map Selection",
        noUser: "Only (@user) can interact with this button.",
        "buttonTitle": "Name",
  "buttonDescription": "Description",
  "buttonImage": "Image",
  buttonUpdate: "Announce Update",
  "buttonConhecedor": "Send to Critics",
        buttonDelete: "Delete",

          "titleMsg": "Send the new title of your map in the chat.",
  "descriptionMsg": "Send the new description of your map in the chat.",

        mapDeleted: "Your map has been deleted. Use the command again.",

        "modal_titleUpdate": "Map Update",
  "modal_optionUpdate": "Talk about the new update...",

updateMap: "**Latest updates**"

      }
      if (userdb.mapas.quantidade === 0){
        await interaction.editReply(response.noMaps)
      } else {
        let mapaAtual = 0;
        //console.log(userdb.mapas.lista)

        let mapas = userdb.mapas.lista;
        let menuOptions = [];

for (const mapa of mapas) {
  try {
    let i = await client.mapas.findOne({
      id: `${mapa}`,
      uid: `${userdb.uid}`,
      dono: `${interaction.user.id}`
    });
    if (i) {
      menuOptions.push({
        label: `${i.title}`,
        description: `ID: ${mapa}`,
        value: `${mapa}`
      });
    }
  } catch (error) {
    console.error(`Erro ao buscar mapa com ID ${mapa}:`, error);
  }
}


        let menu = new Discord.ActionRowBuilder()
        .addComponents(new Discord.StringSelectMenuBuilder()
			.setCustomId('mapasEditList')
			.setPlaceholder(`${response.menu}`)
      .addOptions(menuOptions)
		)

       let msg = await interaction.editReply({
          content: response.edit,
          components: [menu]
        })

        const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.StringSelect });

        const collectorB = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button });

        collectorB.on("collect", async(i) => {
          if (i.customId === "editTitle"){
            await i.deferUpdate();
    if (msg.id !== i.message.id) return;
    if (i.user.id !== interaction.user.id){

      await i.followUp({
        content: response.noUser.replace("(@user)", interaction.user),
        ephemeral: true
      })      
    } else {

      let botMsg = await msg.reply(response.titleMsg);

const requestMsg = interaction.channel.createMessageCollector({ time: ms("1m") });

requestMsg.on('collect', async(m) => {

  if (m.author.bot) return;
  if (m.author.id !== i.user.id) return;

  let nome = m.content;
  await m.delete()
  await botMsg.delete();
  await requestMsg.stop()
  
  let mapaEditando = await client.mapas.findOne({
        id: `${mapaAtual}`,
        uid: `${userdb.uid}`,
        dono: `${interaction.user.id}`
      })

  mapaEditando.title = nome;
  await mapaEditando.save();

  let embed = new Discord.EmbedBuilder()
      .setTitle(`${mapaEditando.title}`)
      .setDescription(`${mapaEditando.description}`)
      .addFields({
        name: `Uid:`,
        value: `${mapaEditando.uid}`
      })
      .setFooter({ text: `MapID: ${mapaEditando.id}`})
      .setColor("Blue")
      .setTimestamp()
      .setThumbnail(`${interaction.user.displayAvatarURL()}`)

  if (mapaEditando.updates !== "no") embed.addFields({
        name: `${response.updateMap}`,
        value: `${mapaEditando.updates}`
      })

      await i.editReply({
        embeds: [embed]
      })
  
});
    }
          } else           if (i.customId === "editDescription"){
            await i.deferUpdate();
    if (msg.id !== i.message.id) return;
    if (i.user.id !== interaction.user.id){

      await i.followUp({
        content: response.noUser.replace("(@user)", interaction.user),
        ephemeral: true
      })      
    } else {

      let botMsg = await msg.reply(response.descriptionMsg);

const requestMsg = interaction.channel.createMessageCollector({ time: ms("1m") });

requestMsg.on('collect', async(m) => {

  if (m.author.bot) return;
  if (m.author.id !== i.user.id) return;

  let nome = m.content;
  await m.delete()
  await botMsg.delete();
  await requestMsg.stop()
  
  let mapaEditando = await client.mapas.findOne({
        id: `${mapaAtual}`,
        uid: `${userdb.uid}`,
        dono: `${interaction.user.id}`
      })

  mapaEditando.description = nome;
  await mapaEditando.save();

  let embed = new Discord.EmbedBuilder()
      .setTitle(`${mapaEditando.title}`)
      .setDescription(`${mapaEditando.description}`)
      .addFields({
        name: `Uid:`,
        value: `${mapaEditando.uid}`
      })
      .setFooter({ text: `MapID: ${mapaEditando.id}`})
      .setColor("Blue")
      .setTimestamp()
      .setThumbnail(`${interaction.user.displayAvatarURL()}`)

        if (mapaEditando.updates !== "no") embed.addFields({
        name: `${response.updateMap}`,
        value: `${mapaEditando.updates}`
      })

      await i.editReply({
        embeds: [embed]
      })
  
});
    }
          } else if (i.customId === "deleteMap"){
            await i.deferUpdate();
    if (msg.id !== i.message.id) return;
    if (i.user.id !== interaction.user.id){

      await i.followUp({
        content: response.noUser.replace("(@user)", interaction.user),
        ephemeral: true
      })      
      
    } else {

      let mapaEditando = await client.mapas.deleteOne({
        id: `${mapaAtual}`,
        uid: `${userdb.uid}`,
        dono: `${interaction.user.id}`
      })

      

      let index = userdb.mapas.lista.indexOf(mapaAtual);
if (index !== -1) {
  userdb.mapas.lista.splice(index, 1); 

  userdb.mapas.quantidade -= 1;
      

      await userdb.save();
      
      await i.editReply({
        content: response.mapDeleted,
        embeds: [],
        components: []
      })
    }}
          } else if (i.customId === "mapUpdate"){
            
    if (i.user.id !== interaction.user.id){

      await i.deferUpdate();
    if (msg.id !== i.message.id) return;
      
      await i.followUp({
        content: response.noUser.replace("(@user)", interaction.user),
        ephemeral: true
      })      
    } else {

      let modal = new Discord.ModalBuilder()
			.setCustomId('mapUpdate_'+mapaAtual)
			.setTitle(response.modal_titleUpdate);

		let option1 = new Discord.TextInputBuilder()
			.setCustomId('1')
			.setLabel(response.modal_optionUpdate)
		  .setStyle(Discord.TextInputStyle.Short)
      .setRequired(true)

      modal.addComponents(new Discord.ActionRowBuilder().addComponents(option1))

      await i.showModal(modal);
    }
            
          }
        })

collector.on('collect', async(i) => {
  if (i.customId === "mapasEditList"){
  await i.deferUpdate();
    if (msg.id !== i.message.id) return;
    if (i.user.id !== interaction.user.id){

      await i.followUp({
        content: response.noUser.replace("(@user)", interaction.user),
        ephemeral: true
      })      
    } else {

      let mapaEditando = await client.mapas.findOne({
        id: `${i.values[0]}`,
        uid: `${userdb.uid}`,
        dono: `${interaction.user.id}`
      })

      let embed = new Discord.EmbedBuilder()
      .setTitle(`${mapaEditando.title}`)
      .setDescription(`${mapaEditando.description}`)
      .addFields({
        name: `Uid:`,
        value: `${mapaEditando.uid}`
      })
      .setFooter({ text: `MapID: ${mapaEditando.id}`})
      .setColor("Blue")
      .setTimestamp()
      .setThumbnail(`${interaction.user.displayAvatarURL()}`)

      if (mapaEditando.updates !== "no") embed.addFields({
        name: `${response.updateMap}`,
        value: `${mapaEditando.updates}`
      })

     mapaAtual = i.values[0];
      
      let buttons = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setLabel(response.buttonTitle)
        .setCustomId("editTitle")
        .setStyle(Discord.ButtonStyle.Secondary),
        new Discord.ButtonBuilder()
        .setLabel(response.buttonDescription)
        .setCustomId("editDescription")
        .setStyle(Discord.ButtonStyle.Secondary),
        new Discord.ButtonBuilder()
        .setLabel(response.buttonImage)
        .setCustomId("editImage")
        .setStyle(Discord.ButtonStyle.Secondary)
        .setDisabled(true),
        new Discord.ButtonBuilder()
        .setLabel(response.buttonUpdate)
        .setCustomId("mapUpdate")
        .setStyle(Discord.ButtonStyle.Primary),
        new Discord.ButtonBuilder()
        .setLabel(response.buttonConhecedor)
        .setCustomId("sendConhecedor")
        .setStyle(Discord.ButtonStyle.Success)
        .setDisabled(true)
      )

      let buttons2 = new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
        .setLabel(response.buttonDelete)
        .setCustomId("deleteMap")
        .setStyle(Discord.ButtonStyle.Danger)
      )

        
        // await i.deferUpdate()
         await i.editReply({
           content: `${i.user}`,
           embeds: [embed],
           components: [menu, buttons, buttons2]
         })

      
    }
  }
});
      }
      
    }

  
    if (cmd === "send"){

      let response = language.send[interaction.locale] ? language.send[interaction.locale] : {
  "modal_title": "Map Management",
  "modal_option": "What is the name of your map?",
  "modal_option2": "Provide a description of your map",
        response: "Click the (🌐) button to submit your map."
}

        
        
        const modal = new Discord.ModalBuilder()
			.setCustomId('sendMap')
			.setTitle(response.modal_title);

		const option1 = new Discord.TextInputBuilder()
			.setCustomId('1')
			.setLabel(response.modal_option)
		  .setStyle(Discord.TextInputStyle.Short)
      .setRequired(true)

      const option2 = new Discord.TextInputBuilder()
			.setCustomId("2")
			.setLabel(response.modal_option2)
		  .setStyle(Discord.TextInputStyle.Paragraph)
      .setRequired(true)
  

      modal.addComponents(new Discord.ActionRowBuilder().addComponents(option1), new Discord.ActionRowBuilder().addComponents(option2));

     // await interaction.showModal(modal);
     let msg = await interaction.editReply({
        content: response.response,
        components: [new Discord.ActionRowBuilder()
                    .addComponents(
                      new Discord.ButtonBuilder()
                      .setLabel("🌐")
                      .setCustomId("mapButton")
                      .setStyle(Discord.ButtonStyle.Success)
                    )]
      })

      const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: ms("2m") });

        let confirm = false;
        

collector.on('collect', async(i) => {
	if (i.customId === "mapButton"){

    await i.showModal(modal);
    
  }
})

    }
  }
}