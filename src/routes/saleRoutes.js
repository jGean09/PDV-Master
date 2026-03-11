const router = require('express').Router();
const saleController = require('../controllers/saleController');

router.post('/', saleController.createSale);
router.get('/', saleController.getSalesReport);

module.exports = router;