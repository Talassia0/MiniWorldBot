const client = require("../index");
const mongoose = require('mongoose');

client.on("ready", async() => {
  console.log(`${client.user.tag} is up and ready to go!`);
  

await mongoose.connect(process.env.MONGO).then(() => console.log("Mongodb conectado!"))
 
});