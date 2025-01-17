const Discord = require("discord.js");

module.exports = {
  name: "servers",
  description: "View the list of official Mini World servers here on Discord",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],

  name_localizations: {
    "pt-BR": "servidores",
    "es-ES": "servidores"
  }, 

  description_localizations: {
    "es-ES": "Ver la lista de servidores oficiales de Mini World aquí en Discord",
    "pt-BR": "Veja a lista de servidores oficiais de MiniWorld aqui no Discord"
  },

  run: async(client, interaction) => {

    let embed = new Discord.EmbedBuilder()
    .setTitle("Mini World Servers")
    .setDescription(`**Mini World Creata**\nhttps://discord.gg/VXn6ZErz5a\n\n**Mini World Creata Português**\nhttps://discord.gg/fZM8cVRm2z\n\n**Mini World Creata Español**\nhttps://discord.com/invite/PvFUcfU6Ev`)
    .setColor("Random")

    await interaction.editReply({
      content: `${interaction.user}`,
      embeds: [embed]
    })
  }
}