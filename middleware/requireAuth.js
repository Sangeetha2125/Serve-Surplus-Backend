const jwt = require('jsonwebtoken');
const User = require("../models/userModel.js");
const requireAuth = async (req,res,next)=>{
  const {authorization} = req.headers

  if(!authorization)
    return res.status(401).json({error:'Authorization token required'})
    const token = authorization.split(' ')[1]

    try {
      const {_id} = jwt.verify(token,process.env.SECRET_KEY)
      const user = await User.findOne({_id}).select('_id role');
      req.user = user._id;
      req.role = user.role;
      next()
    } 
    catch(error)
    {
      console.log(error);
      res.status(401).json({error:"Request is not authorized"});
    }

}

module.exports = requireAuth;