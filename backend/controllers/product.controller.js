const Product = require("../models/product.model");
const { z } = require("zod");
const cloudinary = require("../config/cloudinary.config");

const sizeSchema = z.array(
  z.object({
    size: z.string().min(1),
    countInStock: z.coerce.number().min(0)
  })
);

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(0),
  category: z.string().min(1),
  sizes: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON format for sizes" });
      return z.NEVER;
    }
  }).pipe(sizeSchema),
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.coerce.number().min(0).optional(),
  category: z.string().min(1).optional(),
  sizes: z.string().transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid JSON format for sizes" });
      return z.NEVER;
    }
  }).pipe(sizeSchema).optional(),
  existingImages: z.union([z.string().url(), z.array(z.string().url())]).optional(),
});



const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "artist_merch" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    
    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.addProduct = async (req, res, next) => {
  try {
    const parse = productSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parse.error.issues,
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "At least one image is required" });
    }

    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
    const imageUrls = await Promise.all(uploadPromises);

    const { name, description, price, category, sizes } = parse.data;

    const product = new Product({
      name,
      description,
      price,
      images: imageUrls,
      category,
      sizes,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.updateProduct = async (req, res, next) => {
  try {
    const parse = updateProductSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parse.error.issues,
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    let finalImages = [];
    const { existingImages, ...updateData } = parse.data;

    if (existingImages) {
      if (Array.isArray(existingImages)) {
        finalImages = [...existingImages];
      } else {
        finalImages.push(existingImages);
      }
    }

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer));
      const newImageUrls = await Promise.all(uploadPromises);
      finalImages = [...finalImages, ...newImageUrls];
    }

    if (finalImages.length === 0) {
      return res.status(400).json({ success: false, message: "A product must have at least one image" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { ...updateData, images: finalImages } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};