const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const donationSchema = new Schema({
  image: String,
  food: String,
  quantity: Number,
  donatedAt: {
    type:Date,
    default: new Date()
  }
})

const donationHistorySchema = new Schema({
  image: String,
  food: String,
  quantity: Number,
  status: {
    type: String,
    enum: ["Pending","Processing","Delivered"],
    default: "Pending"
  },
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
