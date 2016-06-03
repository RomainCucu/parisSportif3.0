// Connexion à socket.io
var socket = io.connect();

// On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
var pseudo = "romain";
socket.emit('nouveau_client', pseudo);
//document.title = pseudo + ' - ' + document.title;

// Quand on reçoit un message, on l'insère dans la page
socket.on('message', function(data) {
	insereMessage(data.pseudo, data.message)
})

// Quand un nouveau client se connecte, on affiche l'information
socket.on('nouveau_client', function(pseudo) {
	$('#chatRoomId').prepend('<p><em>' + pseudo + ' a rejoint le Chat !</em></p>');
})

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#envoyerMessageChatRoomFormId').submit(function () {
	var message = $('#btn-input').val();
	socket.emit('message', message); // Transmet le message aux autres
	insereMessage(pseudo, message); // Affiche le message aussi sur notre page
	$('#btn-input').val('').focus(); // Vide la zone de Chat et remet le focus dessus
	return false; // Permet de bloquer l'envoi "classique" du formulaire
});

// Ajoute un message dans la page
function insereMessage(pseudo, message) {
	if(document.getElementById("loadStatutId")){//pour enlever le chargement....
		document.getElementById("chatRoomId").innerHTML = "";
	}
	var str = '<p><strong>' + pseudo + '</strong> ' + message + '</p>';
	document.getElementById("chatRoomId").innerHTML += str;
}