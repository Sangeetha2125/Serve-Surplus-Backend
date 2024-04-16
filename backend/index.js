require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express()
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes")
const profileRoutes = require("./routes/profileRoutes")
const donorRoutes = require("./routes/donorRoutes")
app.use(cors());
app.use(express.json())

//routes
app.use("/api/auth",authRoutes);
app.use("/api/booking",bookingRoutes)
app.use("/api/profile",profileRoutes);
app.use("/api/donor",donorRoutes)
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  app.listen(process.env.PORT,()=>{
    console.log(`Server is listening at port ${process.env.PORT} and db is connected`);
  })
})
.catch((err)=>{
  console.log(err);
})

