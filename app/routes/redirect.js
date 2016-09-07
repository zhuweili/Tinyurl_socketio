/**
 * Created by user on 8/9/16.
 */
var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var statsService = require('../services/statsService');



router.get('*', function(req, res) {
    var shortUrl = req.originalUrl.slice(1);
    console.log ("someone click !!!!!!!");
    urlService.getLongUrl(shortUrl, function(url) {
        if (url) {
            res.redirect(url.longUrl);
            statsService.logRequest(shortUrl, req);
            statsService.getUrlInfo(shortUrl, 'totalClicks', function(data) {
                console.log ("check this out:  " + currentRoom["room_" + shortUrl].length);
                for (var i = 0; i < currentRoom["room_" + shortUrl].length; i++) {
                    currentRoom["room_" + shortUrl][i].emit('totalClicks', data);
                }
            });
            statsService.getUrlInfo(shortUrl, 'hour', function(data) {
                console.log ("check this out:  " + currentRoom["room_" + shortUrl].length);

                for (var i = 0; i < currentRoom["room_" + shortUrl].length; i++) {
                    currentRoom["room_" + shortUrl][i].emit('hour_chart', data);
                }
            });

        } else {
            res.sendFile('404.html', { root: './public/views'});
        }
    });

});

module.exports = router;