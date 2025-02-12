const User = require("../models/User.js");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userID);

    if (!user) {
      return res.redirect("/login");
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.redirect("/login");
  }
}
