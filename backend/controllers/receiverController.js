const Donors = require("../models/donorModel");
const Orders = require("../models/ordersModel");
const Receivers = require("../models/receiverModel");
const Users = require("../models/userModel");
const  geo = require('node-geo-distance');
const sendEmail = require("../utils/sendEmail");

const getAllNearestDonations = async (req, res) => {
  try {
    const receiverId = req.user;
    const receiver = await Users.findOne({ _id: receiverId });
    const donors = await Users.find({ role: "Donor" });
    let nearestDonations = [];
    for (let i = 0; i < donors.length; i++) {
      const coord1 = {
        latitude: donors[i].latitude,
        longitude: donors[i].longitude,
      };

      var coord2 = {
        latitude: receiver.latitude,
        longitude: receiver.longitude,
      };

      const distance = geo.haversine(coord1, coord2, function (dist) {
        return dist;
      });

      if (distance <= 30000) {
        const donations = await Donors.findOne({userId:donors[i]._id})
        let donationInfo = {donor: donors[i]._id,distance: Math.round(distance/1000),donations: donations.donations}
        nearestDonations = nearestDonations.concat(donationInfo)
      }
    }
    res.status(200).json(nearestDonations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDonorDetails = async(req,res) => {
  const {donorId} = req.query
  try {
    if(!donorId || donorId===''){
      return res.status(400).json("Donor id is required to access this route")
    }
    const donor = await Users.findOne({_id:donorId}).select('-password -latitude -longitude');
    if(!donor){
      return res.status(404).json(`No donor exists with id:${donorId}`)
    }
    res.status(200).json(donor)
  } catch (error) {
    res.status(500).json(error.message);
  }
}

const order = async (req, res) => {
  const {order} = req.body
  try {
    const { id } = req.params;
    const donor = await Donors.findOne({ userId: id });
    const receiver = await Receivers.findOne({ userId: req.user });
      let flag = false;
      donor.donations.forEach((item) => {
        console.log(item.food)
        console.log(order.food)
        if (item.food === order.food && item._id == order.donationId) {
          console.log("heel")
          if (!flag) {
            if (item.quantity - order.quantity < 0)
              throw Error("Reduce the quantity");
            item.quantity -= order.quantity;
            if (item.quantity <= 0)
              donor.donations.splice(donor.donations.indexOf(item), 1);
          }
          flag = true;
        }
      });
      if (!flag) {
        throw Error("Food not available");
      }
    const message = `hello`;
    function generateNumericOTP(length) {
      const digits = '0123456789';
      let otp = '';
  
      for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * digits.length);
          otp += digits[randomIndex];
      }
  
      return otp;
  }
    const otp = generateNumericOTP(6);
    console.log(otp)
    sendEmail(message);
    const updatedDonation = await donor.save();

    const existingOrder = await Orders.findOne({
      donor_id: donor._id,
      receiver_id: receiver._id,
    });
    if (existingOrder) {
      existingOrder.orders = existingOrder.orders.concat([{_id:order.donationId,food:order.food,quantity:order.quantity,image:order.image,donatedAt:order.donatedAt,secret:otp}]);
      const updatedOrder = await existingOrder.save();
      res.status(201).json(updatedOrder);
    } else {
      const newOrder = await Orders.create({
        donor_id: donor._id,
        receiver_id: receiver._id,
        orders:[{_id:order.donationId,food:order.food,quantity:order.quantity,image:order.image,donatedAt:order.donatedAt,secret:otp}],
      });
      res.status(200).json(newOrder);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getReceiverOrders = async (req, res) => {
  try {
    const {status} = req.query
    const receiver = await Receivers.findOne({userId:req.user})
    if(!receiver){
      return res.status(400).json({message:"Unauthorized to access this route"})
    }
    if(status!=null){
      const receiverOrders = await Orders.find({ receiver_id:receiver._id});
      let resultOrders = []
      receiverOrders.forEach(receiverOrder=>{
        let statusOrders = []
        receiverOrder.orders.forEach(order=>{
          if(order.status===status){
            statusOrders.push(order)
          }
        })
        let recOrder = {
          _id: receiverOrder._id,
          donor_id:receiverOrder.donor_id,
          receiver_id:receiverOrder.receiver_id,
          orders:statusOrders
        }
        resultOrders.push(recOrder)
      })
      return res.status(200).json(resultOrders);
    }
    const receiverOrders = await Orders.find({ receiver_id: receiver._id });
    res.status(200).json(receiverOrders);
  } catch (error) {
    res.status(500).json(error.message);
  } 
};


module.exports = { order, getReceiverOrders, getAllNearestDonations, getDonorDetails};
