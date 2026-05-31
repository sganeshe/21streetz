const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderToDelivered,
} = require("../controllers/order.controller");
const authenticate = require("../middlewares/authenticate.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const router = express.Router();


router.post("/new", authenticate, createOrder);
router.get("/myorders", authenticate, getMyOrders);
router.get("/:id", authenticate, getOrderById);
router.put("/:id/pay", authenticate, updateOrderToPaid);


router.get("/all",authenticate,isAdmin, getAllOrders);
router.put("/:id/deliver",authenticate,isAdmin, updateOrderToDelivered);

module.exports = router;
