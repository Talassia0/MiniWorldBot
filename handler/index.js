const client = require("../index");
const { Collection } = require("discord.js")
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs")
const path = require("path");
const token = process.env.TOKEN;

const slashCommandsLoader = []

const slashCommandFolders = fs.readdirSync('./commands');
for (const folder of slashCommandFolders) {
    const folderPath = path.join('./commands', folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const props = require("../" + filePath);

        client.slashCommands.set(props.name, props);
        slashCommandsLoader.push(props);
        console.log(`➤ Slash | ${props.name}/${folder} Command Loadded!`)

    }
}


const rest = new REST({ version: "10" }).setToken(token);
(async () => {
    try {
        await rest.put(Routes.applicationCommands("1180550435464020028"), {
            body: await slashCommandsLoader,
        });
        console.log("Successfully loadded application [/] commands.");
    } catch (e) {
        console.log("Failed to load application [/] commands. " + e);
    }
})();