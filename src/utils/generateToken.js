const jwt = require("jsonwebtoken");
const env = require("../config/env.js");


const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role, },

        env.accesstoken,          

        { expiresIn: "7d", },
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, env.accesstoken);
};

module.exports = { generateToken, verifyToken };