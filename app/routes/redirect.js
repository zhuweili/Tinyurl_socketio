/**
 * Created by user on 8/9/16.
 */
var express = require('express');
var router = express.Router();
var urlService = require('../services/urlService');
var statsService = require('../services/statsService');



router.get('*', function(req, res) {
    var shortUrl = req.originalUrl.slice(1);
    urlService.getLongUrl(shortUrl, function(url) {
        if (url) {
            res.redirect(url.longUrl);
            statsService.logRequest(shortUrl, req);
        } else {
            res.sendFile('404.html', { root: './public/views'});
        }
    });

});

module.exports = router;