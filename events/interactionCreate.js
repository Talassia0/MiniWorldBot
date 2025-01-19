const { InteractionType } = require("discord.js");
const client = require("../index.js");
const Discord = require("discord.js")
client.on("interactionCreate", async (interaction) => {


if(interaction.user.bot) return;

if (interaction.type === InteractionType.ApplicationCommand) {

  await interaction.deferReply();
  const command = client.slashCommands.get(interaction.commandName);
  if (command) {
    try {
      await command.run(client, interaction);
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: `There was an error while executing this command!
        \`\`\`\n${error}\n\`\`\``,
        ephemeral: true,
      });
    }
  }

} else if (interaction.isModalSubmit()){
  if (interaction.customId === "sendMap"){

    let language = {
      "pt-BR": {
       response: "Mapa salvo com sucesso. Use </mapa editar:13367> para fazer as modificações necessárias.",
        no: "Você precisa ter um uid salvo! </uid salvar:12367>"
      },
      "es-ES": {
      response: "Mapa guardado con éxito. Usa </mapa editar:13367> para realizar las modificaciones necesarias",
        no: "¡Necesitas tener un UID guardado! </uid salvar:12367>"
    }
    };


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

    let response = language[interaction.locale] ? language[interaction.locale] : {
      response: "Map saved successfully. Use </map edit:13367> to make the necessary changes.",
      no: "You need to have a UID saved! </uid save:12367>"
    }
    if (userdb.uid === "no"){
      await interaction.reply(response.no)
    } else {

      let titulo = interaction.fields.getTextInputValue('1');

      let description = interaction.fields.getTextInputValue("2");

      const min = 1000;
const max = 80000;
const id = Math.floor(Math.random() * (max - min + 1)) + min;

     let mapa = new client.mapas({
        id: `${id}`,
        uid: userdb.uid,
        title: `${titulo}`,
        description: `${description}`,
        dono: interaction.user.id
      })

      userdb.mapas.quantidade += 1;
      userdb.mapas.lista.push(id)
      await userdb.save();
      await mapa.save();

      await interaction.reply(response.response)

      let embed = new Discord.EmbedBuilder()
      .setTitle(`${mapa.title}`)
      .setDescription(`${mapa.description}`)
      .addFields({
        name: `Uid:`,
        value: `${mapa.uid}`
      })
      .setFooter({ text: `MapID: ${mapa.id}`})
      .setColor("Random")
      .setTimestamp()
      .setThumbnail(`${interaction.user.displayAvatarURL()}`)
      
      await client.channels.cache.get("1330319019114237982")
      .send({
        embeds: [embed]
      })

    }
  } else if (interaction.customId.startsWith("mapUpdate_")){

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

    let mapa = await client.mapas.findOne({
      id: `${interaction.customId.replace("mapUpdate_", "")}`,
      dono: interaction.user.id,
      uid: userdb.uid
    })

    mapa.updates = interaction.fields.getTextInputValue('1');

    await mapa.save();

    await interaction.deferUpdate()

    let language = {
      "pt-BR": "Atualização do mapa enviado, use o comando novamente para visualizar. ",
      "es-ES": "Actualización del mapa enviada, usa el comando nuevamente para visualizarla."
    }

       let response = language[interaction.locale] ? language[interaction.locale] : "**Map update sent, use the command again to view it.**"
    await interaction.editReply({
      content: response, 
      embeds: [],
      components: []
    })
  }
}


});