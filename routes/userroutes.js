const express = require('express');
const router = express.Router();
const joi = require('joi');
const expressError = require('../utils/Expresserror');
const wrapAsync = require('../utils/wrapAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');
const { storeReturnTo,userValidate , authenticate } = require('../middleware');

router.route('/register')
  .get(users.registerUserForm)
  .post(userValidate,wrapAsync(users.registerUser));

router.route('/login')
 .get(wrapAsync(users.loginUserForm))
 .post(storeReturnTo,authenticate,wrapAsync(users.loginUser));

router.get('/logout',users.logoutUser);

module.exports = router;