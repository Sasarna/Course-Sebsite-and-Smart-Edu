const Category = require('../models/Category.js');

exports.CreateCategory = async (req , res) => {
    try{
        const category = await Category.create(req.body);
        req.flash('success' , 'Category Created Successfully');
        res.status(200).redirect('/users/dashboard');
    }catch(error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
}

exports.DeleteCategory = async (req , res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        req.flash('success' , `${category.name} Category Deleted Successfully`);
        res.status(200).redirect('/users/dashboard');
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error.message,
        });
    }
}
