if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();

const path = require('path');
const joi = require('joi');
const ejsmate = require('ejs-mate');
const method_override = require('method-override');
const campgroundRoute = require('./routes/campgroundroutes');
const reviewRoute = require('./routes/reviewroutes');
const userRoute = require('./routes/userroutes');
const mongoose = require('mongoose');
const Review = require('./models/review');
const Campground = require('./models/campground');
const User = require('./models/user');

const db_URL = 'mongodb://127.0.0.1:27017/yelp-camp';
//const db_URL = process.env.DB_URL;
mongoose.connect(db_URL);
const expressError = require('./utils/Expresserror');
const wrapAsync = require('./utils/wrapAsync');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongodbStore = require('connect-mongo');
const { scriptSrcUrls, styleSrcUrls, connectSrcUrls, fontSrcUrls } = require('./helmetsecurity')
const passportLocalMongoose = require('passport-local-mongoose');
const { name } = require('ejs');
const db = mongoose.connection;
 db.on("error",console.error.bind(console,":connection error"));
 db.once("open",()=>{
     console.log("DATABASE CONNECTED");
 })
const store = MongodbStore.create({
    mongoUrl: db_URL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
 app.set('view engine','ejs');
 app.set('views',path.join(__dirname,'views')); 
app.engine('ejs',ejsmate);
app.use(helmet())
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dure7aut4/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
                "https://cdn-icons-png.flaticon.com/",
                "https://github.githubassets.com/",
                "https://plus.unsplash.com/",
                "https://th.bing.com/"

            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(mongoSanitize());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(method_override('_method'));

const sessionConfig = {
    store,
    name : 'session', 
    secret : "topsecret",
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/campground',campgroundRoute);
app.use('/campground/:id/reviews',reviewRoute);
app.use('/user',userRoute);
app.use(express.static('public'));
app.get('/',(req,res)=>{
    res.render('home');
})
app.get('*',(req,res)=>{
    throw new expressError('page not found',400);
})
app.use((err,req,res,next)=>{
    if(!err.status)err.status = 500;
    if(!err.message)err.message = "Something Went Wrong";
    res.status(err.status).render('error',{err,who : "error"});
})

app.listen(1000,()=>{
    console.log("listen on port number 1000");
})