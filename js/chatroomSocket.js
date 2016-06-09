// Connexion à socket.io
var socket = io.connect();

// On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
var pseudo = ""+getParameterByName('pseudo');
var gender = ""+getParameterByName('gender');
var avatar = ""+getParameterByName('avatar');
var compteur = 0;

socket.emit('nouveau_client', {pseudo:pseudo, gender:gender, avatar:avatar});
socket.emit('getChatRoom', {});

// Quand on se connecte, on reçoit le tableau
socket.on('getChatRoom', function(data){
	var arr = data.chatRoom;
	for(i in arr){
		insereMessage(arr[i].pseudo, arr[i].gender, arr[i].avatar, arr[i].message, arr[i].date);
	}
})
// Quand on reçoit un message, on l'insère dans la page
socket.on('message', function(data) {	
	insereMessage(data.pseudo, data.gender, data.avatar, data.message, data.date);	
})

// Quand un nouveau client se connecte, on affiche l'information
socket.on('nouveau_client', function(obj) {	
	$('#chatRoomId').append('<p><em>' + obj.pseudo + ' a rejoint le Chat !</em></p>');	
	$('#scrollElementChat').animate({scrollTop: $('#scrollElementChat').prop("scrollHeight")}, 500);

})

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#envoyerMessageChatRoomFormId').submit(function () {
	var message = $('#btn-input').val();
	socket.emit('message', message); // Transmet le message aux autres
	var d = new Date();
	d = d.getTime();
	insereMessage(pseudo, gender, avatar, message, d); // Affiche le message aussi sur notre page	
	$('#btn-input').val('').focus(); // Vide la zone de Chat et remet le focus dessus
	return false; // Permet de bloquer l'envoi "classique" du formulaire
});

// Ajoute un message dans la page
function insereMessage(pseudo, gender, avatar, message, d) {	
	var imageAvatar = "../images/avatar/"+gender+"/"+avatar+".png";
	if (message.length <1) return;//on affiche pas si vide
	if(compteur%2 == 0){
		var str = '<li class="left clearfix" >'
		+'<span class="chat-img pull-left">'
		+'<img src="'+imageAvatar+'" alt="User Avatar" class="img-circle">'
		+'</span>'
		+'<div class="chat-body clearfix">'
		+'<div class="header">'
		+'<strong class="primary-font">'+pseudo+'</strong>'
		+'<small class="pull-right text-muted">'
		+'<i class="fa fa-clock-o fa-fw"></i> '+timeSince(d)+' ago'
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
		+'<i class="fa fa-clock-o fa-fw"></i>'+timeSince(d)+' ago</small>'
		+'<strong class="pull-right primary-font">'+pseudo+'</strong>'
		+'</div>'
		+'<p>'
		+''+message+''
		+'</p>'
		+'</div>'
		+'</li>';
	}
	//on insere le message dans le chat
	$('#chatRoomId').append(str);
	$('#scrollElementChat').animate({scrollTop: $('#scrollElementChat').prop("scrollHeight")}, 500);	
	compteur++;
};

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
};
