const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {createProfile,updateProfile,getProfile} = require("../controllers/profileController");

router.use(requireAuth);

router.post("/create",createProfile);
router.post("/update",updateProfile);
router.get("/get",getProfile);

module.exports = router;