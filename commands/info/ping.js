module.exports = {
  name: "ping",
  description: "Check my current Latency",
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  run: async(client, interaction) => {

    await interaction.editReply({
      content: `🏓 Pong! **${client.ws.ping}ms**`
    })
  }
}