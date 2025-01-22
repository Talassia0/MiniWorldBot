const client = require("../MiniWorldBOT");
const mongoose = require('mongoose');
const { ActivityType } = require("discord.js");
const c = require("colors")
client.on("ready", async() => {
  console.log(c.blue(`${client.user.tag} is up and ready to go!`));
  

await mongoose.connect(process.env.MONGO).then(() => console.log(c.red("Mongodb conectado!")))

  client.user.setActivity('Versão de Teste liberada!', { type: ActivityType.Playing });

  client.user.setStatus('dnd')
 
});