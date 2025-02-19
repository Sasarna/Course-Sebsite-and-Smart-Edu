const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const Category = require('../models/Category.js');
const Course = require('../models/Course.js');
const { validationResult } = require('express-validator');

exports.createUser = async (req , res) => {
    try{
        const user = await User.create(req.body);
        res.status(200).redirect('/login');
    }catch(error) {
        const result = validationResult(req);


        if (!result.isEmpty()) {
            req.flash("error", result.array().map(err => err.msg)); // Mesajları dizi olarak ekle
        }
        res.status(400).redirect('/register');
        console.log(result.array()); // Hata mesajlarını görmek için

        // for(let i = 0; i < result.array().length; i++) {
        //     // req.flash("error", result.array()[i].msg); // Hata mesajlarını al
        //     req.flash("error", result.array().map(err => err.msg));
        // }

        //! bu sadece daha genel hata mesajları için "Kayıt İşlemi Başarısız Lütfen Yeniden Deneyiniz!" gibi.
        //! this is just for more general error messages like "Registration Failed Please Try Again!"
        // req.flash("error", "Kayıt İşlemi Başarısız Lütfen Yeniden Deneyiniz!");
        // if(result.isEmpty()) {
        //     return res.status(400).send('kayıt başarısız');
        // }
        // req.flash("error" , `Kayıt İşlemi Başarısız Lütfen Yeniden Deneyiniz!`);
        // res.status(400).redirect('/register');
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
                req.flash("success" , "Welcome to the website!")
                res.status(200).redirect('dashboard');
            } else {
                req.flash("error" , "Password is incorrect!");
                res.status(200).redirect('/login');
            }
        } else {
            req.flash("error" , "There is no such user!")
            res.status(200).redirect('/login');
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
    const user = await User.findOne({_id:req.session.userID}).populate('courses');
    const categories = await Category.find();
    const courses = await Course.find({user:req.session.userID});
    res.status(200).render('dashboard' , {
        page_name: "dashboard",
        user,
        categories,
        courses,
    });
}
