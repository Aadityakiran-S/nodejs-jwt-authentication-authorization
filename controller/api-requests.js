const credSchema = require('../models/models.js');

const signUpUser = async (req, res) => {
    let { username: givenName, password: givenPswd, email: givenEmail } = req.body;
    try {
        //Check if username already taken
        const userAlreadyExisting = await credSchema.findOne({ username: givenName });
        if (userAlreadyExisting) {
            return res.status(500).json({ msg: `Name ${givenName} already taken. Try to be original won't ya?` });
        }

        //#TOASK : Suppose I wanna test just this thing, how do I exit this function without giving any promise?
        if (!validatePassword(givenPswd)) {
            return res.status(500).json({ msg: `Password must contain min 8 char, at least one special char, at least one smallcase, at least one upper case and at least one number` });
        }

        //#TODO Check if email is valid
        if (!isValidEmail(givenEmail)) {
            return res.status(500).json({ msg: `Please enter valid email` });
        }

        //#TODO Encrypt password

        const newUser = await credSchema.create(req.body);
        return res.status(200).json({ success: true, data: { usr: newUser } })
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

const loginUser = async (req, res) => {
    let { username: givenName, password: givenPswd } = req.body;
    try {
        //Check if user infact exists
        const user = await credSchema.findOne({ username: givenName });
        if (!user) {
            return res.status(404).json({ msg: `User with name ${givenName} DNE` });
        }

        if (user.password !== givenPswd) {
            return res.status(500).json({ msg: `Passwords don't match. Are you trynna hack?` });
        }

        //#TODO Token generation

        return res.status(200).json({ success: true, data: { user } })
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

//#region Debug functions
const debug_getAllUsers = async (req, res) => {
    try {
        let users = await credSchema.find({});
        return res.status(200).json({ success: true, data: { usrs: users }, count: users.length });
    }
    catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

const debug_deleteUser = async (req, res) => {
    const { username: givenName } = req.params;
    try {
        const toBeDeletedUser = await credSchema.findOneAndDelete({ username: givenName });
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
    //Password must be 8 char long, at least one letter, one number, one special char
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
}

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
//#endregion

module.exports = { debug_getAllUsers, signUpUser, loginUser, debug_deleteUser }