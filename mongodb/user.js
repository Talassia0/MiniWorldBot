const { Schema, model } = require("mongoose");

module.exports = model('Usuários', new Schema({
  userId: { type: String },
  mentas: { type: Number, default: 0 },
  menta_time: { type: Number, default: 0 },
  primogemas: { type: Number, default: 0 },

  banners: {
    pity: { type: Number, default: 0 },
    pity_mochileiro: { type: Number, default: 0 },
    armas: { type: Array, default: [] },
    personagens: { type: Array, default: [] }
  }
}));