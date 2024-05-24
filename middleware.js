
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error','you must be signed in ');
    return res.redirect('/user/login');
 }
   next();
}

module.exports.storeReturnTo = (req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
 const expressError = require('./utils/Expresserror');
 const joi = require('./joisanitize');
module.exports.campgroundValidate = (req,res,next)=>{
    const campgroundValidate = joi.object({
        title : joi.string().required().escapeHTML(),
        location : joi.string().required().escapeHTML(),
        price :  joi.number().required().min(0),
        description :  joi.string().required().escapeHTML(),
        deleteimages : joi.array(),
        geometry : joi.object({
            type : joi.string().required().escapeHTML(),
            coordinates : joi.array().required()
        })
     })
     const {error} = campgroundValidate.validate(req.body);
     if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg,400)
     }
     else{
        next();
     }   
}

const Campground = require('./models/campground');
module.exports.isCurrentuser = async (req,res,next)=>{
   const campground = await Campground.findById(req.params.id);
   if(!campground.author.equals(req.user._id)){
      req.flash('error','you do not have permission to do that');
      return res.redirect(`/campground/id/${campground._id}`);
   }
   next();
}
const Review = require('./models/review');
module.exports.reviewValidate = (req,res,next)=>{
    const review = joi.object({
        rating : joi.number().required().min(1).max(5),
        review : joi.string().required().escapeHTML()
    });
    const {error} = review.validate(req.body);
    if(error){
        const msg = error.details.map((el)=>el.message).join(',');
        throw new expressError(msg,400);
    }
    else{
        next();
    }
}
module.exports.isLoggedInReview = (req,res,next)=>{
    const {id} = req.params;
    if(!req.isAuthenticated()){
        req.session.returnTo = `/campground/id/${id}`;
        req.flash('error','you must be signed in ');
       return res.redirect('/user/login');
    }
    next();
}
module.exports.isReviewAuthor = async (req,res,next)=>{
    const {review_id,id} = req.params;
    const review = await Review.findById(review_id);
    if(!review.author.equals(req.user._id)){
       req.flash('error','you do not have permission to do that')
       return res.redirect(`/campground/id/${id}`);
    } 
    next();
}
module.exports.userValidate = (req,res,next)=>{
    const userValidate = joi.object({
        username : joi.string().required().escapeHTML(),
        password : joi.string().required().escapeHTML(),
        email : joi.string().required().escapeHTML()
    })
    const { error } = userValidate.validate(req.body);
    if(error){
        const msg = error.details.map((el)=>el.message).join(',');
        throw new expressError(msg,400);
    }
    else next();
}
const passport = require('passport');
module.exports.authenticate = passport.authenticate('local',{
    failureFlash : true,
    failureRedirect : 'login'
})