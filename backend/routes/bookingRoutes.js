const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {booking} = require("../controllers/bookingController");
const router = express.Router();
router.use(requireAuth);
router.get("/booking",booking);
module.exports = router;
