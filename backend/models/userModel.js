const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator")
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  role: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  phone: {
    type: String,
  },
  doorNumber: {
    type: String,
  },
  street: {
    type: String,
  },
  area: {
    type: String,
  },
  city: {
    type: String,
  },
  pincode: {
    type: String,
  },
  latitude:{
    type: Number,
  },
  longitude:{
    type: Number
  }
})

userSchema.statics.signUp = async function(email,password,role){
  if(!email || !password || !role)
    throw Error("All fields must be filled!")
  else if(!validator.isEmail(email))
    throw Error("Email is not valid");
  else if(!validator.isStrongPassword(password))
    throw Error("Password is not strong enough");
  else if(role.toUpperCase()!=="DONOR" && role.toUpperCase()!=="RECEIVER")
    throw Error("Choose correct role");
  const exists = await this.findOne({email});
  if(exists){
    throw Error("Email already in use!");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password,salt);
  const user = await this.create({email,password:hash,role});
  return user;
}

userSchema.statics.login = async function(email,password,role){
  if(!email || !password)
    throw Error("All fields must be filled")
  else if(role.toUpperCase()!=="DONOR" && role.toUpperCase()!=="RECEIVER")
    throw Error("Choose correct role");
  const user = await this.findOne({email});
  if(!user)
    throw Error("Incorrect Email");
  const match = await bcrypt.compare(password,user.password);
  if(!match)
    throw Error("Incorrect Password");
  return user;
}

userSchema.statics.validate = function(user) {
  if(!user.name || !user.phone || !user.doorNumber || !user.street ||
     !user.area || !user.city || !user.pincode)
     throw Error("All the fields must be filled!");
     
}

module.exports = mongoose.model("User",userSchema);