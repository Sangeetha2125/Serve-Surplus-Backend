const Donors = require("../models/donorModel");
const order = async (req,res)=>{
  const {orders} = req.body;
  try {
    const {id} = req.params;
    const donor = await Donors.findOne({_id:id});
    orders.forEach((order)=>{
      let flag = false;
      donor.donations.forEach(item=>{
        if(item.food===order.food && item._id==order._id)
        {        
          if(!flag)
          {
            if(item.quantity-order.quantity<0)
            throw Error("Reduce the quantity");
          item.quantity-=order.quantity;
          if(item.quantity<=0)
            donor.donations.splice(donor.donations.indexOf(item),1);
          }
          flag = true
        }
      })
      if(!flag)
      {
        throw Error("Food not available");
      }
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