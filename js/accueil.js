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
				//obj.post({action:'RECUPERERINFOS'},obj.log_callback);
				console.log(r);
			}else if(r.suc_methode == "RECUPERERINFOS"){
				console.log(r);
				remplirChoix(r.mesVotesVainqueursEuro2016);
				remplirTableauVoteVainqueurs(r.autresVotesVainqueursEuro2016, 'tableClassementVainqueursEuro');//vainqueurs EURO 2016
				compterMeilleurVoteVainqueurEuro2016(r.mesVotesVainqueursEuro2016, r.autresVotesVainqueursEuro2016);
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
  masquerEl('voteVainqueursKOdoublon');
  masquerEl('voteVainqueursKO');
  masquerEl('voteVainqueursOK');
  var pays1 = document.getElementById('SELECT_VOTER1EURO').value;
  var pays2 = document.getElementById('SELECT_VOTER2EURO').value;
  var pays3 = document.getElementById('SELECT_VOTER3EURO').value;
  if(pays1 == pays2 || pays1== pays3 || pays2 == pays3){
  	afficher('voteVainqueursKOdoublon');
  	return false;
  }
  remplirSaLigneVoteVainqueur(getParameterByName('pseudo'), pays1, pays2, pays3);
  afficherMasquer('voteVainqueursGIF','BTN_VOTER1EURO');
  obj.post({action:'VOTER1EURO', pays1:pays1, pays2:pays2, pays3:pays3}, obj.log_callback);
  return false;
};


var remplirChoix = function(data){
	for (var i in arrPaysEuro){
		document.getElementById('SELECT_VOTER1EURO').innerHTML += "<option value="+i+">"+arrPaysEuro[i]+"</option>";
  		document.getElementById('SELECT_VOTER2EURO').innerHTML += "<option value="+i+">"+arrPaysEuro[i]+"</option>";
  		document.getElementById('SELECT_VOTER3EURO').innerHTML += "<option value="+i+">"+arrPaysEuro[i]+"</option>";	
	}
	if(data){
		remplirSaLigneVoteVainqueur(getParameterByName('pseudo'), data.VOTER1EURO, data.VOTER2EURO, data.VOTER3EURO);
		if(data.VOTER1EURO){
			afficher('SELECT_VOTER1EURO_VOTED');
			document.getElementById('SELECT_VOTER1EURO').value = data.VOTER1EURO;
		}if(data.VOTER2EURO){
			afficher('SELECT_VOTER2EURO_VOTED');
			document.getElementById('SELECT_VOTER2EURO').value = data.VOTER2EURO;
		}if(data.VOTER3EURO){
			afficher('SELECT_VOTER3EURO_VOTED');
			document.getElementById('SELECT_VOTER3EURO').value = data.VOTER3EURO;
		}
	}
	afficher('SELECT_VOTER1EURO');
	afficher('SELECT_VOTER2EURO');
	afficher('SELECT_VOTER3EURO');
};

var remplirTableauVoteVainqueurs = function (autresVotesObj, documentID){
	var str = "";
	var i = 0;
	Object.keys(autresVotesObj).forEach(function(key) {
		var pseudo = key;
    		var vote1 = arrPaysEuro[parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER1EURO)];
    		var vote2 = arrPaysEuro[parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER2EURO)];
    		var vote3 = arrPaysEuro[parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER3EURO)];
    		var img1 = '<img src="../images/flags/'+parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER1EURO)+'.png" alt="Smiley face" height="20" width="30">&nbsp';
    		var img2 = '<img src="../images/flags/'+parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER2EURO)+'.png" alt="Smiley face" height="20" width="30">&nbsp';
    		var img3 = '<img src="../images/flags/'+parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER3EURO)+'.png" alt="Smiley face" height="20" width="30">&nbsp';
    		if(i%2 == 0){
    			str += '<tr class="success"><td>'+pseudo+'</td><td>'+img1+vote1+'</td><td>'+img2+vote2+'</td><td>'+img3+vote3+'</td></tr>'
    		}else{
    			str += '<tr class="info"><td>'+pseudo+'</td><td>'+img1+vote1+'</td><td>'+img2+vote2+'</td><td>'+img3+vote3+'</td></tr>'	
    		}
    		i++;
	});
	document.getElementById(""+documentID).innerHTML += str;
};

