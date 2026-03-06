const express = require("express");
const protect = require("../middleware/authMiddleware");
const { updateProfile, getAllUsers, getMatches, searchUsersBySkill, getTopRatedUsers, getProfile, getUserById,} = require("../controllers/userController");

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/profile",protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/matches",protect,getMatches);
router.get("/search", protect, searchUsersBySkill);
router.get("/top-rated", protect, getTopRatedUsers);
router.get("/:id",protect, getUserById);
module.exports = router;