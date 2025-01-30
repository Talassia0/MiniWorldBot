const client = require("../MiniWorldBOT.js");
const Discord = require("discord.js");

let prefix = "mw!";
let staff = [
  "890320875142930462" // Talassia
];

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!staff.includes(message.author.id)) return;

  if (message.content.startsWith(prefix)) {
    let command = message.content.toLowerCase().split(" ")[0].slice(prefix.length);
    let args = message.content.split(" ").slice(1);

    if (command === "blacklist") {
      let option = args[0];
      let user = client.users.cache.get(args[1]);

      if (!user) {
        return message.reply({ content: "Usuário não encontrado!" });
      }

      let userdb = await client.userdb.findOne({ userId: user.id });

      if (!userdb) {
        let newuser = new client.userdb({ userId: user.id });
        await newuser.save();
        userdb = await client.userdb.findOne({ userId: user.id });
      }

      if (option === "add") {
        let reset = args[2];
        let motivo = args.slice(3).join(" ") || "Motivo não informado.";

        await message.reply({
          content: `O usuário **${user.username}** \`(${user.id})\` foi bloqueado de usar os comandos!`
        });

        if (reset === "sim") {
          await client.userdb.deleteOne({ userId: user.id });

          let newuser = new client.userdb({
            userId: user.id,
            ban: true,
            motivo: motivo
          });

          await newuser.save();
        } else if (reset === "no") {
          userdb.ban = true;
          userdb.motivo = motivo;
          await userdb.save();
        }
      } else if (option === "remove") {
        await message.reply({
          content: `O usuário **${user.username}** \`(${user.id})\` agora pode usar novamente os comandos!`
        });

        userdb.ban = false;
        userdb.motivo = "?";
        await userdb.save();
      }
    }
  }
});
