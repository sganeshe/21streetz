const express = require("express");
const router = express.Router();
const { addNews, getAllNews, updateNews, deleteNews } = require("../controllers/news.controller");
const authenticate = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

// Public Route
router.get("/", getAllNews);

// Admin Protected Routes
router.post("/add", authenticate, isAdmin, addNews);
router.put("/:id", authenticate, isAdmin, updateNews);
router.delete("/:id", authenticate, isAdmin, deleteNews);

module.exports = router;