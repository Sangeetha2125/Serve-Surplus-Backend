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
    res.status(200).json({email,role,token});
  }
  catch(error)
  {
      res.status(400).json({error:error.message});
  }
}

const login = async (req,res)=>{
  const {email,role,password} = req.body;
  try {
    const user = await User.login(email,password,role);
    const token = createToken(user._id);
    if(user.name && user.name!=''){
      res.status(200).json({user:{email,role,token},profileCreated:true}); 
    }
    res.status(200).json({email,role,token}); 
  }
  catch(error)
  {
    res.status(400).json({error:error.message});
  }
}

const getUserData = async(req,res)=>{
  const {authorization} = req.headers

  if(!authorization)
    return res.status(401).json({error:'Authorization token required'})
    const token = authorization.split(' ')[1]

    if(token==''){
      return res.status(401).json({error:"Invalid token"})
    }

    try {
      const {_id} = jwt.verify(token,process.env.SECRET_KEY)
      const user = await User.findOne({_id}).select('email role');
      if(user)
        return res.status(200).json({email:user.email,role:user.role,token})
      else
        return res.status(401).json({error:"Invalid token"})
    } 
    catch(error)
    {
      res.status(401).json({error:"Request is not authorized"});
    }
}

module.exports = {register,login,getUserData};