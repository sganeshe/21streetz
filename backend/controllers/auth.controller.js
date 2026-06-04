const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const JWT_SECRET = process.env.JWT_SECRET || 'secret';


const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  phone: z.string().min(10).max(15), 
  role: z.enum(["ADMIN", "CUSTOMER"]).optional(),
});

const adminRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  phone: z.string().min(10).max(15),
  role: z.enum(["ADMIN", "CUSTOMER"]).optional(),
  adminSecret: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


module.exports.register = async (req, res, next) => {
  try {
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parse.error.issues,
      });
    }

    const { email, password, name, phone } = parse.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // Fixed bcrypt async method
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      name,
      phone,
      role: "CUSTOMER",
      hashedPassword,
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }, // Don't send hashed password back
      token,
    });

  } catch (err) {
    next(err);
  }
};

module.exports.registerAdmin = async (req, res, next) => {
  try {
    const parse = adminRegisterSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parse.error.issues,
      });
    }

    const { email, password, name, phone, adminSecret } = parse.data;
        
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin secret",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      name,
      phone,
      role: "ADMIN", 
      hashedPassword,
    });
    
    await user.save();
    
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role }, 
      token,
    });

  } catch (err) {
    next(err);
  }
};


module.exports.login = async (req, res, next) => {
  try {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid request data",
        errors: parse.error.issues,
      });
    }

    const { email, password } = parse.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    next(err);
  }   
};

module.exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-hashedPassword");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (err) {
    next(err);
  }
};