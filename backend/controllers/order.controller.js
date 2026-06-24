const Order = require("../models/order.model");
const Product = require("../models/product.model");
const { z } = require("zod");
const Coupon = require("../models/coupon.model");

const orderCreateSchema = z.object({
  orderItems: z.array(
    z.object({
      qty: z.number().int().positive(),
      product: z.string().regex(/^[0-9a-fA-F]{24}$/),
      size: z.string().min(1),
    })
  ).min(1),
  shippingAddress: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(10),
  }),
  paymentMethod: z.string().min(1),
  couponCode: z.string().uppercase().trim().optional(),
});

const paymentResultSchema = z.object({
  id: z.string().min(1),
  status: z.string().min(1),
  update_time: z.string().min(1),
  email_address: z.string().email(),
});

module.exports.createOrder = async (req, res, next) => {
  try {
    const parse = orderCreateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parse.error.issues,
      });
    }

    const { orderItems, shippingAddress, paymentMethod, couponCode } = parse.data;

    let itemsPrice = 0; // Renamed from subTotal for clarity
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
      }

      const selectedSize = dbProduct.sizes.find(s => s.size === item.size);

      if (!selectedSize) {
        return res.status(400).json({ success: false, message: `Size ${item.size} not available for ${dbProduct.name}` });
      }

      if (selectedSize.countInStock < item.qty) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${dbProduct.name}` });
      }

      itemsPrice += dbProduct.price * item.qty;

      // Capture the first image if it exists
      const productImage = dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : "";

      verifiedOrderItems.push({
        name: dbProduct.name,
        qty: item.qty,
        price: dbProduct.price,
        product: dbProduct._id,
        size: item.size,
        image: productImage, 
      });
    }

    let discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      
      if (!coupon || new Date() > coupon.expiryDate) {
        return res.status(400).json({ success: false, message: "Invalid or expired coupon" });
      }

      if (coupon.discountType === "PERCENTAGE") {
        let rawDiscount = (itemsPrice * coupon.discountValue) / 100;
        discountAmount = coupon.maxDiscountAmount ? Math.min(rawDiscount, coupon.maxDiscountAmount) : rawDiscount;
      } else if (coupon.discountType === "FIXED") {
        discountAmount = coupon.discountValue;
      }
    }

    // NEW: Calculate Shipping Price. 
    // Example logic: Flat ₹100 shipping if cart is under ₹1000, otherwise free.
    const shippingPrice = itemsPrice > 1000 ? 0 : 100; 

    // Calculate final total
    const discountedTotal = Math.max(0, itemsPrice - discountAmount);
    const finalTotalPrice = discountedTotal + shippingPrice;

    const order = new Order({
      user: req.userId,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,       
      shippingPrice,    
      discountAmount,  
      totalPrice: finalTotalPrice,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.userId });
    
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user._id.toString() !== req.userId && req.userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updateOrderToPaid = async (req, res, next) => {
  try {
    const parse = paymentResultSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment details",
        errors: parse.error.issues,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = parse.data;

    const updatedOrder = await order.save();

    for (const item of order.orderItems) {
      await Product.findOneAndUpdate(
        { 
          _id: item.product, 
          "sizes.size": item.size,
          "sizes.countInStock": { $gte: item.qty } 
        },
        { 
          $inc: { "sizes.$.countInStock": -item.qty } 
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Order paid successfully",
      order: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: "Order marked as delivered",
      order: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};