const express = require("express");
const protect = require("../middleware/authMiddleware");
const { giveFeedback, getFeedbackForUser } = require("../controllers/feedbackController");

const router = express.Router();

router.get("/user/:id",protect,getFeedbackForUser);
router.post("/", protect, giveFeedback);


module.exports = router;