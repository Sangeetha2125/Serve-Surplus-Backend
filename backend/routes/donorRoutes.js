const express = require("express");
const {addDonation,getDonationHistory, getLiveDonations, getDonorOrders, confirmOrder} = require("../controllers/donorController")
const requireAuth = require("../middleware/requireAuth")
const donorAuth = require("../middleware/donorAuth")
const router = express.Router();
router.use(requireAuth);
router.use(donorAuth);
router.patch("/",addDonation);
router.get("/history",getDonationHistory);
router.get("/",getLiveDonations)
router.get("/orders",getDonorOrders)
router.post("/confirm-order",confirmOrder)

module.exports = router;           