const mongoose = require('mongoose');

const connectDB = (uri) => {
    return mongoose.connect(String(uri), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = connectDB;