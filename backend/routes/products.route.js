const express = require("express");
const { 
  getAllProducts, 
  getProductById, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} = require("../controllers/product.controller");
const upload = require("../middlewares/upload.middleware");
const isAdmin = require("../middleware/isAdmin.middleware");
const authenticate = require("../middlewares/authenticate.middleware");

const router = express.Router();

router.get("/all", getAllProducts);
router.get("/:id", getProductById);

//for Admin 
router.post("/add",upload.array("images", 5),authenticate, isAdmin, addProduct);
router.put("/:id", upload.array("images", 5), authenticate, isAdmin, updateProduct);
router.delete("/:id", authenticate, isAdmin, deleteProduct);

module.exports = router;