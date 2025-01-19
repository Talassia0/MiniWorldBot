const { Schema, model } = require("mongoose");

module.exports = model('Servidores', new Schema({
  guildId: { type: String },
  language: { type: String },

  logs: {
    reaction: { type: String, default: "no" },
    reactionStatus: { type: Boolean, default: false }
  }
}));