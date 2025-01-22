const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
registerFont('src/fonts/oswald.ttf', {
  family: 'Oswald'
})
const { AttachmentBuilder } = require("discord.js");
const Discord = require("discord.js");

let language = {
  ver: {
      "pt-BR": {
        beans: "(beans)",
        sobremim: "Sobremim:",
        no: "Nenhum sobremim inserido.",
        mapas: "Lista de mapas",
        update: "Últimas Atualizações"
      }
  }
}
  module.exports = {
    name: "profile",
    description: "Grupo de comandos relacionadosa perfil",
    name_localizations: {
      "pt-BR": "perfil",
      "es-ES": "perfil"
    },
    type: 1,
    integration_types: [0, 1],
    contexts: [0, 1, 2],
    options: [{
      name: "view",
      description: "View your profile or another user's",
      type: 1,

      name_localizations: {
        "pt-BR": "ver",
        "es-ES": "ver"
      },
      description_localizations: {
        "pt-BR": "Veja o seu perfil ou de outro usuário",
         "es-ES": "Vea su perfil o el de otro usuario"
      },

      options: [{
      name: "user",
      description: "Mention the user or enter their ID",
      type: 6,
      required: false,
      name_localizations: {
        "pt-BR": "usuário",
        "es-ES": "usuario"
      },
      description_localizations: {
        "pt-BR": "Mencione um usuário ou insira o ID",
        "es-ES": "Menciona al usuario o ingresa su ID"
      }    
    }]
    }],
    run: async(client, interaction) => {

      if (interaction.options.getSubcommand() === "view"){
let user = interaction.options.getUser("user") || interaction.user;
        let userdb = await client.userdb.findOne({
        userId: user.id
      })

      if (!userdb){
        let newuser = new client.userdb({
          userId: user.id
        })

        await newuser.save();

        userdb = await client.userdb.findOne({
        userId: user.id
      })
        
      }

        let response = language.ver[interaction.locale] ? language.ver[interaction.locale] :  {
    "beans": "(beans)",
    "sobremim": "About Me:",
          no: "No about me inserted.",
          mapas: "List of maps",  
update: "Latest Updates"

        }

        let s;
        if (userdb.perfil.sobremim === "0"){
          s = response.no;
        } else {
          s = userdb.perfil.sobremim;
        }
  

        let data = {
  userAvatar: `${user.displayAvatarURL().replace("webp", "png")}`,
  uid: userdb.uid,
  userName: user.globalName,
  minifeijoes: response.beans.replace("(beans)", userdb.economy.minibeans),
  sobremim: s,

  lingua: {
    sobremim: response.sobremim
  }
        }

let sobremim = adicionarQuebrasDeLinha(data.sobremim, 60)

const canvas = createCanvas(1280, 720);
const context = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

loadImage(`src/img/${userdb.perfil.banner}`).then((background) => {
  
  context.drawImage(background, 0, 0, width, height);

  loadImage(data.userAvatar).then(async(avatar) => {

    const avatarX = 70;
    const avatarY = 145;

    const avatarSize = 280;

    context.save();
    context.beginPath();
    context.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
    context.closePath();
    context.clip();
    
    context.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    
    context.restore(); 

    context.font = '75px Oswald'; 
    context.fillStyle = 'white'; 
    context.fillText(data.userName, 370, 440);

    context.font = '45px Oswald'; 
    context.fillStyle = 'white'; 
    context.fillText(data.minifeijoes, 145, 560);

    context.font = '40px Oswald'; 
    context.fillStyle = 'white'; 
    context.fillText(data.lingua.sobremim, 10, 645);

    context.font = '40px Oswald'; 
    context.fillStyle = 'white'; 
    context.fillText(sobremim, 10, 700);
    
    
    context.font = '55px Oswald'; 
    context.fillStyle = 'white'; 
    context.fillText("UID: " + data.uid, 930, 120);

    
    
 let file = new AttachmentBuilder(await canvas.toBuffer(), { name: 'profile-image.png' });


    if (userdb.mapas.quantidade === 0){
    await interaction.editReply({
      files: [file],
      content: `${interaction.user}`
     })
    } else {

        let mapas = userdb.mapas.lista;
        let menuOptions = [];

    for (const mapa of mapas) {
      try {
        let i = await client.mapas.findOne({
           id: `${mapa}`,
           uid: `${userdb.uid}`,
           dono: `${user.id}`
        });
        if (i) {
            menuOptions.push({
            label: `${i.title}`,
            description: `ID: ${mapa}`,
            value: `${mapa}`
       });
     }
   } catch (error) {
     console.error(`Erro ao buscar mapa com ID ${mapa}:`, error);
   }
}


        let menu = new Discord.ActionRowBuilder()
        .addComponents(new Discord.StringSelectMenuBuilder()
			.setCustomId('mapasView')
			.setPlaceholder(`${response.mapas}`)
      .addOptions(menuOptions)
		)
      
      let msg = await interaction.editReply({
        files: [file],
        content: `${interaction.user}`,
        components: [menu]
     })

      const collector = msg.createMessageComponentCollector({ componentType: Discord.ComponentType.StringSelect });

      
      collector.on('collect', async(i) => {
  if (i.customId === "mapasView"){
  await i.deferUpdate();
    if (msg.id !== i.message.id) return;
    if (i.user.id !== interaction.user.id){

      await i.followUp({
        content: response.noUser.replace("(@user)", interaction.user),
        ephemeral: true
      })      
    } else {

      let mapaAtual = await client.mapas.findOne({
        id: `${i.values[0]}`,
        uid: `${userdb.uid}`,
        dono: `${interaction.user.id}`
      })

      let embed = new Discord.EmbedBuilder()
      .setTitle(`${mapaAtual.title}`)
      .setDescription(`${mapaAtual.description}`)
      .addFields({
        name: `Uid:`,
        value: `${mapaAtual.uid}`
      })
      .setFooter({ text: `MapaID: ${mapaAtual.id}`})
      .setColor("Blue")
      .setTimestamp()
      .setThumbnail(`${interaction.user.displayAvatarURL()}`)

      if (mapaAtual.updates !== "no") embed.addFields({
        name: `${response.update}`,
        value: `${mapaAtual.updates}`
      })

       await i.followUp({
         embeds: [embed],
         ephemeral: true
       })
    }
  }
      })
    }
    })
})
  }
                                                 }
  }

// Função para adicionar quebras de linha a cada 60 palavras
function adicionarQuebrasDeLinha(texto, palavrasPorLinha) {
  const palavras = texto.split(/\s+/); // Divide o texto em palavras
  let resultado = '';

  for (let i = 0; i < palavras.length; i++) {
    resultado += palavras[i] + ' ';

    // Adiciona uma quebra de linha a cada 60 palavras
    if ((i + 1) % palavrasPorLinha === 0 && i !== 0) {
      resultado += '\n';
    }
  }

  return resultado;

  
}
