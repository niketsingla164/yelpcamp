
const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');
const { ref } = require('joi');
//baar baar mongoose.Schema use hoga to ek variable hi bnna liya
const Schema = mongoose.Schema;
const ImageSchema =new Schema({
    url : String,
    filename : String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})
const opts = { toJSON: { virtuals: true } };
const CampgroundSchema = new Schema({
    title : String,
    price : Number,
    description : String,
    location : String,
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
    image : [ImageSchema],
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
},opts);
CampgroundSchema.virtual('properties.popupMarkup').get(function(){
    return `<strong><a href = "/campground/id/${this._id}">${this.title}</a></strong>`;
})
CampgroundSchema.post('findOneAndDelete',async (doc)=>{
    if(doc){
        await Review.deleteMany({_id : {$in : doc.reviews}});
    }
})
const Campground = mongoose.model('Campground',CampgroundSchema);
module.exports = Campground;