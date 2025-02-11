
const User = require('../models/User.js');

module.exports = async (req, res, next) => {
  try {
    // Dikkat: session'da sakladığınız anahtarın isminin tutarlı olduğundan emin olun.
    // Örneğin, login fonksiyonunuzda req.session.userID olarak ayarlamışsınız.
    const user = await User.findById(req.session.userID);

    if (!user) {
      return res.redirect('/login');
    }

    next();
  } catch (error) {
    console.error(error);
    return res.redirect('/login');
  }
};
