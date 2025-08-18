const jwt = require('jsonwebtoken');
const User = require("../models/UserSchema");

const getUserFromToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "NO TOKEN PROVIDED" });
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);

        if (!decodedToken) {
            return res.status(401).json({ message: "UNAUTHORIZED AKBAR"})
        }

        const user = await User.findOne({ _id: decodedToken._id });
        if (!user) {
            return res.status(404).json({ message: "USER NOT FOUND" });
        }

        req.user = user;  // ATTACH USER TO REQ OBJECT 'req.user'
        next();  // pass control to next route/middleware, no responses
    } catch (err) {
        // COMMENTED OUT B/C IT IS ANNOYING IN CONSOLE WHEN USER NOT
        // LOGGED IN FOR THE FIRST TIME
        // console.error(err);
        return res.status(401).json({ message: "INVALID OR EXPIRED TOKEN" });
    }
};


module.exports = getUserFromToken;
