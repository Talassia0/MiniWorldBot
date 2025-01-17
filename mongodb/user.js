const { Schema, model } = require("mongoose");

module.exports = model('Usuários', new Schema({
  userId: { type: String },
  uid: { type: String, default: "no" },

  mapas: {
    limite: { type: Number, default: 3 },
    lista: { type: Array, default: [] }
  },
  economy: {
    cooldown: { type: Number, default: 0 },
    minibeans: { type: Number, default: 0 }
  }
  
}));