var remplirSaLigneVoteVainqueur = function(pseudo, pays1, pays2, pays3){
	document.getElementById('ligneMesVotesVainqueursEuro').innerHTML = '';
	document.getElementById('ligneMesVotesVainqueursEuro').innerHTML += "<td>"+pseudo.toUpperCase()+"</td>";
	if(pays1){
		var img1 = '<img src="../images/flags/'+parseInt(pays1)+'.png" alt="Smiley face" height="20" width="30">&nbsp';
		document.getElementById('ligneMesVotesVainqueursEuro').innerHTML += "<td>"+img1+arrPaysEuro[parseInt(pays1)]+"</td>";
	}if(pays2){
		var img2 = '<img src="../images/flags/'+parseInt(pays2)+'.png" alt="Smiley face" height="20" width="30">&nbsp';
		document.getElementById('ligneMesVotesVainqueursEuro').innerHTML += "<td>"+img2+arrPaysEuro[parseInt(pays2)]+"</td>";
	}if(pays3){
		var img3 = '<img src="../images/flags/'+parseInt(pays3)+'.png" alt="Smiley face" height="20" width="30">&nbsp';
		document.getElementById('ligneMesVotesVainqueursEuro').innerHTML += "<td>"+img3+arrPaysEuro[parseInt(pays3)]+"</td>";
	}
};

var compterMeilleurVoteVainqueurEuro2016 = function(data, autresVotesObj){
	var objVotesGlobaux = {};
	objVotesGlobaux.voteTotal = 0;//pour savoir le nombre de votes
	objVotesGlobaux.votePremier = -1;//pour savoir le vainqueur
	objVotesGlobaux.pourcentage = 100;
	if(data){//si j'ai des votes
		objVotesGlobaux[data.VOTER1EURO] = 1; //mon vote vainqueur
		objVotesGlobaux.voteTotal += 1;//on ajoute une voix
	}
	if(autresVotesObj){//si d'autres votes
		Object.keys(autresVotesObj).forEach(function(key) {
			if(objVotesGlobaux[autresVotesObj[key].VAINQUEURSEURO2016.VOTER1EURO])
				objVotesGlobaux[autresVotesObj[key].VAINQUEURSEURO2016.VOTER1EURO] += 1;
			else
				objVotesGlobaux[autresVotesObj[key].VAINQUEURSEURO2016.VOTER1EURO] = 1;
				objVotesGlobaux.voteTotal += 1;//on ajoute une voix
		});
	}
	Object.keys(objVotesGlobaux).forEach(function(key) {
		if(Number.isInteger(parseInt(key)) && objVotesGlobaux.votePremier < objVotesGlobaux[key]){
			objVotesGlobaux.votePremier = key;
			objVotesGlobaux.pourcentage = Math.floor(objVotesGlobaux[key]/(objVotesGlobaux.voteTotal)*100);
		}
	});
	if(objVotesGlobaux.votePremier != -1){
		document.getElementById('progress_bar_id_vainqueur_euro_2016').style.width = ""+objVotesGlobaux.pourcentage+"%";
		document.getElementById('progress_bar_id_vainqueur_euro_2016').innerHTML = arrPaysEuro[parseInt(objVotesGlobaux.votePremier)]+" "+objVotesGlobaux.pourcentage+" %";
	}
	console.log(objVotesGlobaux);
};

var afficherMasquer = function(afficherEl, masquerEl){
	document.getElementById(afficherEl).style.display = 'inline';
	document.getElementById(masquerEl).style.display = 'none';
};

var afficher = function(afficherEl){
	document.getElementById(afficherEl).style.display = 'inline';	
};

var masquerEl = function(el){
	document.getElementById(el).style.display = 'none';	
};

var eraseCookie= function(){
	document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
	document.location.href="../index.html";
};


//-------AU DEMARRAGE
obj.post({action:'RECUPERERINFOS'},obj.log_callback);

