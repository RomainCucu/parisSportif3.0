// Connexion à socket.io
var socket = io.connect();

// On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
var pseudo = getParameterByName('pseudo');
var imageAvatar = "../images/avatar/"+getParameterByName('gender')+"/"+getParameterByName('avatar')+".png";

socket.emit('nouveau_client', pseudo);

// Quand on reçoit un message, on l'insère dans la page
socket.on('message', function(data) {
	insereMessage(data.pseudo, data.message)
})

// Quand un nouveau client se connecte, on affiche l'information
socket.on('nouveau_client', function(obj) {
	$('#chatRoomId').prepend('<p><em>' + obj.pseudo + ' a rejoint le Chat !</em></p>');
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
	$('#chatRoomId').prepend(str);
}

var lestString = '<li class="left clearfix" id="messageIdNumero_'+i+'">'
+'<span class="chat-img pull-left">'
+'<img src="'+imageAvatar+'" alt="User Avatar" class="img-circle">'
+'</span>'
+'<div class="chat-body clearfix">'
+'<div class="header">'
+'<strong class="primary-font">'+tab[i][0]+'</strong>'
+'<small class="pull-right text-muted">'
+'<i class="fa fa-clock-o fa-fw"></i> '+timeSince(tab[i][1])+' ago'
+'</small>'
+'</div>'
+'<p>'
+''+tab[i][2]+''
+'</p>'
+'</div>'
+'</li>';

var rightString = '<li class="right clearfix" id="messageIdNumero_'+i+'">'
+'<span class="chat-img pull-right">'
+'<img src="'+imageAvatar+'" alt="User Avatar" class="img-circle">'
+'</span>'
+'<div class="chat-body clearfix">'
+'<div class="header">'
+'<small class=" text-muted">'
+'<i class="fa fa-clock-o fa-fw"></i>'+timeSince(tab[i][1])+' ago</small>'
+'<strong class="pull-right primary-font">'+tab[i][0]+'</strong>'
+'</div>'
+'<p>'
+''+tab[i][2]+''
+'</p>'
+'</div>';