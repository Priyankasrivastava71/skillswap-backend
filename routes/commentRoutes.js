const express = require("express");
const protect = require("../middleware/authMiddleware");
const { addComment, getCommentsByPost, deleteComment } = require("../controllers/commentController");

const router = express.Router();

router.delete("/:id", protect, deleteComment);
router.post("/", protect, addComment);
router.get("/:postId", protect, getCommentsByPost);

module.exports = router;