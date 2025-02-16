const User = require('../models/User.js');

module.exports = async (req, _res, next) => {
  try {
    const userSession = await User.findById(req.session.userID);

    if (userSession) {
      req.user = userSession;
    }
    next();
  } catch (error) {
    console.error(error);
    next();
  }
}

