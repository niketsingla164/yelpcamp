const Campground = require('../models/campground')
const Review = require('../models/review');
module.exports.createReview = async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    const {rating , review } = req.body;
    const newReview = new Review({rating : rating , review : review});
    newReview.author = req.user;
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save();
    req.flash('success' ,'Successfully create a review');
    return res.redirect(`/campground/id/${camp._id}`);
}

module.exports.deleteReview = async (req,res)=>{
    await Campground.findByIdAndUpdate(req.params.id,{$pull : {reviews : req.params.review_id} })
    await Review.findByIdAndDelete(req.params.review_id);
    req.flash('success' ,'Successfully delete a review');
    return res.redirect(`/campground/id/${req.params.id}`);
 }

 // const deleteReview = async (req,res,next)=>{
//     const {reviews} = await Campground.findById(req.params.id).populate('reviews');
//     if(reviews.length){
//         for(let r of reviews){
//            await Review.findByIdAndDelete(r._id);
//         }
//     }
//     next();
// }