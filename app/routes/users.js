var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/* GET users listing. */
router.post('/api/users', function(req, res, next) {
  var user_id = req.body.id;
  var token = req.body.token;
  var geo = req.body.geo;
  res.send(user_id + ' ' + token + ' ' + geo);
});

module.exports = router;
