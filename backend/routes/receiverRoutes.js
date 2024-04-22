const express = require("express");
const {order} = require("../controllers/receiverController")
const requireAuth = require("../middleware/requireAuth")
const receiverAuth = require("../middleware/receiverAuth")

const router = express.Router();
router.use(requireAuth)
router.use(receiverAuth)
router.post("/:id",order);

module.exports = router;