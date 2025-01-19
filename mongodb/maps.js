const { Schema, model } = require("mongoose");

module.exports = model('Mapas', new Schema({
  id: { type: String },
  images: { type: Array, default: [] },
  uid: { type: String },
  description: { type: String },
  title: { type: String },
  updates: { type: String, default: "no" },
  dono: { type: String }
}));