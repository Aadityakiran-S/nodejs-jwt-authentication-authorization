const express = require('express');
const router = express.Router();
const { debug_deleteUser, signUpUser, loginUser, debug_getAllUsers, debug_getUserAuth } = require('../controller/api-requests.js');
const { verifyAccessToken } = require('../helpers/jwt-helper.js');

router.route('/').get((req, res, next) => { console.log("Hello"); next(); }, debug_getAllUsers);
router.route('/login').get(loginUser);
router.route('/signup').post(signUpUser);
router.route('/:id').get(verifyAccessToken, debug_getUserAuth).delete(debug_deleteUser);

module.exports = router;