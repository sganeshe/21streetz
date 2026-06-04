const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderToDelivered,
} = require("../controllers/order.controller");
const authenticate = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const router = express.Router();


router.post("/new", authenticate, createOrder);
router.get("/myorders", authenticate, getMyOrders);

router.get("/all",authenticate,isAdmin, getAllOrders);  //Admin

router.get("/:id", authenticate, getOrderById);
router.put("/:id/pay", authenticate, updateOrderToPaid);



router.put("/:id/deliver",authenticate,isAdmin, updateOrderToDelivered);

module.exports = router;


//payment integration pending - will be added in future iterations
//payment flow will be:
//first on frontend we will call createOrder to create the order and get the order details including total price
//then we will integrate with payment gateway (like Stripe) to process the payment with the id and total price from the order details
//get payment confirmation from the payment gateway and then call updateOrderToPaid to update the order status to paid and store payment details

