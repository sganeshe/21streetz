const express = require("express");
const { subscribe, unsubscribe, broadcast } = require("../controllers/subscription.controller");
const authenticate = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const router = express.Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin Broadcast Route
router.post("/broadcast", authenticate, isAdmin, broadcast);

module.exports = router;