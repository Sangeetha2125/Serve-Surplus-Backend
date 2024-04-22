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
    type:Date,
    default: new Date()
  }
})
const donorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  doorNumber: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  donations: [donationSchema],
  donationHistory: [donationHistorySchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

donorSchema.statics.validate = function(donor) {
  if(!donor.name || !donor.phone || !donor.doorNumber || !donor.street || !donor.area || 
     !donor.area || !donor.city || !donor.pincode)
     throw Error("All the fields must be filled!");
     
}
module.exports = mongoose.model("Donors",donorSchema);
