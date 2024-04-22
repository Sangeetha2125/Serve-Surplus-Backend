const receiverAuth = (req,res,next)=>{
  try {
    if(req.role!=="Receiver"){
      throw Error("Donor cannot access");
    }
    next()
  }
  catch(error)
  {
    return res.status(401).json(error.message);
  }
}

module.exports = receiverAuth