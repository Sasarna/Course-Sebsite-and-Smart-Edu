const Course = require('../models/Course.js');

exports.createCourse = async (req , res) => {
    try {
        const course = await Course.create(req.body);
        res.status(200).json({
            status: 'succesfull',
            course,
        })
    } catch(error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
}

exports.getAllCourses = async (req , res) => {
    try {
        const courses = await Course.find();
        res.status(200).render('courses' , {
            courses,
            page_name: "courses"
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
    }
}
