const router = require("express").Router();
const Blog = require("../models/Blog");
const verifyToken = require("../middleware/verifyToken");
const authorizeRole = require("../middleware/authorizeRole");

// ✅ GET all blogs (Public)
router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

// ✅ GET single blog by slug (Public)
router.get("/:slug", async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

// 🔐 CREATE blog (Protected)
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }
});

// 🔐 UPDATE blog (Protected)
router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedBlog)
      return res.status(404).json({ message: "Blog not found" });

    res.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

// 🔐 DELETE blog (Protected)
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("admin"),
  async (req, res, next) => {
    try {
      const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

      if (!deletedBlog)
        return res.status(404).json({ message: "Blog not found" });

      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
