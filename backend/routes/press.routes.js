const express = require("express");
const router = express.Router();
const { addPress, getAllPress, updatePress, deletePress } = require("../controllers/press.controller");


const authenticate = require("../middlewares/auth.middleware"); 
const upload = require("../middlewares/upload.middleware"); 

const isAdmin = require("../middlewares/isAdmin.middleware");


router.get("/", getAllPress);


router.post("/add", authenticate,isAdmin, upload.single("image"), addPress);
router.put("/:id", authenticate, isAdmin, upload.single("image"), updatePress);
router.delete("/:id", authenticate, isAdmin, deletePress);

module.exports = router;