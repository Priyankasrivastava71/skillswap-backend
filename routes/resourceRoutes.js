const express = require("express");
const protect = require("../middleware/authMiddleware");
const { addResource, getAllResources } = require("../controllers/resourceController");

const router = express.Router();

router.post("/", protect, addResource);
router.get("/", protect, getAllResources);

module.exports = router;