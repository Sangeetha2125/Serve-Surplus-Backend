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
  let {donorId, isDonorReference} = req.query
  try {
    if(!donorId || donorId===''){
      return res.status(400).json("Donor id is required to access this route")
    }
    let donor = null;
    if(isDonorReference){
      donor = await Donors.findOne({_id:donorId})
      if(!donor){
        return res.status(404).json(`No donor exists with id:${donorId}`)
      }
      donorId = donor.userId
    }
    const user = await Users.findOne({_id:donorId}).select('-password -latitude -longitude');
    if(!user){
      return res.status(404).json(`No donor exists with id:${donorId}`)
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error.message);
  }
}

const order = async (req, res) => {
  const order = req.body
  try {
    const { id } = req.params;
    const user = await Users.findOne({_id:req.user});
    const donor = await Donors.findOne({ userId: id });
    const receiver = await Receivers.findOne({ userId: req.user });
      let flag = false;
      donor.donations.forEach((item) => {
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
    const message = `<h1 style="color: #000000; margin-bottom: 20px;">Your Order Confirmation</h1>
    <p style="color: #111111; line-height: 1.6;">Hello ${user.name},</p>
    <p style="color: #111111; line-height: 1.6;">We are pleased to confirm that your order for <strong>${order.food}</strong> (Quantity: ${order.quantity}) has been accepted.</p>
    <p style="color: #111111; line-height: 1.6;">Please make a note of the following OTP: <strong>${otp}</strong>. This OTP is required for you to confirm your identity when receiving the donation from our generous donor.</p>
    <p style="color: #111111; line-height: 1.6;">We kindly remind you to treat the donor's contribution with utmost respect and gratitude.</p>
    <p style="color: #111111; line-height: 1.6;">If you have any questions or need assistance, feel free to reach out to us. We're here to help!</p>
    <p style="color: #222222; line-height: 1.6;">Thank you for choosing Serve Surplus. Your support makes a real difference!</p>
    <p style="color: #222222; line-height: 1.6; margin-top: 20px;">With Regards,<br>The Serve Surplus Team</p>`

    sendEmail(message,user.email);
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
      let statusOrders = []
      receiverOrders.forEach(receiverOrder=>{
        receiverOrder.orders.forEach(order=>{
          if(order.status===status){
            let recOrder = {
              donor_id:receiverOrder.donor_id,
              receiver_id:receiverOrder.receiver_id,
              food: order.food,
              image: order.image,
              quantity: order.quantity,
              date: order.date,
              id: order.id,
              status: order.status,
            }
            statusOrders.push(recOrder)
          }
        })
      })
      return res.status(200).json(statusOrders);
    }
    const receiverOrders = await Orders.find({ receiver_id: receiver._id });
    let allOrders = []
    receiverOrders.forEach(receiverOrder=>{
      receiverOrder.orders.forEach(order=>{
        let recOrder = {
          donor_id:receiverOrder.donor_id,
          receiver_id:receiverOrder.receiver_id,
          food: order.food,
          image: order.image,
          quantity: order.quantity,
          date: order.date,
          id: order.id,
          status: order.status,
        }
        allOrders.push(recOrder)
      })
    })
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).json(error.message);
  } 
};


module.exports = { order, getReceiverOrders, getAllNearestDonations, getDonorDetails};
