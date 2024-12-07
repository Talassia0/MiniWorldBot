const tempo = require("ms");

module.exports = {
  name: "menta",
  description: "Grupo de comandos",
  type: 1,
  options: [{
    name: "diária",
    description: "Resgate suas Mentas diárias!",
    type: 1
  }],

  run: async(client, interaction) => {

    if (interaction.options.getSubcommand() === "diária"){

      let userdb = await client.userdb.findOne({
        userId: interaction.user.id
      })

      if (!userdb){
        let newUser = new client.userdb({ userId: interaction.user.id })

        await newUser.save();

        userdb = await client.userdb.findOne({
        userId: interaction.user.id
      })
      }

      let mentas = Math.floor(Math.random() * (200 - 50 + 1)) + 50;

      let primogemas = Math.floor(Math.random() * (10 - 5 + 1)) + 2;

      
if(Date.now() < userdb.menta_time){
      const calc = userdb.menta_time - Date.now()

        let t = Math.floor(userdb.menta_time / 1000);

        await interaction.editReply({
          content: `Você só pode resgatar mentas <t:${t}:R>!`
        })

      } else {

  userdb.mentas += mentas;
  userdb.menta_time += Date.now() + tempo("1h");
  userdb.primogemas += primogemas;

  await userdb.save()

  await interaction.editReply({
    content: `Você resgatou **<:menta:1314960420443914354> ${mentas} mentas** e **<:primogemas:1314967521689862294> ${primogemas} primogemas** hoje!`
  })
}
    }
  }
}