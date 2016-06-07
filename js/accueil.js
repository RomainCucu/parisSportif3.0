var obj = {};

var arrPaysEuro = ["Albanie", "Allemagne", "Angleterre", "Autriche", "Belgique", "Croatie", "Espagne", "France", "Hongrie", "Irlande du Nord", "Islande", "Italie", "Pays de Galles", "Pologne", "Portugal", "République d'Irlande", "Rép. tchèque", "Roumanie", "Russie", "Slovaquie", "Suède", "Suisse", "Turquie", "Ukraine"];

for(var i in arrPaysEuro){
  document.getElementById('VOTER1EURO').innerHTML += '<option value='+arrPaysEuro[i]+'>'+arrPaysEuro[i]+'</option>';
}
document.getElementById('FORM_VOTER1EURO').onsubmit = function(event){
  console.log('a voter '+ document.getElementById('VOTER1EURO').value());
  event.preventDefault();
}
obj.post = function (data, callback) {	
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.onreadystatechange = callback;
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
};

obj.log_callback = function () {
	if (this.readyState == 4 && this.status == 200) {
		var r = JSON.parse(this.responseText);			
		if (r.categorie == "SUCCESS"){
			if(r.suc_methode == "VOTER1EURO"){				
				console.log(r);
				obj.remplirChatRoom(r.data);
			}else if(r.suc_methode == "VOTER2EURO"){
				console.log(r);				
				document.getElementById('btn-input').value = "";
				//document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
				obj.remplirChatRoom(r.data);
			}	
		}else if(r.categorie == "ERROR"){
			if(r.err_methode == "GETCHATROOM"){
				console.log("error GETCHATROOM");
			}else if(r.err_methode == "SENDMESSCHATROOM"){
				console.log("error SENDMESSCHATROOM");
				//document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
			}
		}
	}
};
