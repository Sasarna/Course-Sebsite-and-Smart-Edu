const Course = require('../models/Course.js');

exports.createCourse = async (req , res) => {
    const course = await Course.create(req.body);

    try {
        res.status(200).json({
            status: 'succesfull',
            course,
        })
    } catch {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
}
