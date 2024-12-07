module.exports = {
  name: "pity",
  description: "Veja seu pity atual",
  type: 1,
  run: async(client, interaction) => {
    let userdb = await client.userdb.findOne({
      userId: interaction.user.id
    })

    if (!userdb){
      let newUser = new client.userdb({
        userId: interaction.user.id      })

      await newUser.save();
      userdb = await client.userdb.findOne({
      userId: interaction.user.id
    })
    }

    await interaction.editReply({
      content: `Seu Pity atual é  ${userdb.banners.pity}!`
    })
  }
}