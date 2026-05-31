const express = require('express');
const authRoutes = require('./auth.route');
const productsRoutes = require('./products.route');
const ordersRoutes = require('./orders.route');
const subscriptionsRoutes = require('./subscriptions.route');
const couponRoutes = require('./coupon.route');
const router = express.Router();


router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/orders", ordersRoutes);
router.use("/subscriptions", subscriptionsRoutes);
router.use("/coupons", couponRoutes);


module.exports = router;
