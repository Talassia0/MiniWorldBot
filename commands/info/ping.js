const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Retorna a Latência da Raiden",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],

  run: async (client, interaction) => {
    
    interaction.editReply({
      content: `Pong! ${client.ws.ping}ms`
    });
  },
};