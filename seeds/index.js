const mongoose = require('mongoose');
const cities = require('./cities');
const {imgdup} = require('../images');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const db_URL = process.env.DB_URL || 'mongodb://192.168.150.24:27017/yelp-camp';
mongoose.connect(db_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid fuga necessitatibus blanditiis sapiente tenetur assumenda repudiandae laborum ullam voluptCupiditate quasi totam fugit, provident dolorem voluptatum laudantium facere quo veritatis quos voluptatibus natus ullam laborum blanditiis. Praesentium impedit, dolorem totam culpa provident, aut aspernatur, et ab quis ullam suscipit.Veniam quasi ";
let count = 0;
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 10000);
        let img  = [];
        for(let j = 0;j<3;j++){
           img.push({
            url : imgdup[count%26],
            filename : ""
          });
           count++;
        }
        const camp = new Campground({
            author : '66471989d7445ff90d988712',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            /*image: [
                {
                  url: 'https://res.cloudinary.com/dure7aut4/image/upload/v1716235005/YelpCamp/b7hl8d9mndbsjr968vro.jpg',
                  filename: 'YelpCamp/b7hl8d9mndbsjr968vro',
                },
                {
                  url: 'https://res.cloudinary.com/dure7aut4/image/upload/v1716235002/YelpCamp/vrseif8geypasgxl1zuq.jpg',
                  filename: 'YelpCamp/vrseif8geypasgxl1zuq',
                },
                {
                  url: 'https://res.cloudinary.com/dure7aut4/image/upload/v1716235002/YelpCamp/t1yaeltip8f0gyftheiu.jpg',
                  filename: 'YelpCamp/t1yaeltip8f0gyftheiu',
                }
              ],*/
              image : img,
            description : text,
            price : price,
            geometry : {
              type : 'Point',
              coordinates : [cities[random1000].longitude,cities[random1000].latitude]
            }
        })
        await camp.save();
    }
}
seedDB().then(async () => {
    mongoose.connection.close();
})