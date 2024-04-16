const express = require("express");
const {addDonation} = require("../controllers/donorController")
const requireAuth = require("../middleware/requireAuth")

const router = express.Router();
router.use(requireAuth);
router.patch("/",addDonation);

module.exports = router;