const client = require("../index")
const Discord = require("discord.js");

let language = {
  "pt-BR": "**`(user)`** reagiu com o emoji (react) em (channel)!\n\nId do Usuário: (userId)"
}
client.on('messageReactionAdd', async(reaction, user) => {


  let serverdb = await client.serverdb.findOne({
    guildId: reaction.message.guildId
  })

  if (!serverdb){
    let newguild = new client.serverdb({
      guildId: reaction.message.guildId
    })

    await newguild.save()

    serverdb = await client.serverdb.findOne({
    guildId: reaction.message.guildId
  })
  }

  

 // console.log(reaction.message.guildId)

 console.log(serverdb.logs)

  if (serverdb.logs.reactionStatus){

    let guild = client.guilds.cache.get(reaction.message.guildId);

    let channel = guild.channels.cache.get(serverdb.logs.reaction);

    //console.log(user)

    if (!channel) return;

    let response = language[serverdb.language] ? language[serverdb.language] : "**`(user)`** reacted with the emoji (react) in (channel)!\n\nUser ID: (userId)"

    let embed = new Discord.EmbedBuilder()
    .setTitle("Reaction Logs")
    .setDescription(response.replace("(react)", reaction.emoji.name).replace("(user)", user.username).replace("(channel)", guild.channels.cache.get(reaction.message.channelId)).replace("(userId)", user.id))
    .setTimestamp()
    .setThumbnail(`${user.displayAvatarURL()}`)
    .setColor("Green")

    await channel.send({
      embeds: [embed]
    })
  }
});