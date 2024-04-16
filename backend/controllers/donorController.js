const Donors = require("../models/donorModel");
const addDonation = async (req,res)=>{
  try {
    const donor = await Donors.findOne({userId:req.user});
    Object.assign(donor.donations, req.body);
    const updatedDonor = await donor.save();
    res.status(201).json(updatedDonor);
  }
  catch(error)
  {
    res.status(500).json({error:error.message});
  }
}

module.exports = {addDonation};