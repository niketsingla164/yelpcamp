const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const joi = require('joi');
const Campground = require('../models/campground');
const Review = require('../models/review');
const expressError = require('../utils/Expresserror');
const flash = require('connect-flash');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { isLoggedIn , campgroundValidate , isCurrentuser} = require('../middleware');
const { storage } = require('../cloudinary');
const upload = multer({storage});
router.get('/',wrapAsync(campgrounds.index));

router.get('/id/:id',wrapAsync(campgrounds.showPage));

router.route('/new')
.get(isLoggedIn,campgrounds.renderNewForm)
.post(isLoggedIn,upload.array('image'),campgroundValidate,wrapAsync(campgrounds.createNewCampground));

router.get('/:id/edit',isLoggedIn,isCurrentuser,wrapAsync(campgrounds.renderEditForm));

router.patch('/:id',isLoggedIn,isCurrentuser,upload.array('image'), campgroundValidate,wrapAsync(campgrounds.saveEditCampground))

router.delete('/:id/delete',isLoggedIn,isCurrentuser,wrapAsync(campgrounds.deleteCampground));

module.exports = router;