const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Define os caminhos e associa aos controllers
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);

module.exports = router;