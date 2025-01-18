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
  },

  saldo: {
     "pt-BR": {
       isAuthor: "Você tem (beans) mini feijões e está na posição (position) do rank!",
       NoIsAuthor: "(@user) tem (beans) mini feijoes e está na posição (position) do rank!"
     },
    "es-ES": {
      isAuthor: "¡Tienes (beans) Mini Frijoles y estás en la posición (position) del ranking!",
       NoIsAuthor: "¡(@user) tiene (@beans) Mini Frijoles y está en la posición (position) del ranking!"
    }
  },

  pay: {
    "pt-BR":{
      isAuthor: "Você não pode enviar Minifeijões para você mesmo!",
      noValue: "Você não tem Minifeijões suficientes para fazer essa transação.",
      start: "Você está prestes a transferir (beans) Mini Feijões para (@user). \n\nPara transferir, (@user) deve clicar no botão (✅️) em até 5 minutos.",
      noUser: "Apenas (@user) pode interagir esse botão.",
      stop: "Transação feita! Você transferiu (@beans) Mini Feijoes para (@user)!"
    },
    "es-ES": {
      isAuthor:  "¡No puedes enviar Mini Frijoles a ti mismo!",
      noValue: "No tienes suficientes Mini Frijoles para realizar esta transacción.",
      start: "Estás a punto de transferir (beans) Mini Frijoles a (@user). \n\nPara transferir, (@user) debe hacer clic en el botón (✅️) dentro de 5 minutos.",
      noUser: "Solo (@user) puede interactuar con este botón.",
      stop: "¡Transacción completada! Has transferido (@beans) Mini Frijoles a (@user)!"
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
  },{
    name: "balance",
    description: "See how many Mini Beans you have or check other users' balance",
    type: 1,

    name_localizations: {
      "pt-BR": "saldo",
      "es-ES": "saldo"
    },

    description_localization: {
       "pt-BR": "Veja quantos mini feijões você tem ou de outro usuário",
       "es-ES": "Consulta cuántos Mini Frijoles tienes o verifica el saldo de otros usuarios"
    },

    options: [{
      name: "user",
      description: "Mention the user or enter their ID",
      type: 6,
      required: false,
      name_localizations: {
        "pt-BR": "usuário",
        "es-ES": "usuario"
      },
      description_localizations: {
        "pt-BR": "Mencione um usuário ou insira o ID",
        "es-ES": "Menciona al usuario o ingresa su ID"
      }    
    }]
  },{
    name: "pay",
    description: "Send Mini Beans to your friend",
    type: 1,
    name_localizations: {
      "pt-BR": "pagar",
      "es-ES": "pagar"
    },
    description_localizations: {
      "pt-BR": "Envie Mini Feijões para seu amigo",
      "es-ES": "Envía Mini Frijoles a tu amigo"
    },

    options: [{
      name: "user",
      description: "Mention the user or enter their ID",
      type: 6,
      required: true,
      name_localizations: {
        "pt-BR": "usuário",
        "es-ES": "usuario"
      },
      description_localizations: {
        "pt-BR": "Mencione um usuário ou insira o ID",
        "es-ES": "Menciona al usuario o ingresa su ID"
      }
    },{
      name: "amount",
      description: "Enter a number from 1 to the amount you want to send",
      type: 10,
      required: true,
      min_value: 1,
      name_localizations: {
        "pt-BR": "quantidade",
        "es-ES": "cantidad"
      },
      description_localizations: {
        "pt-BR": "Escreva o número de 1 a quantidade que você quer enviar",
        "es-ES": "Ingresa un número del 1 a la cantidad que deseas enviar"
      }
    }]
  }],

  run: async(client, interaction) => {

    let cmd = interaction.options.getSubcommand();

    if (cmd === "pay"){

      let user = interaction.options.getUser("user");
      let amount = interaction.options.getNumber("amount");

      let response = language.pay[interaction.locale] ? language.pay[interaction.locale] : {
        isAuthor:  "You cannot send Mini Beans to yourself!",
        noValue:  "You do not have enough Mini Beans to make this transaction.",
        start: "You are about to transfer (beans) Mini Beans to (@user). \n\nTo transfer, (@user) must click the (✅️) button within 5 minutes",
        noUser: "Only (@user) can interact with this button.",
        stop: "Transaction completed! You have transferred (@beans) Mini Beans to (@user)!"
      }
    
    if (interaction.user.id === user.id){
      await interaction.editReply({
        content: response.isAuthor
      })    
    } else {

      let userdb = await client.userdb.findOne({
        userId: user.id
      })

      if (!userdb){
        let newuser = new client.userdb({
          userId: user.id
        })

        await newuser.save();

        userdb = await client.userdb.findOne({
        userId: user.id
      })
        
      }

      let userdb1 = await client.userdb.findOne({
        userId: interaction.user.id
      })

      if (!userdb1){
        let newuser = new client.userdb({
          userId: interaction.user.id
        })

        await newuser.save();

        userdb1 = await client.userdb.findOne({
        userId: interaction.user.id
      })
        
      }


      if (amount > userdb1.economy.minibeans){
        await interaction.editReply({
          content: response.noValue
        })
      } else {

        let id = interaction.id;

        let button = new Discord.ButtonBuilder()
			.setCustomId('confirm_pay')
			.setLabel('✅️')
			.setStyle(Discord.ButtonStyle.Success);

        let row = new Discord.ActionRowBuilder()
        .addComponents(button);

        let msg = await interaction.editReply({
          content: response.start.replace("(beans)", formatarNumero(amount)).replace("(@user)", user).replace("(@user)", user),
          components: [row]
        })  
      
      const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, time: ms("5m") });

        let confirm = false;
        

collector.on('collect', async(i) => {
	if (i.customId === "confirm_pay"){

   // console.log(i.message)
    await i.deferUpdate();
    console.log(msg.id, i.message.id)

       if (msg.id !== i.message.id) return;
console.log("ok")
    if (i.user.id !== user.id){

      await i.followUp({
        content: response.noUser.replace("(@user)", user),
        ephemeral: true
      })      
    } else {

      userdb.economy.minibeans += amount;
      userdb1.economy.minibeans -= amount;

      await userdb.save();
      await userdb1.save();

      

      await i.editReply({
        content: response.stop.replace("(@beans)", formatarNumero(amount)).replace("(@user)", user),
        components: []
      })

      confirm = true;

      await client.channels.cache.get("1329806974002532352").send({
        content: `Author ID: ${interaction.user.id} || User ID: ${user.id}`,
        embeds: [new Discord.EmbedBuilder()
                .setTitle("Transação de Mini Feijoes")
                .setDescription(`${interaction.user.username} enviou ${amount} Mini Feijoes para ${user.username}`)
               .setColor("Orange")
               .setTimestamp()]
      })

      
      await collector.stop()
    }
    
  }
});

collector.on('end', async(collected) => {

  if (!confirm){
    button.setStyle(Discord.ButtonStyle.Danger);
    button.setDisabled(true);

    row = new Discord.ActionRowBuilder()
        .addComponents(button);

    await interaction.editReply({
      components: [row]
    })
  }
});
      
      
      
      
      
      
      }
    }
    } else if (cmd === "balance"){
       let isAuthor = false;
       let user = interaction.options.getUser("user") || interaction.user;
      if (user.id === interaction.user.id) isAuthor = true

      let userdb = await client.userdb.findOne({
        userId: user.id
      })

      if (!userdb){
        let newuser = new client.userdb({
          userId: user.id
        })

        await newuser.save();

        userdb = await client.userdb.findOne({
        userId: user.id
      })
        
      }

      const rankedUsers = await client.userdb.find({
              "economy.minibeans": { 
                $gt: 0 
              }
            })
                .sort({ 
                  "economy.minibeans": -1 
                })
                .exec();
    //console.log(db.userID)
            let userPosition = rankedUsers.findIndex(user => user.userId === userdb.userId) + 1;

            if (userdb.economy.minibeans === 0) {
           userPosition = rankedUsers.length + 1;
            }

      let response = language.saldo[interaction.locale] ? language.saldo[interaction.locale] : {
        isAuthor: "You have (beans) Mini Beans and are in position (position) on the leaderboard!",
       NoIsAuthor: "(@user) has (beans) Mini Beans and is in position (position) on the leaderboard!"
      }

      if (isAuthor){
        await interaction.editReply({
          content: response.isAuthor.replace("(beans)", formatarNumero(userdb.economy.minibeans)).replace("(position)", `#${userPosition}`)
        })
      } else {
        await interaction.editReply({
          content: response.NoIsAuthor.replace("(@user)", user).replace("(beans)", formatarNumero(userdb.economy.minibeans)).replace("(position)", `#${userPosition}`)
        })
      }
    } else if (cmd === "daily"){
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