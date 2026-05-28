const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();


router.post("/login",authController.login);
router.post("/register",authController.register);
router.post("/logout",authController.logout);
router.get("/profile",authMiddleware,authController.getCurrentUser);

router.post("/register/admin",authController.registerAdmin);

module.exports = router;
