const express = require("express");
const {addDonation,getDonationHistory} = require("../controllers/donorController")
const requireAuth = require("../middleware/requireAuth")

const router = express.Router();
router.use(requireAuth);
router.patch("/",addDonation);
router.get("/:id",getDonationHistory);

module.exports = router;