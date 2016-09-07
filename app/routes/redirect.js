/**
 * Created by user on 8/9/16.
 */
var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var statsService = require('../services/statsService');



router.get('*', function(req, res) {
    var shortUrl = req.originalUrl.slice(1);
    var send_msg = function(info) {
        statsService.getUrlInfo(shortUrl, info, function(data) {
            console.log ("check this out:  " + currentRoom["room_" + shortUrl].length);
            for (var i = 0; i < currentRoom["room_" + shortUrl].length; i++) {
                currentRoom["room_" + shortUrl][i].emit(info, data);
            }
        });
    };
    console.log ("someone click !!!!!!!");
    urlService.getLongUrl(shortUrl, function(url) {
        if (url) {
            res.redirect(url.longUrl);
            statsService.logRequest(shortUrl, req);
            send_msg('totalClicks');
        } else {
            res.sendFile('404.html', { root: './public/views'});
        }
    });

});

module.exports = router;