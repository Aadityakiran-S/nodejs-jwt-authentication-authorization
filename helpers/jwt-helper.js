const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
    const tokenUser = { username: user.username, hash: user.password, email: user.email };
    const ourAccessToken = jwt.sign(tokenUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION_DURATION });
    return ourAccessToken;
}

//#TOASK : How to write this as a middleware?
const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //If auth header exists, just return the header otherwise return undefined
    if (token == null) {
        res.status(401).json({ msg: "Where's your token? Boy!" });
    }
    try {
        const decryptUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decryptUser.username !== req.params.id) {
            return res.status(401).json({ msg: `You are using ${decryptUser.username}'s token. How dare you?` });
        }
        req.user = decryptUser;
        next(); //#TOASK : How to pass this as parameter in next() is that required? 
    } catch (error) {
        return res.status(401).json({ msg: "Your token is invalid. Stop trynna hack!" });
    }
}

module.exports = { verifyAccessToken, generateAccessToken };