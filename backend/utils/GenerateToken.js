const jwt = require("jsonwebtoken");

const generateToken = (user, res) => {
    const payload = {
        _id: user._id,
        user_id: user.user_id,
        username: user.username,
        createdAt: user.createdAt,
    };

    const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
        expiresIn: '1h',
    });

    res.cookie('jwt', token, {
        httpOnly: false,
        sameSite: 'lax',
        secure: false, // TRUE IN PROD
        maxAge: 1000 * 60 * 60 // 1 HOUR
    });

    return token;
};

module.exports = generateToken;
