const { Schema, model } = require("mongoose");

module.exports = model('Usuários', new Schema({
  userId: { type: String },
  menta: { type: Number, default: 0 },
  menta_time: { type: Number, default: 0 },
  primogemas: { type: Number, default: 0 }
}));