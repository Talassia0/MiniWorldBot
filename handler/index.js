const client = require("../MiniWorldBOT.js");
const { Collection } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");
const path = require("path");
const token = process.env.TOKEN;
const c = require("colors")

if (!client.slashCommands) {
    client.slashCommands = new Collection();
}

const slashCommandsLoader = [];

const slashCommandFolders = fs.readdirSync('./commands');
for (const folder of slashCommandFolders) {
    const folderPath = path.join('./commands', folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const props = require(path.resolve(filePath));

        client.slashCommands.set(props.name, props);
        slashCommandsLoader.push(props);
        console.log(c.green(`➤ Slash | ${props.name}/${folder} Command Loaded!`));
    }
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        await rest.put(Routes.applicationCommands("1180550435464020028"), {
            body: slashCommandsLoader,
        });
        console.log(c.cyan("Successfully loaded application [/] commands."))
    } catch (e) {
        console.error("Failed to load application [/] commands.", e);
    }
})();
