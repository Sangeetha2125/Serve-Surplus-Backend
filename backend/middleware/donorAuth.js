const donorAuth = (req,res,next)=>{
  try {
    if(req.role!=="Donor"){
      throw Error("Receiver cannot access");
    }
    next()
  }
  catch(error)
  {
    return res.status(401).json(error.message);
  }
}

module.exports = donorAuth