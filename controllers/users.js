const User = require('../models/user');
module.exports.registerUserForm = (req,res)=>{
    res.render('user/register',{who : "login"});
 }

 module.exports.registerUser = async (req,res,next)=>{
    try{
     const {email , username , password} = req.body;
     const newUser = new User({email : email , username : username});
     const registerUser = await User.register(newUser,password);
     registerUser.save();
     req.login(registerUser,(err)=>{
        if(err)return next(err);
        req.flash('success','welcome to yelpcamp');
        return res.redirect('/campground');
     })
    }catch(e){
      req.flash('error',e.message);
      res.redirect('register');
    }
}

module.exports.loginUserForm = async (req,res)=>{
    res.render('user/login',{who : "login"});
};

module.exports.loginUser = async (req,res)=>{
    req.flash('success','welcome back');
    const redirectUrl = res.locals.returnTo || '/campground';
    return res.redirect(redirectUrl);
}

module.exports.logoutUser = (req,res,next)=>{
    req.logOut(err => {
       if(err) return next(err);
       else{
        req.flash('success','Successfully log out');
        res.redirect('/campground');
       }
    }); 
}