const express = require('express');
const pageController = require('../controllers/pageController.js');
const redirectMiddleware = require('../middleware/redirectMiddleware.js');
const contactFormAuto = require('../middleware/contactFormAutoMiddleware.js');

const router = express.Router();

router.route('/').get(pageController.getIndexPage);
router.route('/about').get(pageController.getAboutPage);
router.route('/contact').get(contactFormAuto, pageController.getContantPage);
router.route('/contact').post(pageController.sendEmail);
router.route('/register').get(redirectMiddleware , pageController.getRegisterPage);
router.route('/login').get(redirectMiddleware , pageController.getLoginPage);

module.exports = router;
