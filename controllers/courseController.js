const Course = require('../models/Course.js');
const Category = require('../models/Category.js');
const User = require('../models/User.js');

exports.createCourse = async (req, res) => {
    try {
        const { name, description, category , user} = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            user: req.user._id,
        }; // Verileri parçala

        //* Kategori ObjectId'sini bul
        const foundCategory = await Category.findOne({ name: category });

        if (!foundCategory) {
            return res.status(404).json({
                status: 'fail',
                message: 'Kategori bulunamadı',
            });
        }

        //* Kursu ObjectId ile oluştur
        const course = await Course.create({
            name,
            description,
            category: foundCategory._id, //! ObjectId kullanılıyor
            user,
        });
        req.flash("success" ,  `${name} Course created Successfully.`);
        res.status(200).redirect('/courses');
    } catch (error) {
        req.flash("success" ,`${req.body.name} Course created Successfully.`);
        res.status(400).redirect('/courses');
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const categorySlug = req.query.categories;
        const query = req.query.search;

        let category = null;
        if (categorySlug) {
            category = await Category.findOne({ slug: categorySlug });
        }

        let searchConditions = [];

        if (query) {
            searchConditions.push({ name: { $regex: '.*' + query + '.*', $options: 'i' } });
        }
        if (category) {
            searchConditions.push({ category: category._id });
        }

        const courses = await Course.find(
            searchConditions.length > 0 ? { $or: searchConditions } : {}
        ).sort('-createdAt').populate('user');

        const categories = await Category.find();
        const user = req.user;

        res.status(200).render('courses', {
            courses,
            categories,
            user,
            page_name: "courses",
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            error: error.message,
        });
    }
};


exports.getCourse = async (req , res) => {
    try {
        const user = await User.findById(req.session.userID);
        const course = await Course.findOne({slug: req.params.slug}).populate('user');

        res.status(200).render('course' , {
            course,
            user,
            page_name: 'courses',
        });
    }catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
}

exports.enrollCourse = async (req , res) => {
    try {
        const user = await User.findById(req.session.userID);
        await user.courses.push({_id: req.body.course_id});
        await user.save();

        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
}

exports.releaseCourse = async (req , res) => {
    try {
        const user = await User.findById(req.session.userID);
        await user.courses.pull({_id: req.body.course_id});
        await user.save();

        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
}

exports.deleteCourse = async (req , res) => {
    try {

        const course =  await Course.findOneAndDelete({slug:req.params.slug}); //* http://localhost:3100/courses/go-lang
        const usersToUpdate = await User.find({courses: course._id});
        const courseCreateTeacher = await User.findById(course.user);

        for(let i = 0 ; i < usersToUpdate.length; i++){
            await usersToUpdate[i].courses.pull({_id: course._id});
            await usersToUpdate[i].save();
        }

        if(courseCreateTeacher) {
            await courseCreateTeacher.courses.pull(course._id);
            await courseCreateTeacher.save();
        }
        req.flash('success' , `${course.name} Course deleted successfully.`);
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
}
