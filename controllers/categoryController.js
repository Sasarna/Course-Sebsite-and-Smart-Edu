const Category = require('../models/Category.js');

exports.CreateCategory = async (req , res) => {
    try{
        const category = await Category.create(req.body);
        res.status(200).json({
            status: 'successfull',
            category
        })
    }catch(error) {
        res.status(400).json({
            status: 'fail',
            error,
        });
    }
}
