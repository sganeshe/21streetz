const express = require("express");
const { subscribe, unsubscribe, broadcast , getAllSubscribers } = require("../controllers/subscription.controller");
const authenticate = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const router = express.Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin Broadcast Route
router.post("/broadcast", authenticate, isAdmin, broadcast);
router.get("/all", authenticate, isAdmin, getAllSubscribers);
module.exports = router;