var obj = {};

var arrPaysEuro = ["Albanie", "Allemagne", "Angleterre", "Autriche", "Belgique", "Croatie", "Espagne", "France", "Hongrie", "Irlande du Nord", "Islande", "Italie", "Pays de Galles", "Pologne", "Portugal", "République d'Irlande", "Rép. tchèque", "Roumanie", "Russie", "Slovaquie", "Suède", "Suisse", "Turquie", "Ukraine"];

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
				afficherMasquer('BTN_VOTER1EURO','voteVainqueursGIF');
				afficher('voteVainqueursOK');
				console.log(r);
			}else if(r.suc_methode == "RECUPERERINFOS"){
				console.log(r);
				remplirChoix(r.mesVotesVainqueursEuro2016);
				remplirTableauVoteVainqueurs(r.autresVotesVainqueursEuro2016);
			}	
		}else if(r.categorie == "ERROR"){
			if(r.err_methode == "VOTER1EURO"){
				afficherMasquer('BTN_VOTER1EURO','voteVainqueursGIF');
				afficher('voteVainqueursKO');
				console.log("error VOTER1EURO");
			}else if(r.err_methode == "RECUPERERINFOS"){
				remplirChoix({aze:1});
				console.log("error RECUPERERINFOS");
				//document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
			}
		}
	}
};

document.getElementById('FORM_VOTER1EURO').onsubmit = function(event){
  var pays1 = document.getElementById('SELECT_VOTER1EURO').value;
  var pays2 = document.getElementById('SELECT_VOTER2EURO').value;
  var pays3 = document.getElementById('SELECT_VOTER3EURO').value;
  
  
  afficherMasquer('voteVainqueursGIF','BTN_VOTER1EURO');
  obj.post({action:'VOTER1EURO', pays1:pays1, pays2:pays2, pays3:pays3}, obj.log_callback);
  return false;
};

obj.post({action:'RECUPERERINFOS'},obj.log_callback);

var remplirChoix = function(data){
	for (var i in arrPaysEuro){
		document.getElementById('SELECT_VOTER1EURO').innerHTML += "<option value="+i+">"+arrPaysEuro[i]+"</option>";
  		document.getElementById('SELECT_VOTER2EURO').innerHTML += "<option value="+i+">"+arrPaysEuro[i]+"</option>";
  		document.getElementById('SELECT_VOTER3EURO').innerHTML += "<option value="+i+">"+arrPaysEuro[i]+"</option>";	
	}
	document.getElementById('ligneMesVotesVainqueursEuro').innerHTML += "<td>"+getParameterByName('pseudo').toUpperCase()+"</td>";
	if(data.VOTER1EURO){
		afficher('SELECT_VOTER1EURO_VOTED');
		document.getElementById('SELECT_VOTER1EURO').value = data.VOTER1EURO;
		document.getElementById('ligneMesVotesVainqueursEuro').innerHTML += "<td>"+arrPaysEuro[parseInt(data.VOTER1EURO)]+"</td>";
	}if(data.VOTER2EURO){
		afficher('SELECT_VOTER2EURO_VOTED');
		document.getElementById('SELECT_VOTER2EURO').value = data.VOTER2EURO;
		document.getElementById('ligneMesVotesVainqueursEuro').innerHTML += "<td>"+arrPaysEuro[parseInt(data.VOTER2EURO)]+"</td>";
	}if(data.VOTER3EURO){
		afficher('SELECT_VOTER3EURO_VOTED');
		document.getElementById('SELECT_VOTER3EURO').value = data.VOTER3EURO;
		document.getElementById('ligneMesVotesVainqueursEuro').innerHTML += "<td>"+arrPaysEuro[parseInt(data.VOTER3EURO)]+"</td>";
	}
	afficher('SELECT_VOTER1EURO');
	afficher('SELECT_VOTER2EURO');
	afficher('SELECT_VOTER3EURO');
};

var remplirTableauVoteVainqueurs = function (autresVotesObj){
	var str = "";
	Object.keys(autresVotesObj).forEach(function(key) {
		var pseudo = key;
    		var vote1 = arrPaysEuro[parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER1EURO)];
    		var vote2 = arrPaysEuro[parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER2EURO)];
    		var vote3 = arrPaysEuro[parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER3EURO)];
    		str += '<tr><td>'+pseudo+'</td><td>'+vote1+'</td><td>'+vote2+'</td><td>'+vote3+'</td></tr>'
	});
	document.getElementById('tableClassementVainqueursEuro').innerHTML += str;
};

var afficherMasquer = function(afficherEl, masquerEl){
	document.getElementById(afficherEl).style.display = 'inline';
	document.getElementById(masquerEl).style.display = 'none';
};

var afficher = function(afficherEl){
	document.getElementById(afficherEl).style.display = 'inline';	
};


