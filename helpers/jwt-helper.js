const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
    const tokenUser = { username: user.username, hash: user.password, email: user.email };
    const ourAccessToken = jwt.sign(tokenUser, process.env.ACCESS_TOKEN_SECRET);
    return ourAccessToken;
}

const verifyAccessToken = (req, res, next) => {

    console.log("Hello")

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //If auth header exists, just return the header otherwise return undefined
    if (token == null) {
        res.status(401).json({ msg: "Where's your token? Boy!" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({ msg: "Your token is invalid. Stop trynna hack!" });
        }
        req.user = user;
        next();
    })
}

module.exports = { verifyAccessToken, generateAccessToken };