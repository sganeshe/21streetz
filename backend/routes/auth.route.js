const express = require('express');
const {login , register, logout, getCurrentUser,registerAdmin} = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth.middleware');

const router = express.Router();


router.post("/login",login);
router.post("/register",register);
router.post("/logout",logout);
router.get("/profile",authenticate,getCurrentUser);

router.post("/register/admin",registerAdmin);

module.exports = router;