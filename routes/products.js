const express = require('express');
const router = express.Router();

// controllers
const {
    getAllProductsStatic,
    getAllProducts
} = require('../controllers/products');

router.route('/').get(getAllProducts);
router.route('/static').get(getAllProductsStatic);

module.exports = router