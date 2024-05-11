const Donors = require("../models/donorModel");
const Orders = require("../models/ordersModel");
const Receivers = require("../models/receiverModel");
const Users = require("../models/userModel");
const getDistance = require("../utils/calculateDistance");
const order = async (req,res)=>{
  const {orders} = req.body;
  try {
    const {id} = req.params;
    const donor = await Donors.findOne({_id:id});
    const receiver = await Receivers.findOne({userId:req.user})
    orders.forEach((order)=>{
      let flag = false;
      donor.donations.forEach(item=>{
        if(item.food===order.food && item._id==order._id)
        {        
          if(!flag)
          {
            if(item.quantity-order.quantity<0)
            throw Error("Reduce the quantity");
          item.quantity-=order.quantity;
          if(item.quantity<=0)
            donor.donations.splice(donor.donations.indexOf(item),1);
          }
          flag = true
        }
      })
      if(!flag)
      {
        throw Error("Food not available");
      }
    })

    const updatedDonation = await donor.save();

    const existingOrder = await Orders.findOne({donor_id:donor._id,receiver_id:receiver._id});
    console.log(existingOrder)
    if(existingOrder)
    {
      existingOrder.orders = existingOrder.orders.concat(orders);
      const updatedOrder = await existingOrder.save();
      res.status(201).json(updatedOrder);
    }
    else {
      const newOrder = await Orders.create({donor_id:donor._id,receiver_id:receiver._id,orders});
      res.status(200).json(newOrder)
    }

  }
  catch(error)
  {
    res.status(500).json(error.message)
  }
}

const getReceiverOrders = async(req,res) => {
  try {
    const receiverOrders = (await Orders.find({receiver_id:req.user}))
    res.status(200).json(receiverOrders)
  } catch (error) {
    res.status(500).json(error.message)
  }
}

const getAllNearestDonations = async (req, res) => {
  try {
    const receiverId = req.user;
    const receiver = await Receivers.findOne({ userId: receiverId });
    
    const nearestDonors = await Users.find({
      role: "Donor",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(receiver.longitude), parseFloat(receiver.latitude)]
          },
          $maxDistance: 30000
        }
      }
    });

    res.status(200).json(nearestDonors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {order,getReceiverOrders,getAllNearestDonations}; 