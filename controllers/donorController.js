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

const getReceiverDetails = async(req,res) => {
  const {receiverId} = req.query
  try {
    if(!receiverId || receiverId===''){
      return res.status(400).json("Receiver id is required to access this route")
    }
    const receiver = await Users.findOne({_id:receiverId}).select('-password -latitude -longitude');
    if(!receiver){
      return res.status(404).json(`No receiver exists with id:${receiverId}`)
    }
    res.status(200).json(receiver)
  } catch (error) {
    res.status(500).json(error.message);
  }
}

const getDonorOrders = async (req, res) => {
  try {
    const {status} = req.query
    const donor = await Donors.findOne({userId:req.user})
    if(!donor){
      return res.status(400).json({message:"Unauthorized to access this route"})
    }
    if(status!=null){
      const donorOrders = await Orders.find({});
      console.log(donorOrders)
      let statusOrders = []
      donorOrders.forEach(donorOrder=>{
        donorOrder.orders.forEach(order=>{
          if(order.status===status){
            let donOrder = {
              donor_id:donorOrder.donor_id,
              receiver_id:donorOrder.receiver_id,
              food: order.food,
              image: order.image,
              quantity: order.quantity,
              date: order.date,
              id: order.id,
              status: order.status,
            }
            statusOrders.push(donOrder)
          }
        })
      })
      return res.status(200).json(statusOrders);
    }
    const donorOrders = await Orders.find({})
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
    const order = await Orders.findOne({donor_id:req.user,receiver_id:receiverId, orders:{$elemMatch:{_id:orderId}}})
    if(order){
      const secretFound = order.orders.secret
      if(secretFound && secret==secretFound){
        order.orders.status = "Delivered"
        await order.save();
        return res.status(200).json({message:"Order confirmed successfully"})
      }
    }
    res.status(404).json({message:"Invalid Secret"})
  } catch (error) {
    res.status(500).json(error.message);
  }
}


module.exports = {addDonation,getDonationHistory,getLiveDonations,getDonorOrders, confirmOrder, getReceiverDetails};