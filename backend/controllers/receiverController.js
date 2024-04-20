const Donors = require("../models/donorModel");
const order = async (req,res)=>{
  const {orders} = req.body;
  try {
    const {id} = req.params;
    const donor = await Donors.findOne({_id:id});
    console.log("Donor",donor)
    orders.forEach((order)=>{
      donor.donations.forEach(item=>{
        if(item.food===order.food)
        {
          item.quantity-=order.quantity;
          if(item.quantity<=0)
            donor.donations.splice(donor.donations.indexOf(item),1);
        }
      })
    })

    const updatedDonation = await donor.save();
    res.status(200).json(updatedDonation);
  }
  catch(error)
  {
    res.status(500).json(error.message)
  }
}

module.exports = {order};