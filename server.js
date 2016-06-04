var http = require("http");
var util = require("util");
var db = require("./private/db.js");
var ent = require("ent");
var server = {}; //Server object. This object is use to stock everything owned by the server.
server.r = require("./router.js");
server.port = (process.env.PORT || 5000);
server.address = "0.0.0.0";

/**
* This method is called each times a request arrives on the server * @param req (Object) request object for this request
* @param resp (Object) response object for this request
*/
server.receive_request = function (req, resp) { 
	server.r.router(req, resp);
};

var app = require('http').createServer(server.receive_request);
var io = require('socket.io')(app);
app.listen(server.port);

//http.createServer(server.receive_request).listen(server.port, server.address);
var chatroomArr = new Array ();
io.sockets.on('connection', function (socket, pseudo) {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', {pseudo: pseudo, chatroomArr: chatroomArr});
    });

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);
        chatroomArr.push({pseudo: socket.pseudo, message: message});
        if(chatroomArr.length > 100) chatroomArr = new Array();
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 
});


util.log("INFO - Server started, listening " + server.address + ":" + server.port);