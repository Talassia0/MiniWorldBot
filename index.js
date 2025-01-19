require("dotenv").config();
const { Client, Collection, Partials, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
            partials: [Object.keys(Partials)],
           
});
module.exports = client;
console.log("ok")
// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.userdb = require("./mongodb/user.js");
client.mapas = require("./mongodb/maps.js");
client.serverdb = require("./mongodb/guild.js");
// Initializing the project
require("./handler/index.js");

const fs = require("fs");
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  require("./events/"+file);
}

client.login(process.env.TOKEN);