const clusters = require("../../cluster-names.js")

const { ClusterClient, getInfo } = require('discord-hybrid-sharding');

let language = {
     "pt-BR": {
       info: {
       embed_title: "Minhas Informações",
       embed_description: "Meu nome é (botName), e sou um bot totalmente inspirado no jogo Mini World: CREATA!\n\nSou um bot de: Economia e Informação para o seu servidor. Minha moeda se chama 'Mini Beans', que é uma das moedas do jogo.\nFui desenvolvido por ThallesKraft e estou hospedado na SquareCloud.\nAtualmente, estou em `(guilds)` servidores"
       }
     },

    "es-ES": {
      info: {
        embed_description: "Mi nombre es (botName), y soy un bot completamente inspirado en el juego Mini World: CREATA!\nSoy un bot de: Economía e Información para tu servidor. Mi moneda se llama 'Mini Beans', que es una de las monedas del juego.\nFui desarrollado por ThallesKraft y estoy alojado en SquareCloud.\n\nActualmente, estoy en `(guilds)` servidores", 
      embed_title: "Mis informaciones" 
    }
    }
  }


module.exports = {
    name: "bot",
    description: "Comandos relacionados ao BOT",
    type: 1,
    options: [{
      name: "info",
      description: "See my current information",
      description_localizations: {
        "pt-BR": "Veja minhas informações atuais",
        "es-ES": "Mira mi información actual"
      },
      type: 1
    },{
      name: "ping",
      description: "See current latency",
      description_localizations: {
        "pt-BR": "Veja minha latência atual",
        "es-ES": "Ver estado actual del bot"
      },
      type: 1
    }],
  run: async function(client, interaction){

    let subCmd = interaction.options.getSubcommand();

  //if (true) return await interaction.reply("teste!")
    if (subCmd === "ping"){

      let ping = client.ws.ping;
      let apiping = Date.now() - interaction.createdTimestamp;

      let cluster = clusters[client.cluster.id];
      let shard = interaction.guild.shardId;

      await interaction.editReply({
        content: `🏓 Pong! (Cluster [${client.cluster.id}] - \`${cluster}\`) (Shard ${getInfo().TOTAL_SHARDS}/${shard})\n⏰ Gateway Ping: **\`${client.ws.ping}ms\`**\n⌛ Api Ping: **\`${apiping}ms\`**`
      })
    }

   if (subCmd === "info"){

      

     //    console.log(client);
        /** 
        My name is ${client.name}, and I am a bot fully inspired by the game **Mini World: CREATA**!\nI am a bot for: **Economy** and **Information** for your server. My currency is called "Mini Beans," which is one of the in-game currencies.\n\nI was developed by **ThallesKraft** and hosted on **SquareCloud**.\n\nCurrently, I am in **\`${client.approximate_guild_count}\`** servers.*/
//console.log(interaction.locale)
        let data = {
  embeds: [{
    title: `${language[interaction.locale] ? language[interaction.locale]["info"].embed_title : "My Information"}`,
    description: `${language[interaction.locale] ? language[interaction.locale]["info"].embed_description.replace("(botName)", client.user.username).replace("(guilds)", client.guilds.cache.size) : `My name is ${client.user.username}, and I am a bot fully inspired by the game **Mini World: CREATA**!\nI am a bot for: **Economy** and **Information** for your server. My currency is called "Mini Beans," which is one of the in-game currencies.\n\nI was developed by **ThallesKraft** and hosted on **SquareCloud**.\n\nCurrently, I am in **\`${client.guilds.cache.size}\`** servers.`}`,
    thumbnail: {
      url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png?size=2048`
    },
    color: 255
  }],
  components: [{
    type: 1,
    components: [{
      label: "Add",
      style: 5,
      url: `https://discord.com/api/oauth2/authorize?client_id=1180550435464020028&permissions=2339214585024&scope=bot+applications.commands`,
      type: 2
    }, {
      label: "GitHub",
      style: 5,
      url: `https://github.com/Talassia0/MiniWorldBot/tree/main`,
      type: 2
    }]
  }]
        }

        await interaction.editReply({
          content: `${interaction.user}`,
          embeds: data.embeds,
          components: data.components
        })
      
        
        
      
    }
  }
}