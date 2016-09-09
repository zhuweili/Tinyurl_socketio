var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrlSchema = new Schema({
    longUrl: String,
    shortUrl: String,
    eUrl: String
});

var urlModel = mongoose.model('urlModel', UrlSchema);

module.exports = urlModel;