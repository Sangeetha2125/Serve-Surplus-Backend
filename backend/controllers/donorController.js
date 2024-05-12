const Donors = require("../models/donorModel");
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
  const {donations} = await Donors.findOne({userId:req.user});
  res.status(200).json(donations);
}

const getDonationHistory = async(req,res)=>{
  const {donationHistory} = await Donors.findOne({userId:req.user});
  res.status(200).json(donationHistory);
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


module.exports = {addDonation,getDonationHistory,getLiveDonations,getDonorOrders};