const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {createProfile,updateProfile} = require("../controllers/profileController");

router.use(requireAuth);

router.post("/create",createProfile);
router.post("/update",updateProfile);

module.exports = router;