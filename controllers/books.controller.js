const logger = require('../utils/logger');
const axios = require('axios');
const redis = require('redis');

// Creating Redis client
let client = redis.createClient();
client.connect().then(() =>{
    console.log('Redis is now connected........')
})

const home = (req, res) =>{
    res.render('home')
}

const searchBooks = async (req, res) =>{   
    const API_key  = "AIzaSyDxG9pWAyQadM_t9ZFrfcS8fHEq1xgqfIE"
    async function fetchBooks(book){
        const URL = `https://www.googleapis.com/books/v1/volumes?q=${book}`
        const apiResponse = await axios.get(URL);
        const body = await apiResponse.data
        console.log("Request send to the API");
        return body
    }
}
    const getBooksData = async (req, res) => {
        const bookTitle =  req.body.id;
        let result;

        try {
            result =  searchBooks(bookTitle);
            if(result.length === 0){
                throw "API returned an empty result"
            }
            await client.set(books, JSON.stringify(result),{
                EX: 180,
                NX: true,
            });
            res.send({
                fromCache: false,
                data: result
            });
        } catch (error){
            res.render('home', {
                error: "Books does not exist"
            })
            
        }
    }

 



module.exports ={
    getBooksData,
    home
}
