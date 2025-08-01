// server/routes/blog.js
const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public routes
router.get("/", blogController.getBlogs);
router.get("/:id", blogController.getBlogById);

// Protected routes
router.post("/", auth, upload.single("image"), blogController.createBlog);
router.put("/:id", auth, blogController.updateBlog);
router.delete("/:id", auth, blogController.deleteBlog);

module.exports = router;
