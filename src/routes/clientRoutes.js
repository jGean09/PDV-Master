const router = require('express').Router();
const clientController = require('../controllers/clientController');

router.get('/', clientController.getAllClients);
router.post('/', clientController.createClient);

module.exports = router;