require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express()
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes")
const donorRoutes = require("./routes/donorRoutes")
const receiverRoutes = require("./routes/receiverRoutes")
const sendEmail = require("./utils/sendEmail");
app.use(cors());
app.use(express.json())

//routes
app.get("/",async(req,res)=>{
  await sendEmail();
  res.send("Serve Surplus")
})
app.use("/api/auth",authRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/donor",donorRoutes)
app.use("/api/receiver",receiverRoutes)

mongoose.connect(process.env.MONGO_URI, {dbName: "Serve-Surplus"})
.then(()=>{
  app.listen(process.env.PORT,()=>{
    console.log(`Server is listening at port ${process.env.PORT} and db is connected`);
  })
})
.catch((err)=>{
  console.log(err);
})

