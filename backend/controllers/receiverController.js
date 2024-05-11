const Donors = require("../models/donorModel");
const Orders = require("../models/ordersModel");
const Receivers = require("../models/receiverModel");
const Users = require("../models/userModel");
const  geo = require('node-geo-distance');

const order = async (req, res) => {
  const { orders } = req.body;
  try {
    const { id } = req.params;
    const donor = await Donors.findOne({ _id: id });
    const receiver = await Receivers.findOne({ userId: req.user._id });
    orders.forEach((order) => {
      let flag = false;
      donor.donations.forEach((item) => {
        if (item.food === order.food && item._id == order._id) {
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
    });

    const updatedDonation = await donor.save();

    const existingOrder = await Orders.findOne({
      donor_id: donor._id,
      receiver_id: receiver._id,
    });
    if (existingOrder) {
      existingOrder.orders = existingOrder.orders.concat(orders);
      const updatedOrder = await existingOrder.save();
      res.status(201).json(updatedOrder);
    } else {
      const newOrder = await Orders.create({
        donor_id: donor._id,
        receiver_id: receiver._id,
        orders,
      });
      res.status(200).json(newOrder);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getReceiverOrders = async (req, res) => {
  try {
    const receiverOrders = await Orders.find({ receiver_id: req.user });
    res.status(200).json(receiverOrders);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

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

module.exports = { order, getReceiverOrders, getAllNearestDonations };
