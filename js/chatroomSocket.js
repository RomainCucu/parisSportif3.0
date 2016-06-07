// Connexion à socket.io
var socket = io.connect();

// On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
var pseudo = ""+getParameterByName('pseudo');
var gender = ""+getParameterByName('gender');
var avatar = ""+getParameterByName('avatar');
var compteur = 0;

socket.emit('nouveau_client', {pseudo:pseudo, gender:gender, avatar:avatar});

// Quand on se connecte, on reçoit le tableau
socket.on('load_chatroom', function(data){
	var arr = data.chatRoom;
	for(i in arr){
		insereMessage(arr[i].pseudo, arr[i].gender, arr[i].avatar, arr[i].message);
	}
})
// Quand on reçoit un message, on l'insère dans la page
socket.on('message', function(data) {	
	insereMessage(data.pseudo, data.gender, data.avatar, data.message);	
})

// Quand un nouveau client se connecte, on affiche l'information
socket.on('nouveau_client', function(obj) {
	$('#chatRoomId').prepend('<p><em>' + obj.pseudo + ' a rejoint le Chat !</em></p>');
})

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#envoyerMessageChatRoomFormId').submit(function () {
	var message = $('#btn-input').val();
	socket.emit('message', message); // Transmet le message aux autres	
	insereMessage(pseudo, gender, avatar, message); // Affiche le message aussi sur notre page	
	$('#btn-input').val('').focus(); // Vide la zone de Chat et remet le focus dessus
	return false; // Permet de bloquer l'envoi "classique" du formulaire
});

// Ajoute un message dans la page
function insereMessage(pseudo, gender, avatar, message) {	
	var imageAvatar = "../images/avatar/"+gender+"/"+avatar+".png";
	if(compteur%2 == 0){
		var str = '<li class="left clearfix" >'
		+'<span class="chat-img pull-left">'
		+'<img src="'+imageAvatar+'" alt="User Avatar" class="img-circle">'
		+'</span>'
		+'<div class="chat-body clearfix">'
		+'<div class="header">'
		+'<strong class="primary-font">'+pseudo+'</strong>'
		+'<small class="pull-right text-muted">'
		+'<i class="fa fa-clock-o fa-fw"></i> '+12+' ago'
		+'</small>'
		+'</div>'
		+'<p>'
		+''+message+''
		+'</p>'
		+'</div>'
		+'</li>';
	}else{
		var str = '<li class="right clearfix" >'
		+'<span class="chat-img pull-right">'
		+'<img src="'+imageAvatar+'" alt="User Avatar" class="img-circle">'
		+'</span>'
		+'<div class="chat-body clearfix">'
		+'<div class="header">'
		+'<small class=" text-muted">'
		+'<i class="fa fa-clock-o fa-fw"></i>'+12+' ago</small>'
		+'<strong class="pull-right primary-font">'+pseudo+'</strong>'
		+'</div>'
		+'<p>'
		+''+message+''
		+'</p>'
		+'</div>'
		+'</li>';
	}
	//on insere le message dans le chat
	$('#chatRoomId').prepend(str);
	compteur++;
};
