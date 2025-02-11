
module.exports = async (req, res, next) => {
    try {

        if (req.session.userID) {
            return res.redirect('/');
        }

        next();
    } catch (error) {

        console.error(error);
        return res.redirect('/');

    }
};
