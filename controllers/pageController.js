const nodemailer = require('nodemailer');
const Course = require('../models/Course.js');
const User = require('../models/User.js');

exports.getIndexPage = async (req, res) => {
    const course = await Course.find().sort('-createdAt').limit(2);
    const totalCourse = await Course.find().countDocuments();
    const totalStudents = await User.countDocuments({role: 'student'});
    const totalTeachers = await User.countDocuments({role: 'teacher'});

    res.status(200).render('index', {
        page_name: "index",
        course,
        totalCourse,
        totalStudents,
        totalTeachers,
    });
}

exports.getAboutPage = (req, res) => {
    res.status(200).render('about', {
        page_name: "about"
    });
}

exports.getRegisterPage = (req, res) => {
    res.status(200).render('register', {
        page_name: "register"
    });
}

exports.getLoginPage = (req, res) => {
    res.status(200).render('login', {
        page_name: "login"
    });
}

exports.getContantPage = (req, res) => {
    res.status(200).render('contact', {
        user: req.user,
        page_name: "contact",
    });
}

exports.sendEmail = async (req, res) => {

    try {


        const outputMessage = `
        <h1>MAİL Details</h1>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
        </ul>
        <h1>Messsages</h1>
        <p>${req.body.message}</p>
    `;

        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: "zoe.lockman78@ethereal.email",
                pass: "YhHMCCz8b2mW4YDKaF",
            },
        });

        // async..await is not allowed in global scope, must use a wrapper

        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Smart Edu Contact Form" <zoe.lockman78@ethereal.email>', // sender address
            to: req.body.email, // list of receivers
            subject: "NEW Message Smart Edu Contact Form", // Subject line
            text: "Hello world?", // plain text body
            html: outputMessage, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
        req.flash("success" , "Your message has been sent successfully");
        res.status(200).redirect('contact');
    } catch (error) {
        req.flash("error" , "Your message has not been sent successfully");
        res.status(200).redirect('contact');
    }
}
