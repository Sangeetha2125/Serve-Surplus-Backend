const Donors = require("../models/donorModel");
const Receivers = require("../models/receiverModel");

const createProfile = async (req,res)=>{
    try {
      if(req.role.toUpperCase() === "DONOR"){
        await Donors.validate({...req.body})
        const donor = await Donors.create({...req.body,userId:req.user});
        res.status(201).json(donor);
      }
      else if(req.role.toUpperCase() === "RECEIVER") {
        await Receivers.validate({...req.body})
        const receiver = await Receivers.create({...req.body,userId:req.user}); 
        res.status(201).json(receiver);
      }
    }
    catch(error)
    {
      res.status(500).json({error:error.message});
    }
}

const updateProfile = async (req,res)=>{
  try {
    if(req.role.toUpperCase() === "DONOR"){
      const donor = await Donors.findOneAndUpdate({userId:req.user},{...req.body});
      res.status(201).json(donor);
    }
    else if(req.role.toUpperCase() === "RECEIVER") {
      const receiver = await Receivers.findOneAndUpdate({userId:req.user},{...req.body},{new:true});
      res.status(201).json(receiver);
    }
  }
  catch(error)
  {
    res.status(500).json({error:error.message});
  }
}

module.exports = {createProfile,updateProfile};


