const { model } = require('mongoose');
const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapbox_Token = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken : mapbox_Token});
module.exports.index = async(req,res)=>{
    const camp = await Campground.find();
   res.render('Campground/index',{camp,who : 'campground'});
};
module.exports.showPage = async (req,res)=>{
    const foundcamp = await Campground.findById(req.params.id).populate({
        path : 'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author');
    
    if(!foundcamp){
      req.flash('error','Not found this Campground');
      return res.redirect('/campground');
    }
   res.render('Campground/show',{foundcamp,who : "show"});
}

module.exports.renderNewForm = (req,res)=>{
    res.render('Campground/new',{who : "new"});
 }

 module.exports.createNewCampground = async (req,res)=>{
    const geoData = await geoCoder.forwardGeocode({
        query : req.body.location,
        limit : 1
      }).send()
    const { title , location , price , description } = req.body;
    const newcamp = new Campground({title : title , location : location,price : price , description : description,author : req.user});
    newcamp.image = req.files.map(f =>{
     return {
         url : f.path,
         filename : f.filename
     }
    });
    newcamp.geometry = geoData.body.features[0].geometry;
    await newcamp.save();
    req.flash('success' ,'Successfully add a new Campground');
    res.redirect(`/campground/id/${newcamp._id}`);
}

module.exports.renderEditForm = async (req,res)=>{
    const camp = await Campground.findById(req.params.id);
    res.render('Campground/edit',{ camp , who : "edit"});
}

module.exports.saveEditCampground = async (req,res)=>{
    const { title , location, price , description , deleteimages} = req.body;
    
    const campground = await Campground.findByIdAndUpdate({_id : req.params.id},{title : title , location : location,price : price , description : description});
    const img = req.files.map(f =>{
        return {
            url : f.path,
            filename : f.filename
        }
       });
    campground.image.push(...img);
    await campground.save();
    if(deleteimages && deleteimages.length > 0){
        for(let filename of deleteimages){
            cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull : {image : {filename : {$in : deleteimages}}}});
    }
    req.flash('success' ,'Successfully updates changes in Campground');
    return res.redirect(`/campground/id/${req.params.id}`);
 }

 module.exports.deleteCampground = async (req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success' ,'Successfully deleted Campground');
    res.redirect('/campground');
}