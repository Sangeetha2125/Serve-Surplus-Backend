const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const donationSchema = new Schema({
  food: String,
  quantity: Number,
  donatedAt: {
    type:Date,
    default: new Date()
  }
})

const donationHistorySchema = new Schema({
  food: String,
  quantity: Number,
  donatedAt: {
    type: Date,
    default: new Date()
  }
})
const donorSchema = new Schema({
  donations: [donationSchema],
  donationHistory: [donationHistorySchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

module.exports = mongoose.model("Donors",donorSchema);
