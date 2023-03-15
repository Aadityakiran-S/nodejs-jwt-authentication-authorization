const userSchema = require('../models/models.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtHelper = require('../helpers/jwt-helper.js');
require('dotenv').config();

const signUpUser = async (req, res) => {
    let { username: givenUsername, password: givenPswd, email: givenEmail } = req.body;
    try {
        //Check if username already taken
        const userAlreadyExisting = await userSchema.findOne({ username: givenUsername });
        if (userAlreadyExisting) {
            return res.status(500).json({ msg: `Name ${givenUsername} already taken. Try to be original won't ya?` });
        }

        //Check if email is already in use
        const emailAlreadyExisting = await userSchema.findOne({ email: givenEmail });
        if (emailAlreadyExisting) {
            console.log(emailAlreadyExisting);
            return res.status(500).json({ msg: `emailID ${givenEmail} already in use. Don't steal from a brother` });
        }

        //Check if email is valid
        if (!isValidEmail(givenEmail)) {
            return res.status(500).json({ msg: `Please enter valid email` });
        }

        //// #TOASK : Suppose I wanna test just this thing, how do I exit this function without giving any promise?
        if (!validatePassword(givenPswd)) {
            return res.status(500).json({ msg: `Password must be 8 char long, at least one each upper case and lowercase letter, one number, one special char (@$!%*?&) and nothing else` });
        }

        //#TOASK : I think email should be encrypted in a way that only the website admin can dcrypt it right? So that would mean that using bcrypt isn't the right way right?

        const hashedPswd = encryptPassWord(givenPswd);
        const encryptedUser = { username: givenUsername, password: hashedPswd, email: givenEmail };

        const newUser = await userSchema.create(encryptedUser);
        return res.status(200).json({ success: true, data: { usr: newUser } })
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

const loginUser = async (req, res) => {
    let { username: givenUsername, password: givenPswd } = req.body;
    try {
        //Check if user infact exists
        const user = await userSchema.findOne({ username: givenUsername });
        if (!user) {
            return res.status(404).json({ msg: `User with name ${givenUsername} DNE` });
        }

        //Check if given password matches
        if (!await bcrypt.compare(givenPswd, user.password)) {
            return res.status(500).json({ msg: `Passwords don't match. Are you trynna hack?` });
        }

        // //#TODO Token generation
        const ourAccessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRATION_DURATION });
        return res.status(200).json({ success: true, data: { user }, accessToken: ourAccessToken });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

//#region Debug functions
const debug_getAllUsers = async (req, res) => {
    try {
        let users = await userSchema.find({});
        return res.status(200).json({ success: true, data: { usrs: users }, count: users.length });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

const debug_getUserAuth = async (jwtHelper, req, res) => {
    // let users;
    // try {
    //     users = await userSchema.find({});
    //     let userInfo = users.filter(user => user.username == req.params);
    //     return res.status(200).json({ data: userInfo });
    // } catch (error) {
    //     return res.status(500).json({ msg: error.message });
    // }
}

const debug_deleteUser = async (req, res) => {
    const { id: givenID } = req.params;
    try {
        const toBeDeletedUser = await userSchema.findOneAndDelete({ _id: givenID });
        if (!toBeDeletedUser) {
            return res.status(404).json({ msg: `User with name ${username} DNE` });
        }
        return res.status(200).json({ success: true, data: { usr: toBeDeletedUser } })
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}
//#endregion

//#region Helper Functions

const validatePassword = (password) => {
    //Password must be 8 char long, at least one each upper case and lowercase letter, one number, one special char (@$!%*?&) and nothing else
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const encryptPassWord = async (password) => {
    let salt; let hashedPswd;
    try {
        salt = await bcrypt.genSalt(10);
    } catch (error) {
        console.log(error);
        return;
    }
    try {
        hashedPswd = await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }

    return hashedPswd;
}

//#endregion
module.exports = { debug_getAllUsers, signUpUser, loginUser, debug_deleteUser, debug_getUserAuth }