var obj = {};

var arrPaysEuro = ["Albanie", "Allemagne", "Angleterre", "Autriche", "Belgique", "Croatie", "Espagne", "France", "Hongrie", "Irlande du Nord", "Islande", "Italie", "Pays de Galles", "Pologne", "Portugal", "République d'Irlande", "Rép. tchèque", "Roumanie", "Russie", "Slovaquie", "Suède", "Suisse", "Turquie", "Ukraine"];

for(var i in arrPaysEuro){
  document.getElementById('SELECT_VOTER1EURO').innerHTML += '<option value='+arrPaysEuro[i]+'>'+arrPaysEuro[i]+'</option>';
  document.getElementById('SELECT_VOTER2EURO').innerHTML += '<option value='+arrPaysEuro[i]+'>'+arrPaysEuro[i]+'</option>';
  document.getElementById('SELECT_VOTER3EURO').innerHTML += '<option value='+arrPaysEuro[i]+'>'+arrPaysEuro[i]+'</option>';
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

document.getElementById('FORM_VOTER1EURO').onsubmit = function(event){
  var pays1 = document.getElementById('SELECT_VOTER1EURO').value;
  var pays2 = document.getElementById('SELECT_VOTER2EURO').value;
  var pays3 = document.getElementById('SELECT_VOTER3EURO').value;
  obj.post({action:'VOTER1EURO', pays1:pays1, pays2:pays2, pays3:pays3}, obj.log_callback);
  return false;
};
