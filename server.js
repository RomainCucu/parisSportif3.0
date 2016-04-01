var http = require("http");
var util = require("util");
var db = require("./private/db.js");

var server = {}; //Server object. This object is use to stock everything owned by the server.
server.r = require("./router.js"); server.port = (process.env.PORT || 5000);
server.address = "0.0.0.0";

/**
* This method is called each times a request arrives on the server * @param req (Object) request object for this request
* @param resp (Object) response object for this request
*/
server.receive_request = function (req, resp) { server.r.router(req, resp);
};
http.createServer(server.receive_request).listen(server.port, server.address);
util.log("INFO - Server started, listening " + server.address + ":" + server.port);


// Chargement de socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket, pseudo) {
    // Quand un client se connecte, on lui envoie un message
    socket.emit('message', 'Vous êtes bien connecté !');
    // On signale aux autres clients qu'il y a un nouveau venu
    socket.broadcast.emit('message', 'Un autre client vient de se connecter ! ');

    // Dès qu'on nous donne un pseudo, on le stocke en variable de session
    socket.on('petit_nouveau', function(pseudo) {
        socket.pseudo = pseudo;
    });

    // Dès qu'on reçoit un "message" (clic sur le bouton), on le note dans la console
    socket.on('message', function (message) {
        // On récupère le pseudo de celui qui a cliqué dans les variables de session
        console.log(socket.pseudo + ' me parle ! Il me dit : ' + message);
    }); 
});
