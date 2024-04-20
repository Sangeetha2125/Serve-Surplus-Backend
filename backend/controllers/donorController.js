const Donors = require("../models/donorModel");
const addDonation = async (req,res)=>{
  try {
    const donor = await Donors.findOne({userId:req.user});
    const {donations} = req.body;
    const currentdonations = donations.map(({food,quantity})=>({food,quantity}));
    donor.donations = donor.donations.concat(currentdonations);
    donor.donationHistory = donor.donationHistory.concat(currentdonations);
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
  const {donationHistory} = await Donors.findOne({_id:id});
  res.status(200).json(donationHistory);
}


module.exports = {addDonation,getDonationHistory};