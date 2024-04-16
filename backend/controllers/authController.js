const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const createToken = (_id)=>{
  return jwt.sign({_id},process.env.SECRET_KEY,{expiresIn:'3d'});
}
const register = async(req,res)=>{
  const {email,password,role} = req.body;
  try {    
    const user = await User.signUp(email,password,role);
    const token = createToken(user._id);
    res.status(200).json({email,token});
  }
  catch(error)
  {
      res.status(400).json({error:error.message});
  }
}

const login = async (req,res)=>{
  const {email,password} = req.body;
  try {
    const user = await User.login(email,password);
    const token = createToken(user._id);
    res.status(200).json({email,token}); 
  }
  catch(error)
  {
    res.status(400).json({error:error.message});
  }
}

module.exports = {register,login};