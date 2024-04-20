const mongoose = require("mongoose");

const orderDetailsSchema = new Schema({
  food: String,
  quantity: Number,
  date: {
    type: Date,
    default: new Date()
  }
})
const ordersSchema = new Schema({
  donor_id:{
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  receiver_id: {
    type:mongoose.Schema.Types.ObjectId,
    required: true
  },
  orders: [orderDetailsSchema]
})


module.exports = mongoose.model('Orders',ordersSchema)