const bcrypt = require('bcrypt');

const isValidPassword = (password) => {
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

module.exports = { isValidPassword, isValidEmail, encryptPassWord }