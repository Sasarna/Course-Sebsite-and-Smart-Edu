const express = require('express');
const courseController = require('../controllers/courseController.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');

const router = express.Router();

router.route('/').post(roleMiddleware(['teacher' , 'admin']) , courseController.createCourse);
router.route('/').get(courseController.getAllCourses);
router.route('/:slug').get(courseController.getCourse);

module.exports = router;

