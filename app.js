const express = require('express');
const app = express();
const routes = require('./routes/router.js');
const connectDB = require('./db/connect.js');
const { urlencoded } = require('express');
const { errorHandlingMiddleware } = require('./helpers/error-handling-helper.js');
require('dotenv').config();

//using the json parser middleware
app.use(express.json());

//Allowing middleware for error handling (custom)
app.use(errorHandlingMiddleware);

//Setting up routes
app.use('/api/v1/users', routes);

const port = process.env.PORT || 3000;
const start = async (mongoURI) => {
    try {
        await connectDB(mongoURI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}....`);
        })
    }
    catch (err) {
        console.log(err);
    }
};

start(process.env.MONGO_URI);

module.exports = app;