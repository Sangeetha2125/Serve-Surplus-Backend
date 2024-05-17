const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {createProfile,updateProfile, addLocationCoordinates, getProfile} = require("../controllers/profileController");

router.use(requireAuth);

router.get("/",getProfile)
router.post("/create",createProfile);
router.post("/update",updateProfile);
router.post("/update-location",addLocationCoordinates)

module.exports = router;