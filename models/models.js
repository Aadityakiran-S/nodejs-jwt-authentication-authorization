const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'must provide username'],
        trim: true,
        maxlength: [30, 'username cannot be more than 30 char long']
    },
    password: {
        type: String,
        required: [true, 'must provide password'],
        trim: false,
    },
    email: {
        type: String,
        required: [true, 'must provide email'],
        trim: true,
    }
})

userSchema.pre('save', async function (next) {
    try {
        // console.log('Called before user is being saved');
        next(); //#TOASK: Where does this next() go? Don't we need to pass this as middleware somewhere for this to be called in the first place? 
    } catch (error) {
        next(error);
    }
})

userSchema.post('save', async function (next) {
    try {
        // console.log('Called after user is saved')
    } catch (error) {
        next(error);
    }
})

module.exports = mongoose.model('credentials', userSchema, 'credentials');