const Donors = require("../models/donorModel");
const User = require("../models/userModel")
const Receivers = require("../models/receiverModel");

const createProfile = async (req,res)=>{
    try {
      if(req.role.toUpperCase() === "DONOR"){
        await User.validate({...req.body})
        await User.findOneAndUpdate({_id:req.user}, {...req.body}, {new: true})
        const donor = await Donors.create({userId:req.user});
        return res.status(201).json(donor);  
      }
      else if(req.role.toUpperCase() === "RECEIVER") {
        await User.validate({...req.body})
        await User.findOneAndUpdate({_id:req.user}, {...req.body}, {new: true})
        const receiver = await Receivers.create({userId:req.user}); 
        return res.status(201).json(receiver);
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

const addLocationCoordinates = async(req,res) => {
  try {
    const {latitude,longitude} = req.body
    const user = await User.findOneAndUpdate({_id:req.user},{latitude,longitude},{new:true})
    res.status(201).json({message:"Coordinates updated successfully",user});
  } catch (error) {
    res.status(500).json({error:error.message});
  }
}

module.exports = {createProfile,updateProfile,addLocationCoordinates};

