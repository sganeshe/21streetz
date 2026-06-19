const Coupon = require("../models/coupon.model");
const { z } = require("zod");

const couponCreateSchema = z.object({
  code: z.string().min(1).uppercase().trim(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().positive(),
  maxDiscountAmount: z.number().positive().optional(),
  expiryDate: z.coerce.date(),
  isActive: z.boolean().optional(),
});

module.exports.addCoupon = async (req, res, next) => {
  try {
    const parse = couponCreateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parse.error.issues,
      });
    }

    const { code, discountType, discountValue, maxDiscountAmount, expiryDate, isActive } = parse.data;

    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    const coupon = new Coupon({
      code,
      discountType,
      discountValue,
      maxDiscountAmount,
      expiryDate,
      isActive,
    });

    await coupon.save();

    res.status(201).json({
      success: true,
      message: "Coupon added successfully",
      coupon,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({});
    
    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};


module.exports.validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    
    if (!coupon || new Date() > coupon.expiryDate) {
      return res.status(400).json({ success: false, message: "Invalid or expired coupon code" });
    }

    // Only send back the data the frontend needs to calculate the discount
    res.status(200).json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        maxDiscountAmount: coupon.maxDiscountAmount
      }
    });
  } catch (err) {
    next(err);
  }
};