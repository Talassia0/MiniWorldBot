const Discord = require("discord.js");
const ms = require("ms");

let language = {
  daily: {
     "pt-BR": {
       cooldown: "Você já resgatou suas Minifeijões diárias! Volte aqui em: (time)",
       response: "Você hoje resgatou (beans) Mini Feijoes! Volte novamente amanhã!",
       cooldown_msg: {
         hora: "hora",
         minuto: "minuto",
         segundo: "segundo"
       }
     },

    "es-ES": {
      cooldown: "¡Ya has canjeado tus mini frijoles diarios! Vuelve aquí en: (time)",
      response: "¡Hoy has canjeado (beans) Mini Frijoles! ¡Vuelve mañana!",
      cooldown_msg: {
        hora: "hora",
        minuto: "minuto",
        segundo: "segundo"
      }
    }
  }
}
module.exports = {
  name: "minibeans",
  description: "Comandos relacionados a Mini Feijões", 
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  name_localizations: {
    "pt-BR": "minifeijões",
    "es-ES": "minifrijoles"
  },

  options: [{
    name: "daily",
    description: "Redeem your daily mini beans",
    type: 1,

    name_localizations: {
      "pt-BR": "diárias",
      "es-ES": "diarias"
    }, 

    description_localizations: {
      "pt-BR": "Resgate suas mini feijões diárias",
      "es-ES": "¡Canjea tus mini frijoles diarios!"
    }
            }],

  run: async(client, interaction) => {

    let cmd = interaction.options.getSubcommand();

    if (cmd === "daily"){
      let userdb = await client.userdb.findOne({
        userId: interaction.user.id
      });

      if (!userdb){
        let newuser = new client.userdb({
          userId: interaction.user.id
        });

        await newuser.save();

        userdb = await client.userdb.findOne({
          userId: interaction.user.id
        });
      }

      let response = language.daily[interaction.locale] ? language.daily[interaction.locale] : {
        cooldown: "You have already redeemed your daily Mini Beans! Come back here in: (time)",
        response: "You have redeemed (beans) Mini Beans today! Come back again tomorrow!",
cooldown_msg: {
  hora: "hour",
  minuto: "minute",
  segundo: "second"
}
      }

      if (Date.now() < userdb.economy.cooldown) {
  let timeRemaining = userdb.economy.cooldown - Date.now();  // Tempo restante em milissegundos

  await interaction.editReply({
    content: response.cooldown.replace("(time)", formatCooldownTime(response.cooldown_msg, timeRemaining))
  });        
      } else {

        const min = 1000;
const max = 20000;
const beans = Math.floor(Math.random() * (max - min + 1)) + min;


        userdb.economy.minibeans += beans;
        userdb.economy.cooldown = Date.now() + ms("1d");

        await interaction.editReply({
          content: response.response.replace("(beans)", formatarNumero(beans))
        })

        await userdb.save()

        await client.channels.cache.get("1329806974002532352").send({
          embeds: [new Discord.EmbedBuilder()
            .setTitle("Log de Mini Feijoes")
            .setDescription(`O usuário **${interaction.user.username}** teve uma adição de +${formatarNumero(beans)} mini feijões.`).setColor("Green").setThumbnail(`${interaction.user.displayAvatarURL()}`).setTimestamp()],
          content: `User ID: ${interaction.user.id}`
            })
      }
    }
  }
}

function formatCooldownTime(idioma, ms) {
  const hours = Math.floor(ms / (1000 * 60 * 60));  // Horas
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));  // Minutos
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);  // Segundos

  const timeArray = [];

  if (hours > 0) timeArray.push(`${hours} ${idioma.hora}${hours > 1 ? 's' : ''}`);
  if (minutes > 0) timeArray.push(`${minutes} ${idioma.minuto}${minutes > 1 ? 's' : ''}`);
  if (seconds > 0) timeArray.push(`${seconds} ${idioma.segundo}${seconds > 1 ? 's' : ''}`);

  return timeArray.join(', ');
}

function formatarNumero(numero) {
  return numero.toLocaleString('pt-BR');
}