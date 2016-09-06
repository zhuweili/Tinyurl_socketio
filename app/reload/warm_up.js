/**
 * Created by user on 8/26/16.
 */

var UrlModel = require('../models/urlModel');

var redis = require('redis');
var host = process.env.REDIS_PORT_6379_TCP_ADDR || '127.0.0.1';
var port = process.env.REDIS_PORT_6379_TCP_PORT || '6379';



var warm_cache = function (message, callback) {
    UrlModel.find({}, function (err, urls) {

        var redisClient = redis.createClient(port, host);

        for (var i=0; i<urls.length; i++) {
            redisClient.set(urls[i].shortUrl, urls[i].longUrl);
            redisClient.set(urls[i].longUrl, urls[i].shortUrl);
            //console.log(urls[i].longUrl);
        }

        redisClient.keys('*', function (err, keys) {
            if (err) {
                return console.log(err);
            } else {
                console.log("Number of preload keys: " + keys.length);
            }

        });
        redisClient.quit();
    });

    callback(message);
};



module.exports = {warm_cache: warm_cache};
