const express = require('express');
const courseController = require('../controllers/courseController.js');
const authMiddleware = require('../middleware/authMiddleware.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');

const router = express.Router();

router.route('/').post(authMiddleware, roleMiddleware(['teacher', 'admin']), courseController.createCourse);
router.route('/').get(authMiddleware , courseController.getAllCourses);
router.route('/:slug').get(authMiddleware , courseController.getCourse);
router.route('/:slug').delete(authMiddleware , courseController.deleteCourse);
router.route('/:slug').put(authMiddleware , courseController.updateCourse);
router.route('/enroll').post(authMiddleware , courseController.enrollCourse);
router.route('/release').post(authMiddleware , courseController.releaseCourse);

module.exports = router;
