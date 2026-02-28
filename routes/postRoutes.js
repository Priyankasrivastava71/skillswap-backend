const express = require("express");
const protect = require("../middleware/authMiddleware");
const { createPost, getAllPosts, deletePost } = require("../controllers/postController");

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", protect, getAllPosts);
router.delete("/:id", protect, deletePost);

module.exports = router;