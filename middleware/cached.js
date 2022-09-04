// const axios = require('axios');
const redis = require('redis');



let redisClient;
    // Creating an anonymous  Immediately Invoke Functions Expression -  IIFE
    (async () =>{
        redisClient = redis.createClient();
        redisClient.on('error', (error) => console.error(`Error: ${error}`))
        await redisClient.connect();
    })();


    async function cacheData(req, res, next){
        const books = req.params.books;
        let result;
        try {
            const cachedResult = await redisClient.get(books);
            if(cachedResult){
                result = JSON.parse(cachedResult);
                res.send({
                    fromCache: true,
                    items: result,
                });
            }else{
                next()
            }
        } catch (error) {
            console.error(error)
            res.status(404);
            
        }
    }

    module.exports = cacheData;