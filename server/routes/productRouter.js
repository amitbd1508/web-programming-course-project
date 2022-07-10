const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();


router.post('/', productController.save);
router.get('/', productController.getProducts);
router.delete('/:productId', productController.deleteById);
//router.put('/:productId', productController.edit)


module.exports = router;