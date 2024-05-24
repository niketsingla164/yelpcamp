const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync');
const joi = require('joi');
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');
const expressError = require('../utils/Expresserror');
const reviews = require('../controllers/reviews')
const { reviewValidate , isLoggedIn, isReviewAuthor,isLoggedInReview } = require('../middleware');
router.post('/',isLoggedIn,reviewValidate,wrapAsync(reviews.createReview));
router.delete('/:review_id',isLoggedInReview,isReviewAuthor,wrapAsync(reviews.deleteReview))
module.exports = router;
