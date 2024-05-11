const Donors = require("../models/donorModel");
const Orders = require("../models/ordersModel");
const Receivers = require("../models/receiverModel");
const Users = require("../models/userModel");
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

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180; // Convert degrees to radians
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const getAllNearestDonations = async (req, res) => {
  try {
    const receiverId = req.user;
    const receiver = await Receivers.findOne({ userId: receiverId });
    const donors = await Users.find({ role: "Donor" });

    const nearestDonors = [];
    for (let i = 0; i < donors.length; i++) {
      const distance = haversineDistance(
        receiver.latitude,
        receiver.longitude,
        donors[i].latitude,
        donors[i].longitude
      );
      if (distance <= 30) {
        nearestDonors.push(donors[i]);
      }
      console.log(distance);
    }

    res.status(200).json(nearestDonors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {order,getReceiverOrders,getAllNearestDonations}; 