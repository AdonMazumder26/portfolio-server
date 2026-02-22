const router = require("express").Router();
const Project = require("../models/Project");
const verifyToken = require("../middleware/verifyToken");
const authorizeRole = require("../middleware/authorizeRole");

// ✅ GET all projects (Public)
router.get("/", async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
});

// ✅ GET single project (Public)
router.get("/:id", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
});

// 🔐 CREATE project (Protected)
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const newProject = await Project.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    next(error);
  }
});

// 🔐 UPDATE project (Protected)
router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });

    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
});

// 🔐 DELETE project (Protected)
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("admin"),
  async (req, res, next) => {
    try {
      const deletedProject = await Project.findByIdAndDelete(req.params.id);

      if (!deletedProject)
        return res.status(404).json({ message: "Project not found" });

      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
