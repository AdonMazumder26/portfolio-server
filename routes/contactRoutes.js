const router = require("express").Router();
const Contact = require("../models/Contact");

// ✅ POST contact message (Public)
router.post("/", async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = await Contact.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
});

// 🔐 GET all contact messages (Protected - Admin only)
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
