const router = require('express').Router();
const categoryController = require('../controllers/categoryController');

// O '/' aqui corresponde ao que definirmos no server.js (que será /categories)
router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);

module.exports = router;