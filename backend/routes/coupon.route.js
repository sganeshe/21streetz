const express = require("express");
const { addCoupon, getAllCoupons, deleteCoupon, validateCoupon } = require("../controllers/coupon.controller");
const authenticate = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const router = express.Router();

router.post("/validate", validateCoupon);
router.post("/add", authenticate, isAdmin, addCoupon);
router.get("/all", authenticate, isAdmin, getAllCoupons);
router.delete("/:id", authenticate, isAdmin, deleteCoupon);

module.exports = router;