const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderDetailsSchema = new Schema({
  image: String,
  food: String,
  quantity: Number,
  secret: String,
  status: {
    type: String,
    enum: ["Processing", "Delivered"],
    default: "Processing"
  },
  date: {
    type: Date,
    default: new Date()
  }
});

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