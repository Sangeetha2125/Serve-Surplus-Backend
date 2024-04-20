const express = require("express");
const {order} = require("../controllers/receiverController");
const router = express.Router();

router.post("/:id",order);

module.exports = router;