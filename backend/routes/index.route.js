const express = require('express');
const authRoutes = require('./auth.route');
const productsRoutes = require('./products.route');
const ordersRoutes = require('./orders.route');
const subscriptionsRoutes = require('./subscriptions.route');
const couponRoutes = require('./coupon.route');
const router = express.Router();
const pressRoutes = require("./press.routes");
const newsRoutes = require("./news.route");


router.use("/auth", authRoutes);
router.use("/products", productsRoutes);
router.use("/orders", ordersRoutes);
router.use("/subscriptions", subscriptionsRoutes);
router.use("/coupons", couponRoutes);
router.use("/press", pressRoutes);
router.use("/news", newsRoutes);

module.exports = router;
