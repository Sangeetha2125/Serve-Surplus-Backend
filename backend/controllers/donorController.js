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

const getDonationHistory = async(req,res)=>{
  const {id} = req.params;
  const {donationHistory} = await Donors.findOne({userId:id});
  res.status(200).json(donationHistory);
}


module.exports = {addDonation,getDonationHistory};