const express = require('express');
const categoryController = require('../controllers/categoryController.js');

const router = express.Router();

router.route('/').post(categoryController.CreateCategory);
router.route('/:id').delete(categoryController.DeleteCategory);

module.exports = router;
