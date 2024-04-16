const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const receiverSchema = new Schema({
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

receiverSchema.statics.validate = function(receiver) {
  console.log(receiver)
  if(!receiver.name || !receiver.phone || !receiver.doorNumber || !receiver.street || !receiver.area || 
     !receiver.area || !receiver.city || !receiver.pincode)
     throw Error("All the fields must be filled!");    
}

module.exports = mongoose.model("Receivers",receiverSchema);
