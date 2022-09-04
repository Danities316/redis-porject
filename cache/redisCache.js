const redis = require('async-redis');
const client = redis.createClient(6379);

const expirationTime = 600; // seconds
cont bookKeyFormat = 'book.id=';

async function setCache(bookId, data){
    const key = bookKeyFormat+bookId;
    return await setCache(key, JSON.stringify(data))
}

async function set(key, data){
    await client.setex(key, expirationTime, data);
}

async function getCache(bookId){
    const key = bookKeyFormat+bookId;
    const data = await getCache(key);
    return JSON.parse(data);
}

async function get(key){
    return await client.get(key);
}
async function clearCache(bookId){
    const key = bookKeyFormat+bookId;
    return await clear(key);
}
async function clear(key){
    return client.del(key);
}

module.exports.getCache = getCache;
module.exports.setCache = setCache;
module.exports.clearCache = clearCache;