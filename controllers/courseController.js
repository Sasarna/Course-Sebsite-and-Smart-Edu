const Course = require('../models/Course.js');
const Category = require('../models/Category.js');

exports.createCourse = async (req, res) => {
    try {
        const { name, description, category , user} = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            user: req.user._id,
        }; // Verileri parçala

        // 1. Kategori ObjectId'sini bul
        const foundCategory = await Category.findOne({ name: category });

        if (!foundCategory) {
            return res.status(404).json({
                status: 'fail',
                message: 'Kategori bulunamadı',
            });
        }

        // 2. Kursu ObjectId ile oluştur
        const course = await Course.create({
            name,
            description,
            category: foundCategory._id, // ÖNEMLİ: ObjectId kullanılıyor
            user,
        });

        res.status(200).redirect('/courses');
    } catch (error) {
        console.error("Kurs oluşturulurken hata:", error); // Hata ayıklama için log ekleyin
        res.status(400).json({
            status: 'fail',
            error: error.message, // Daha farklı hata mesajı gönderin
        });
    }
};

exports.getAllCourses = async (req , res) => {
    try {
        const categorySlug = req.query.categories;
        const category = await Category.findOne({slug:categorySlug})

        let filter = {};
        if(categorySlug) {
            filter = {category:category._id}
        }
        const courses = await Course.find(filter).sort({createdAt: -1});

        const categories = await Category.find();

        const user = req.user;
        res.status(200).render('courses' , {
            courses,
            categories,
            user,
            page_name: "courses"
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            error,
        });
    }
}

exports.getCourse = async (req , res) => {
    try {
        const course = await Course.findOne({slug: req.params.slug}).populate('user');

        res.status(200).render('course' , {
            course,
            page_name: 'courses',
        });
    }catch (error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
}
