const express = require("express");
const {order, getReceiverOrders, getAllNearestDonations, getDonorDetails} = require("../controllers/receiverController")
const requireAuth = require("../middleware/requireAuth")
const receiverAuth = require("../middleware/receiverAuth")

const router = express.Router();
router.use(requireAuth)
router.use(receiverAuth)
router.get("/",getAllNearestDonations);
router.post("/:id",order);
router.get("/requests",getReceiverOrders)
router.get("/donor-info",getDonorDetails)

module.exports = router;