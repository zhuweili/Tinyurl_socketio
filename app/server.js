/**
 * Created by user on 8/8/16.
 */



var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var restRouter = require('./routes/rest');
var redirectRouter = require('./routes/redirect');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');
var useragent = require('express-useragent');


mongoose.connect('mongodb://user:user@ds025802.mlab.com:25802/tinyurl');

var reload = require('./reload/warm_up');
reload.warm_cache("Relaod is done", function (message) {
    console.log(message);
});
currentRoom=[];



app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use('/public', express.static(__dirname + '/public'));

app.use(useragent.express());

app.use('/api/v1', restRouter);

app.use('/', indexRouter);

app.use('/:shortUrl', redirectRouter);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('shortUrl', function(shortUrl) {
        var roomId = "room_" + shortUrl;
        if (currentRoom.indexOf(roomId) === -1) {
            currentRoom[roomId] = [];
        }
        currentRoom[roomId].push(socket);
        console.log ("now " + roomId + " has socket: " + currentRoom[roomId].length + " " + socket.id);
        console.log("accept from " + roomId);
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    var i = 0;
    setInterval(function(){
        socket.emit('message', {
            message: "service is alive + " + i.toString()
        });
        console.log(i);
        i++;
    }, 10000);
});


http.listen(3000);