
module.exports = (roles) => {
    return (req , res , next) => {
        const userRole = req.user.role;
        if(roles.includes(userRole)) {
            next();
        } else {
            return res.status(401).send('YOU CAN DO IT!');
        }
    }
}
