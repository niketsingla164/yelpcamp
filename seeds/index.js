const mongoose = require('mongoose');
const cities = require('./indianCities');
const {imgdup} = require('../images');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const db_URL = process.env.DB_URL;// || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect('mongodb+srv://niketsingla164:niket164@yelp.jnhfoxc.mongodb.net/?retryWrites=true&w=majority&appName=yelp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const text = "is a land of diverse landscapes and natural beauty, offering numerous picturesque campgrounds perfect for nature enthusiasts and adventure seekers.Visitors can enjoy boat and jungle safaris, bird watching, and exploring the rich biodiversity of this unique ecosystem";
let count = 0;
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random160 = Math.floor(Math.random()*160);
        const price = Math.floor(Math.random() * 1000);
        let img  = [];
        for(let j = 0;j<3;j++){
           img.push({
            url : imgdup[count%26],
            filename : ""
          });
           count++;
        }
        const camp = new Campground({
          author: '6651039b82a4bf93707eadbf',
            location: `${cities[random160].city}, ${cities[random160].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image : img,
            description : text,
            price : price,
            geometry : {
              type : 'Point',
              coordinates : [cities[random160].longitude,cities[random160].latitude]
            }
        })
        await camp.save();
    }
}
seedDB().then(async () => {
    mongoose.connection.close();
})