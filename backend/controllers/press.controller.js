const Press = require("../models/press.model");
const { z } = require("zod");

const pressCreateSchema = z.object({
  headline: z.string().min(1),
  redirectLink: z.string().url(),
});

const pressUpdateSchema = z.object({
  headline: z.string().min(1).optional(),
  redirectLink: z.string().url().optional(),
});

module.exports.addPress = async (req, res, next) => {
  try {
    const parse = pressCreateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid press data",
        errors: parse.error.issues,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const { headline, redirectLink } = parse.data;

    const press = new Press({
      headline,
      redirectLink,
      image: req.file.path, // Cloudinary URL populated by Multer
    });

    await press.save();

    res.status(201).json({
      success: true,
      message: "Press entry created successfully",
      press,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllPress = async (req, res, next) => {
  try {
    const pressList = await Press.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      pressList,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updatePress = async (req, res, next) => {
  try {
    const parse = pressUpdateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid update data",
        errors: parse.error.issues,
      });
    }

    const press = await Press.findById(req.params.id);

    if (!press) {
      return res.status(404).json({
        success: false,
        message: "Press entry not found",
      });
    }

    const { headline, redirectLink } = parse.data;

    if (headline) press.headline = headline;
    if (redirectLink) press.redirectLink = redirectLink;
    
    // If admin uploaded a new image, overwrite the old one
    if (req.file) {
      press.image = req.file.path;
    }

    await press.save();

    res.status(200).json({
      success: true,
      message: "Press entry updated successfully",
      press,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deletePress = async (req, res, next) => {
  try {
    const press = await Press.findById(req.params.id);

    if (!press) {
      return res.status(404).json({
        success: false,
        message: "Press entry not found",
      });
    }

    await press.deleteOne();

    res.status(200).json({
      success: true,
      message: "Press entry deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};