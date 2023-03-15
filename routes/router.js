const express = require('express');
const router = express.Router();
const { debug_deleteUser, signUpUser, loginUser, debug_getAllUsers } = require('../controller/api-requests.js');

router.route('/').get(debug_getAllUsers).delete(debug_deleteUser);
router.route('/login').get(loginUser);
router.route('/signup').post(signUpUser);

module.exports = router;