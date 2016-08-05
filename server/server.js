var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var app = express();
var server   = require('http').createServer(app);
var io = require('socket.io').listen(server);


var mongoURI =  process.env.MONGODB_URI || 'mongodb://localhost/khitwa';

var port = process.env.PORT || 8000;
// connect to mongo database named "Khitwa"
mongoose.connect(mongoURI);

// configure our server with all the middleware and routing
require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);
require('./socketIO/socketMessages.js')(io);
// start listening to requests on port 8000
server.listen(port, function(){
	console.log('Server now listening on port ',port )
});

// export our app for testing and flexibility, required by index.js
module.exports = app;