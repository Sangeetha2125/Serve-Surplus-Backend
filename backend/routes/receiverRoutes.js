const express = require("express");
const {order, getReceiverOrders} = require("../controllers/receiverController")
const requireAuth = require("../middleware/requireAuth")
const receiverAuth = require("../middleware/receiverAuth")

const router = express.Router();
router.use(requireAuth)
router.use(receiverAuth)
router.post("/:id",order);
router.get("/requests",getReceiverOrders)

module.exports = router;