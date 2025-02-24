const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware.js');
const authController = require('../controllers/authController.js');
const User = require('../models/User.js');

const router = express.Router();

router.route('/signup').post(
    [
        body('name').not().isEmpty().withMessage('Please Enter Your Name'),



        body('email').isEmail().withMessage('Please Enter Valid Email')
        .custom((userEmail) => {
            return User.findOne({ email: userEmail }).then(user => {
                if(user) {
                    return Promise.reject('E-mail already in use');
                }
            })
        }),



        body('password').not().isEmpty().withMessage('Please Enter Valid Password'),
    ],
    authController.createUser);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logOutUser);
router.route('/dashboard').get(authMiddleware , authController.getDashboardPage);
router.route('/:id').delete(authMiddleware , authController.deleteUSer);


module.exports = router;
