const express = require('express');
const categoryController = require('../controllers/categoryController.js');

const router = express.Router();

router.route('/').post(categoryController.CreateCategory);

module.exports = router;
