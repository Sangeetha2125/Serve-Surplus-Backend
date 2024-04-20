const express = require("express");
const {order} = require("../controllers/receiverController");
const requireAuth = require("../middleware/requireAuth")
const router = express.Router();
router.use(requireAuth)
router.post("/:id",order);

module.exports = router;