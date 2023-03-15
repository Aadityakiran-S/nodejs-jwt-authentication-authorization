const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Credentials', CredentialSchema);