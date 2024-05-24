const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;
const reviewSchema = Schema({
    rating : Number,
    review : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
});

const Review = mongoose.model('Review' , reviewSchema);

module.exports = Review;