const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  sendRequest,
  getMyRequests,
  updateRequestStatus,
  scheduleSession,
  markSessionCompleted
} = require("../controllers/requestController");

const router = express.Router();

router.post("/", protect, sendRequest);
router.get("/", protect, getMyRequests);
router.put("/:id", protect, updateRequestStatus);
router.put("/:id/schedule",protect,scheduleSession);
router.put("/complete/:id",protect,markSessionCompleted);

module.exports = router;