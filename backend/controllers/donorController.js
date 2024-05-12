const Donors = require("../models/donorModel");
const Orders = require("../models/ordersModel");
const addDonation = async (req,res)=>{
  try {
    const donor = await Donors.findOne({userId:req.user});
    const {donations} = req.body;
    donor.donations = donor.donations.concat(donations);
    donor.donationHistory = donor.donationHistory.concat(donations);
    const updatedDonor = await donor.save();
    res.status(201).json(updatedDonor);
  } 
  catch(error)
  {
    res.status(500).json({error:error.message});
  }
}

const getLiveDonations = async(req,res)=>{
  try {
    const {donations} = await Donors.findOne({userId:req.user});
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
}

const getDonationHistory = async(req,res)=>{
  try {
    const {donationHistory} = await Donors.findOne({userId:req.user});
    res.status(200).json(donationHistory);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
}

const getDonorOrders = async (req, res) => {
  try {
    const {status} = req.query
    if(status){
      const donorOrders = await Orders.find({ donor_id: req.user, orders: {$eleMatch: {status: status}}});
      return res.status(200).json(donorOrders);
    }
    const donorOrders = await Orders.find({donor_id:req.user})
    res.status(200).json(donorOrders);
  } catch (error) {
    res.status(500).json(error.message);
  } 
};

const confirmOrder = async(req,res) => {
  try {
    const {receiverId, orderId, secret} = req.body
    if(!receiverId || !orderId || !secret){
      return res.status(400).json({message:"Receiver ID, Order ID, Secret are required"})
    } 
    const secretFound = await Orders.findOne({donor_id:req.user,receiver_id:receiverId, orders:{$eleMatch:{_id:orderId}}}).select("orders.order.secret")
    if(secretFound && secret==secretFound){
      return res.status(200).json({message:"Order confirmed successfully"})
    }
    res.status(404).json({message:"Invalid Secret"})
  } catch (error) {
    res.status(500).json(error.message);
  }
}


module.exports = {addDonation,getDonationHistory,getLiveDonations,getDonorOrders, confirmOrder};