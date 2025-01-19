const { EmbedBuilder } = require("discord.js")
let language = {
  save: {
  "pt-BR": `Seu uid foi salvo para **\`(uid)\`**!`,
  "es-ES": `¡Tu UID ha sido guardado como **\`(uid)\`**!`,
  },

  view: {
     "pt-BR": {
       "no": "O usuário não tem um UID salvo.",
       "response": "O UID de (@user) é **(uid)**!"
     },

    "es-ES": {
      no: "El usuario no tiene un UID guardado.",
      response: "¡La UID de (@user) es (uid)!"
    }
  }
}
module.exports = {
  name: "uid",
  description: "Comandos relacionados a uid",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [{
    name: "save",
    description: "Save your UID in MiniWorldBOT to unlock more related features",
    type: 1,

    name_localizations: {
      "pt-BR": "salvar",
      "es-ES": "guardar"
    },
    description_localizations: {
      "es-ES": "Guarda tu UID en MiniWorldBOT para desbloquear más funciones relacionadas",
      "pt-BR": "Salve seu Uid no MiniWorldBOT para liberar mais funções relacionadas"
    },
    options: [{
      name: "uid",
      description: "Your UID",
      type: 10,
      required: true,
      max_length: 10,
      min_value: 1000,

      description_localizations: {
        "pt-BR": "Seu uid",
         "es-ES": "Tu uid"
      }
    }]
  },{
    name: "view",
    description: "View the UID of other Discord users",
    type: 1,

    name_localizations: {
      "pt-BR": "ver",
      "es-ES": "ver"
    },
    description_localizations: {
      "pt-BR": "Veja o UID de outros usuários do Discord",
       "es-ES": "Mira el UID de otros usuarios de Discord"
    },

    options: [{
      name: "user",
      description: "Mention the user or enter the ID",
      type: 6,
      required: true,

      name_localizations: {
       "pt-BR": "usuário",
       "es-ES": "usuario"
      },
      description_localizations: {
        "pt-BR": "Mencione o usuário ou insira o ID",
        "es-ES": "Menciona al usuario o ingresa el ID"
      }
    }]
  }],

  run: async(client, interaction) => {

    let cmd = interaction.options.getSubcommand();

    if (cmd === "view"){
      let user = interaction.options.getUser("user")
    
    let userdb = await client.userdb.findOne({
        userId: user.id
      });

      if (!userdb){
        let newuser = new client.userdb({
          userId: user.id
        })

        await newuser.save();

        userdb = await client.userdb.findOne({
          userId: user.id
        })
      }

      let response = language.view[interaction.locale] ? language.view[interaction.locale] : {
        no: "The user does not have a saved UID.",
        response: "The UID of (@user) is (uid)!"
      }
      if (userdb.uid === "no") {

        await interaction.editReply(response.no);
        
      } else {
        await interaction.editReply(response.response.replace("(@user)", user).replace("(uid)", userdb.uid))
      }
    } else if (cmd === "save"){

      let userdb = await client.userdb.findOne({
        userId: interaction.user.id
      });

      if (!userdb){
        let newuser = new client.userdb({
          userId: interaction.user.id
        })

        await newuser.save();

        userdb = await client.userdb.findOne({
          userId: interaction.user.id
        })
      }


      let uid = interaction.options.getNumber("uid");

      userdb.uid = uid;
      let response = language.save[interaction.locale] ? language.save[interaction.locale].replace("(uid)", uid) : `Your UID has been saved as **\`(uid)\`**!`.replace("(uid)", uid);

      await interaction.editReply({
        content: response
      });

      await userdb.save();

      let log = client.channels.cache.get("1329752198652891136");

        await log.send({
          embeds: [
            new EmbedBuilder()
            .setTitle("Log de Uid")
            .setDescription(`O usuário **${interaction.user.username}** salvou seu uid como ${uid}`)
            .setColor("Green")
            .setTimestamp()
            .setThumbnail(`${interaction.user.displayAvatarURL()}`)
          ],
          content: `User id: ${interaction.user.id}`
        })
    }
  }
}