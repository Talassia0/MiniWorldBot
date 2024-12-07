const { AttachmentBuilder, ActionRowBuilder,  ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require("discord.js")
const ms = require("ms");
module.exports = {
  name: "banners",
  description: "Veja os banners de personagens limitados atualmente",
  type: 1,

  run: async(client, interaction) => {
    let limitado = new AttachmentBuilder("img/banners/atual.png");

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
    
  let msg = await interaction.editReply({
      files: [limitado],
      components: [new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
	.setCustomId('1giro')
	.setLabel('1')
	.setStyle(ButtonStyle.Secondary)
	.setEmoji('1314991347664687176'),
                    new ButtonBuilder()
	.setCustomId('10giro')
	.setLabel('10')
	.setStyle(ButtonStyle.Secondary)
	.setEmoji('1314991347664687176'),
                  )]
    })

    const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: ms("5m") });

    collector.on('collect', async(i) => {
  
	if (i.message.id !== msg.id) return;

  if (i.user.id !== interaction.user.id){
    return await i.reply({
      content: `Apenas o(a) ${interaction.user} pode utilizar esses botões!`,
      ephemeral: true
    })
  } else {

    if (i.customId === "1giro"){
      await i.deferUpdate();

      // Variáveis iniciais
let garantido = false; // Flag de garantido
let NOME = null; // Variável para armazenar o nome do personagem, se sorteado

const bannerAtual = {
  "5estrelas": "Venti", // Nome do personagem 5 estrelas
  "4estrelas": ["Xiangling", "Bárbara", "Fischl"], // Personagens 4 estrelas
  "armas3estrelas": [
    "Espada Comum", "Lança Simples", "Arco Básico", "Espada Rústica", "Lança de Ferro", 
    "Arco de Madeira", "Espada Longa", "Lança de Aço", "Arco Curvo", "Espada de Prata"
  ] // Armas 3 estrelas (10 itens)
};

// Função principal para o giro
async function giro() {
  const resultados = [];
  let sorteado = null;

  // Verifica o valor atual de pity de userdb
  let pity = userdb.banners.pity;

  // Verifica as chances de 5 estrelas com base no pity
  if (garantido || pity === 90 || (pity >= 70 && Math.random() <= 0.4) || (pity < 70 && Math.random() <= 0.02)) {
    // Sorteia um 5 estrelas, pode ser personagem ou arma
    if (Math.random() < 0.5) {
      // 50% chance de vir personagem 5 estrelas
      sorteado = bannerAtual["5estrelas"];
    } else {
      // 50% chance de vir arma 5 estrelas (se houvesse)
      sorteado = bannerAtual["armas3estrelas"][Math.floor(Math.random() * bannerAtual["armas3estrelas"].length)];
    }
    garantido = true;
    userdb.banners.pity = 0; // Reseta o pity caso 5 estrelas
  } else {
    // Se não, sorteia um personagem ou arma 4 ou 3 estrelas
    const tipoSorteio = Math.random();
    if (tipoSorteio < 0.33) {
      // 33% chance de vir personagem 4 estrelas
      sorteado = bannerAtual["4estrelas"][Math.floor(Math.random() * bannerAtual["4estrelas"].length)];
    } else {
      // 67% chance de vir arma 3 estrelas
      sorteado = bannerAtual["armas3estrelas"][Math.floor(Math.random() * bannerAtual["armas3estrelas"].length)];
    }
    userdb.banners.pity++; // Incrementa o pity após o sorteio
  }

  // Se o item sorteado for um personagem, salva o nome na variável NOME
  if (bannerAtual["4estrelas"].includes(sorteado) || bannerAtual["5estrelas"] === sorteado) {
    NOME = sorteado; // Armazena o nome do personagem
  } else {
    NOME = null; // Se não for um personagem, o nome é null
  }

  // Adiciona o item sorteado ao resultado
  resultados.push(sorteado);

  // Definindo a animação com base no tipo de item
  let animacao;
  if (bannerAtual["5estrelas"] === sorteado || bannerAtual["armas3estrelas"].includes(sorteado)) {
    animacao = sorteado === bannerAtual["5estrelas"] ? 5 : 3; // 5 para 5 estrelas, 3 para armas 3 estrelas
  } else {
    animacao = 4; // Caso seja um 4 estrelas
  }

  // Exibição de resultados
  console.log(`Resultado do Giro: ${sorteado}`);
  console.log(`Pity Atual: ${userdb.banners.pity}`);
  console.log(`Animação: ${animacao}`);
  console.log("Itens: ", resultados);
  console.log("Nome do Personagem Sorteado: ", NOME); // Exibe o nome do personagem ou null

  
   
     if (animacao === 3){
       let embed = new EmbedBuilder().setDescription(`${sorteado}`).setColor("Green")
       
        let gif = new AttachmentBuilder("img/banners/t3-1giro.gif");

        await i.editReply({
          files: [gif],
          components: []
        })

        setTimeout(async() => {
          await i.editReply({
           files: [],
           embeds: [embed]
          })        }, 5000)
     } else {
        let file = new AttachmentBuilder(`img/personagens/${NOME}.png`)
     
      let embed = new EmbedBuilder().setDescription(`${sorteado}`).setColor("Green").setImage(`attachment://${NOME}.png`)
  
 if (animacao === 4){
        let gif = new AttachmentBuilder("img/banners/t4-1giro.gif");

        await i.editReply({
          files: [gif],
          components: []
        })

        setTimeout(async() => {
          await i.editReply({
           files: [file],
           embeds: [embed]
          })        }, 5000)
      } else if (animacao === 5) {
        let gif = new AttachmentBuilder("img/banners/t5-1giro.gif");

        await i.editReply({
          files: [gif],
          components: []
        })  

        setTimeout(async() => {
          await i.editReply({
           files: [file],
          embeds: [embed]
          })        }, 5000)
      }
     
   }
}

// Simulando o giro
giro();


    }

    if (i.customId === "10giro"){
      await i.deferUpdate();

    //  if (userdb.primogemas < 1600) return i.followUp({
   //     content: "Você não tem 1600 primogemas!",
     //   ephemeral: true
  //    })

                      let ultimoPersonagem = null; // Variável para o último personagem de maior raridade
let listaFormatada = ""; // Lista final formatada
let count4Estrelas = 0; // Contador para garantir o máximo de 2 4 estrelas a cada 10 giros
let animacao = 4; // Variável para o valor de animação

const bannerAtual = {
  "5estrelas": "Venti",
  "4estrelas": ["Xiangling", "Bárbara", "Fischl"],
  "armas3estrelas": [
    "Espada do Viajante",
    "Arco do Corvo",
    "Lança de Ferro",
    "Livro de Contos",
    "Grande Espada de Aço"
  ]
};

// Função para rodar o sistema de giros
function fazerGiros(giros = 10) {
  const resultados = [];
  count4Estrelas = 0; // Resetando o contador de 4 estrelas a cada 10 giros
  let veio5Estrela = false; // Flag para verificar se veio 5 estrelas

  for (let i = 0; i < giros; i++) {
    userdb.banners.pity++; // Usando userdb.banners.pity

    const resultado = calcularResultado();
    resultados.push(resultado);

    // Atualiza o pity corretamente após 5 estrelas
    if (resultado.some(item => item === bannerAtual["5estrelas"])) {
      userdb.banners.pity = 0; // Reseta o pity quando vem um 5 estrelas
      veio5Estrela = true; // Marca que veio 5 estrelas
      userdb.banners.garantido = false; // Reseta o garantido
    }
  }

  // Atualiza a variável animação com base no sorteio de 5 estrelas
  animacao = veio5Estrela ? 5 : 4;

  // Se não veio 5 estrelas, destaca o último 4 estrelas
  if (!veio5Estrela && ultimoPersonagem) {
    salvarUltimoPersonagem(ultimoPersonagem.nome, ultimoPersonagem.raridade);
  }

  // Organiza os resultados e determina o último personagem de maior raridade
  organizarResultados(resultados);

  return resultados;
}

// Função para calcular o resultado de um giro
function calcularResultado() {
  const chance = Math.random() * 100;
  
  // Definindo as chances de 5 estrelas de acordo com o pity
  let chance5Estrelas;

  if (userdb.banners.pity >= 90) {
    // 100% de chance no pity 90
    chance5Estrelas = 100;
  } else if (userdb.banners.pity > 70) {
    // 40% de chance acima do pity 70
    chance5Estrelas = 40;
  } else {
    // 2% de chance abaixo do pity 70
    chance5Estrelas = 2;
  }

  // Se for garantido, 5 estrelas é certo
  if (userdb.banners.garantido || chance < chance5Estrelas) {
    salvarUltimoPersonagem(bannerAtual["5estrelas"], 5);
    return [bannerAtual["5estrelas"], sortear4Estrelas()];
  }

  // Se não for 5 estrelas, sorteia 4 estrelas ou 3 estrelas
  const resultado = sortear4EstrelasOu3Estrelas();
  return resultado;
}

// Função para salvar o último personagem baseado na maior raridade
function salvarUltimoPersonagem(nome, raridade) {
  if (raridade === 5) {
    ultimoPersonagem = { nome, raridade: 5 };
  } else if (raridade === 4 && (!ultimoPersonagem || ultimoPersonagem.raridade < 4)) {
    ultimoPersonagem = { nome, raridade: 4 };
  }
}

// Função para sortear personagens de 4 estrelas (com limite de 2 por 10 giros)
function sortear4Estrelas() {
  if (count4Estrelas < 2) {
    count4Estrelas++; // Incrementa o contador de 4 estrelas
    const personagem4Estrelas = bannerAtual["4estrelas"];
    const sorteado = personagem4Estrelas[Math.floor(Math.random() * personagem4Estrelas.length)];
    salvarUltimoPersonagem(sorteado, 4); // Atualiza o último 4 estrelas
    return sorteado;
  } else {
    // Caso já tenha sorteado 2 4 estrelas, sorteia uma 3 estrelas
    return sortear4EstrelasOu3Estrelas()[0]; // Retorna 3 estrelas
  }
}

// Função para sortear personagens de 4 estrelas ou 3 estrelas
function sortear4EstrelasOu3Estrelas() {
  const chance = Math.random() * 100;

  if (chance < 50) {
    // 50% de chance de ser 4 estrelas
    return [sortear4Estrelas()];
  } else {
    // 50% de chance de ser 3 estrelas
    const armas3Estrelas = bannerAtual["armas3estrelas"];
    return [armas3Estrelas[Math.floor(Math.random() * armas3Estrelas.length)]];
  }
}

// Função para organizar os resultados em uma string formatada
function organizarResultados(resultados) {
  listaFormatada = resultados
    .map((resultado) =>
      resultado
        .map((item) => {
          if (item === bannerAtual["5estrelas"]) {
            return `${item} ⭐️⭐️⭐️⭐️⭐️`;
          } else if (bannerAtual["4estrelas"].includes(item)) {
            return `${item} ⭐️⭐️⭐️⭐️`;
          } else {
            return `${item} ⭐️⭐️⭐️`;
          }
        })
        .join("\n")
    )
    .join("\n");
}

// Testando o sistema de giros
const resultados = fazerGiros();
/*console.log("Resultados dos 10 giros:", resultados);
console.log("Pity após os giros:", userdb.banners.pity);
console.log("Último personagem (maior raridade):", ultimoPersonagem ? ultimoPersonagem.nome : "Nenhum");
console.log("Valor da variável animação:", animacao);
console.log("\nLista formatada de resultados:");
console.log(listaFormatada);*/

      let file = new AttachmentBuilder(`img/personagens/${ultimoPersonagem.nome}.png`)
      let embed = new EmbedBuilder().setDescription(`${listaFormatada}`).setColor("Green").setImage(`attachment://${ultimoPersonagem.nome}.png`)
  

      if (animacao === 4){
        let gif = new AttachmentBuilder("img/banners/t4-10giros.gif");

        await i.editReply({
          files: [gif],
          components: []
        })

        setTimeout(async() => {
          await i.editReply({
           files: [file],
           embeds: [embed]
          })        }, 5000)
      } else {
        let gif = new AttachmentBuilder("img/banners/t5-10giros.gif");

        await i.editReply({
          files: [gif],
          components: []
        })  

        setTimeout(async() => {
          await i.editReply({
           files: [file],
          embeds: [embed]
          })        }, 5000)
      }
userdb.primogemas =- 1600;

      // Função para adicionar ou atualizar o personagem na base de dados (userdb.banners.personagens)
function adicionarOuAtualizarPersonagem(item) {
  const personagemNome = item.nome; // Nome do personagem
  const personagemRaridade = item.raridade; // Raridade do personagem
  
  // Verificar se o personagem já existe no banco de dados
  const personagemExistente = userdb.banners.personagens.find(p => p.nome === personagemNome);

  if (personagemExistente) {
    // Se o personagem já existe, incrementar a constelação
    personagemExistente.constelacao++;
  } else {
    // Se o personagem não existir, adicionar com constelação 1
    userdb.banners.personagens.push({
      nome: personagemNome,
      raridade: personagemRaridade,
      constelacao: 1, // Inicia com constelação 1
      level: 1,
      levelMax: 20,
      nivelDeAcessao: 1
    });
  }
}

// Criando a variável itens para armazenar os itens sorteados
let itens = [];

// Extraindo os itens de resultados
resultados.forEach(resultado => {
  resultado.forEach(item => {
    // Para personagens 5 e 4 estrelas, cria o objeto com as informações
    if (bannerAtual["5estrelas"] === item || bannerAtual["4estrelas"].includes(item)) {
      // Verificar se o personagem já existe, caso contrário, adicionar ou atualizar
      adicionarOuAtualizarPersonagem({
        nome: item,
        raridade: bannerAtual["5estrelas"] === item ? 5 : 4
      });

      // Adiciona o personagem ao array 'itens' no formato desejado
      itens.push({
        [item]: {
          level: 1,
          levelMax: 20,
          nivelDeAcessao: 1,
          raridade: bannerAtual["5estrelas"] === item ? 5 : 4,
          constelacao: 1 // Inicia com constelação 1
        }
      });
    } else {
      // Para itens 3 estrelas (armas, por exemplo), apenas adiciona o nome
      itens.push(item);
    }
  });
});

console.log(itens); // Para conferir o formato
userdb.banners.personagens.push(itens)
      
await userdb.save();
    }}
    })
}}