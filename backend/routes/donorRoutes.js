const express = require("express");
const {addDonation,getDonationHistory} = require("../controllers/donorController")
const requireAuth = require("../middleware/requireAuth")
const donorAuth = require("../middleware/donorAuth")
const router = express.Router();
router.use(requireAuth);
router.use(donorAuth);
router.patch("/",addDonation);
router.get("/history",getDonationHistory);

module.exports = router;           