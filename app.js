const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const axios = require('axios');
const redis = require('redis');


// Creating Redis client
let client = redis.createClient();
client.connect().then(() =>{
    console.log('Redis is now connected........')
})

// require('dotenv').config();
const app = express();

//Parse application
app.use(bodyParser.urlencoded({ extended: false}))
// Parse application/json
app.use(bodyParser.json());
//static files
app.use(express.static('public'));


//Templating Engine using Handlebars
app.engine('hbs', exphbs.engine( {extname: '.hbs', defaultLayout: "main" }));
app.set('view engine', 'hbs');


//home page
app.get('/', (req, res) =>{
    res.render('home');
})

let redisClient;
// Creating redis clinet instance
(async()=>{
    redisClient = redis.createClient();

    redisClient.on("error", (error) => console.log(`Error: ${error}`))

    await redisClient.connect();
})();


// Creating in-memory Redis catch data
const cacheData = async (req, res, next) =>{
    const books = req.body.id
    let result;
    try {
        const cachedResult = await redisClient.get(books);
        if(cachedResult){
            result = JSON.parse(cachedResult)
            res.render('searchDetails', {
                fromCache: true,
                data: result
            });
        }else{
            next()
        }
    } catch (error) {
        res.render('home', {
            error: "No data from google"
        })
    }
}

const searchBooks = async (book) =>{   
        const URL = `https://www.googleapis.com/books/v1/volumes?q=${book}`
        const apiResponse = await axios.get(URL);
        const body = await apiResponse.data
        console.log("Request send to the API");
        return body
    
}

const getBooksData = async (req, res) =>{
    let books = req.body.id;
    let result;
    try {
       result = await searchBooks(books);
       result.items[0]
       if(books === null || books === ""){
           throw "API returned an empty results"
       }
           await redisClient.set(books, JSON.stringify(result),{
            EX: 180,
            NX: true,
           });
           res.render('searchDetails', {
               fromCache: false,
               data: result             
           });
       
    } catch (error) {
        res.render('home', {
            error: "No data from google"
        })
    }
}
app.post('/search/books', cacheData, getBooksData)



module.exports = app;

// https://developers.google.com/identity/protocols/oauth2   - 
// https://developers.google.com/books/docs/v1/using         -             google api for books guide

// https://www.digitalocean.com/community/tutorials/how-to-implement-caching-in-node-js-using-redis  - Inspirations

// https://github.com/zentech/Book-Finder
// https://www.youtube.com/watch?v=bsZKDIaij-A --- youtube for google book finder

