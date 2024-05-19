const Donors = require("../models/donorModel");
const Orders = require("../models/ordersModel");
const Receivers = require("../models/receiverModel");
const Users = require("../models/userModel");
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
    const receiver = await Receivers.findOne({_id:receiverId})
    if(!receiver){
      return res.status(404).json(`No receiver exists with id:${receiverId}`)
    }
    const user = await Users.findOne({_id:receiver.userId}).select('-password -latitude -longitude');
    if(!user){
      return res.status(404).json(`No user exists with id:${receiver.userId}`)
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({error:error.message});
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
      const donorOrders = await Orders.find({ donor_id:donor._id});
     
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
              id: order._id,
              status: order.status,
            }
            statusOrders.push(donOrder)
          }
        })
      })
      return res.status(200).json(statusOrders);
    }
    const donorOrders = await Orders.find({ donor_id:donor._id})
    let allOrders = []
    donorOrders.forEach(donorOrder=>{
      donorOrder.orders.forEach(order=>{
        let donOrder = {
          donor_id:donorOrder.donor_id,
          receiver_id:donorOrder.receiver_id,
          food: order.food,
          image: order.image,
          quantity: order.quantity,
          date: order.date,
          id: order._id,
          status: order.status,
        }
        allOrders.push(donOrder)
      })
    })
    res.status(200).json(allOrders);
  } catch (error) {
    res.status(500).json({error:error.message});
  } 
};

const confirmOrder = async(req,res) => {
  try {
    const {orderId, donorId, receiverId, secret} = req.body
    let orders = await Orders.findOne({donor_id:donorId, receiver_id:receiverId})
    console.log(orders)
    let isValidSecret = false
    orders.orders.forEach((order)=>{
      if(order._id==orderId){
        if(order.secret==secret){
          order.status="Delivered";
          isValidSecret = true;
        }
      }
    })
    if(isValidSecret){
      await orders.save();
      return res.status(200).json({message:"Order confirmed successfully"})
    }
    res.status(400).json({message:"Invalid secret provided"})
  } catch (error) {
    console.log(error)
    res.status(500).json({error:error.message});
  }
}


module.exports = {addDonation,getDonationHistory,getLiveDonations,getDonorOrders, confirmOrder, getReceiverDetails};