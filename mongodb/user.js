const { Schema, model } = require("mongoose");

module.exports = model('Usuários', new Schema({
  userId: { type: String },
  uid: { type: String, default: "no" },
  ban: { type: Boolean, default: false },

  perfil: {
    sobremim: { type: String, default: "0" },
    tags: { type: Array, default: [] },
    conquistas: { type: Array, default: [] },
    banner: { type: String, default: "profile.png"}
  },

  mapas: {
    limite: { type: Number, default: 3 },
    quantidade: { type: Number, default: 0 },
    lista: { type: Array, default: [] }
  },
  economy: {
    cooldown: { type: Number, default: 0 },
    minibeans: { type: Number, default: 0 },

    rpg: {
      level: {
        xpAtual: { type: Number, default: 0 },
        xpRestante: { type: Number, default: 1000 },
        level: { type: Number, default: 0 }
      }
    }
  }
  
}));