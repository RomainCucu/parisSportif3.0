var obj = {};

var arrPaysEuro = ["Albanie", "Allemagne", "Angleterre", "Autriche", "Belgique", "Croatie", "Espagne", "France", "Hongrie", "Irlande du Nord", "Islande", "Italie", "Pays de Galles", "Pologne", "Portugal", "République d'Irlande", "Rép. tchèque", "Roumanie", "Russie", "Slovaquie", "Suède", "Suisse", "Turquie", "Ukraine"];
//variables globales
var arrPaysEuro = ["Albanie", "Allemagne", "Angleterre", "Autriche", "Belgique", "Croatie", "Espagne", "France", "Hongrie", "Irlande du Nord", "Islande", "Italie", "Pays de Galles", "Pologne", "Portugal", "République d'Irlande", "Rép. tchèque", "Roumanie", "Russie", "Slovaquie", "Suède", "Suisse", "Turquie", "Ukraine"];
//tous les groupes
var groupesEuro = ['A','B','C','D','E','F'];
var groupeA = ["France", "Roumanie", "Albanie",   "Suisse"];
var groupeB = ["Angleterre", "Russie", "Pays de Galles",   "Slovaquie"];
var groupeC = ["Allemagne", "Ukraine", "Pologne",   "Irlande du Nord"];
var groupeD = ["Espagne", "République tchèque", "Turquie",   "Croatie"];
var groupeE = ["Belgique", "Italie", "Irlande",   "Suède"];
var groupeF = ["Portugal", "Islande", "Autriche",   "Hongrie"];


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
				if(r.data.groupe){
					console.log('ok');
					return;
				}
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
//submit des trois premiers de l'euro
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

//submit pour les groupes
$('#groupe_A_form_id, #groupe_B_form_id, #groupe_C_form_id, #groupe_D_form_id, #groupe_E_form_id, #groupe_F_form_id').on('submit', function(event){
	var groupe = this.id.slice(7,8);
	masquerEl('groupe_'+groupe+'_submit_KO_doublon');
	masquerEl('groupe_'+groupe+'_submit_KO');
	masquerEl('groupe_'+groupe+'_submit_OK');	
	var pays1 = document.getElementById('groupe_'+groupe+'_select_id_1').value;
	var pays2 = document.getElementById('groupe_'+groupe+'_select_id_2').value;
	if(pays1 == pays2){
  	afficher('groupe_'+groupe+'_submit_KO_doublon');
		return false;
	  }
	  //remplirSaLigneVoteVainqueur(getParameterByName('pseudo'), pays1, pays2, pays3);
	afficherMasquer('groupe_'+groupe+'_gif_submit','groupe_'+groupe+'_btn_id');
	obj.post({action:'VOTERGROUPEEURO', groupe: groupe, pays1:pays1, pays2:pays2}, obj.log_callback);
	return false;
});


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
//affiche le display de l'id
var afficher = function(afficherEl){
	document.getElementById(afficherEl).style.display = 'inline';	
};
//mets display a none de l'id
var masquerEl = function(el){
	document.getElementById(el).style.display = 'none';	
};
//pour le log out
var eraseCookie= function(){
	document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
	document.location.href="../index.html";
};

//recupere les votes et autres
obj.post({action:'RECUPERERINFOS'},obj.log_callback);
/************************************************************************** */
//pour afficher les poules
var remplirPoule = function(){
	var i = "";
	var groupeTmp = groupeA;
	//on affiche les divs
	for (var j = 0 ; j <6 ; j++){
		if( j == 0 ) {
			i = 'A';
			groupeTmp = groupeA;
		}
		if( j == 1 ){
			i = 'B';
			groupeTmp = groupeB;
		}
		if( j == 2 ){
			i = 'C';
			groupeTmp = groupeC;
		}
		if( j == 3 ) {
			i = 'D';
			groupeTmp = groupeD;
		}
		if( j == 4 ) {
			i = 'E';
			groupeTmp = groupeE;
		}
		if( j == 5 ) {
			i = 'F';
			groupeTmp = groupeF;
		}
		document.getElementById('remplirPoule').innerHTML += '<div class="col-md-4"><div class="chat-panel panel panel-default"><div class="panel-heading"><i class="fa fa-comments fa-fw"></i>Groupe '+i+'</div><!-- /.panel-heading --><div class="panel-body"><div class="row"><div class="col-lg-12"><form id="groupe_'+i+'_form_id"><div class="form-group"><label for="groupe_'+i+'_select_id_1">Sélectionner le premier du groupe A:</label><p class="text-primary col-md-12" id="groupe_'+i+'_select_voted_1" style="display:none">Vous avez voté :</p><select class="form-control" id="groupe_'+i+'_select_id_1" style=""></select></div><div class="form-group"><label for="groupe_'+i+'_select_id_2">Sélectionner le second du groupe A:</label><p class="text-primary col-md-12" id="groupe_'+i+'_select_voted_2" style="display:none">Vous avez voté :</p><select class="form-control" id="groupe_'+i+'_select_id_2" style=""></select></div><button type="submit" class="btn btn-default" id="groupe_'+i+'_btn_id">Submit</button><img id="groupe_'+i+'_gif_submit" src="../images/ajax-loader-mid.gif" style="height:auto; width:auto; display:none;"><p class="text-success" id="groupe_'+i+'_submit_OK" style="height:auto; width:auto; display:none;"> Vote Envoyé !</p><p class="text-danger" id="groupe_'+i+'_submit_KO" style="height:auto; width:auto; display:none;"> Vote NON Envoyé ! rééssayez plus tard !</p><p class="text-warning" id="groupe_'+i+'_submit_KO_doublon" style="height:auto; width:auto; display:none;"> Vote NON Envoyé ! Choisir une équipe différente pour chaque classement !</p></form></div></div></div></div></div>';
		//on rempli les select
		for (var z in groupesEuro){
			if(z <4){
				document.getElementById('groupe_'+i+'_select_id_1').innerHTML += "<option value="+z+">"+groupeTmp[z]+"</option>";
	  			document.getElementById('groupe_'+i+'_select_id_2').innerHTML += "<option value="+z+">"+groupeTmp[z]+"</option>";
			}
		}
	}
};
//affiche le html
remplirPoule();
/************************************************************************** */


