const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const receiverSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

module.exports = mongoose.model("Receivers",receiverSchema);
