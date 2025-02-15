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

        res.status(200).redirect('/courses');
    } catch (error) {
        console.error("Kurs oluşturulurken hata:", error); //* Hata ayıklama için log ekleyin
        res.status(400).json({
            status: 'fail',
            error: error.message, //* Daha farklı hata mesajı gönderin
        });
    }
};

// exports.getAllCourses = async (req , res) => {
//     try {
//         const categorySlug = req.query.categories;

//         const query = req.query.search;

//         const category = await Category.findOne({slug:categorySlug})

//         let filter = {};
//         if(categorySlug) {
//             filter = {category:category._id}
//         }

//         if(query) {
//             filter = {name:query}
//         }

//         if(!query && !categorySlug) {
//             filter.name = "",
//             filter.category = null
//         }

//         const courses = await Course.find(
//             $or,[
//                 {name : {$regex: '.*' + filter.name + '.*' , $options: 'i'}},
//                 {category: filter.category}

//             ]
//         ).sort({createdAt: -1});
//         const categories = await Category.find();

//         const user = req.user;
//         res.status(200).render('courses' , {
//             courses,
//             categories,
//             user,
//             page_name: "courses"
//         });
//     } catch (error) {
//         res.status(400).json({
//             status: "fail",
//             error,
//         });
//     }
// }

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
