const User = require('../models/User.js');
const bcrypt = require('bcrypt');

exports.createUser = async (req , res) => {
    try{
        const user = await User.create(req.body);
        res.status(200).json({
            status: 'successfull',
            user
        })
    }catch(error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
}

exports.loginUser = async (req , res) => {
    try{
        const {email , password} = req.body;
        const user = await User.findOne({ email });
        if (user) {
            const same = await bcrypt.compare(password, user.password);
            if (same) {
                //! user session
                req.session.userID = user._id;
                res.status(200).redirect('dashboard');
            } else {
                res.status(400).send('Invalid credentials');
            }
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch(error) {
        res.status(400).json({
            status: 'fail',
            error
        })
    }
}

exports.logOutUser = async (req , res) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}

exports.getDashboardPage = async (req , res) => {
    const user = await User.findOne({_id: req.session.userID});
    res.status(200).render('dashboard' , {
        page_name: "dashboard",
        user
    });
}
