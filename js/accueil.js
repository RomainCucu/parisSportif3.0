var obj = {};

//variables globales
var arrPaysEuro = ["Albanie", "Allemagne", "Angleterre", "Autriche", "Belgique", "Croatie", "Espagne", "France", "Hongrie", "Irlande du Nord", "Islande", "Italie", "Pays de Galles", "Pologne", "Portugal", "République d'Irlande", "Rép. tchèque", "Roumanie", "Russie", "Slovaquie", "Suède", "Suisse", "Turquie", "Ukraine"];
var jours = ["Lundi","Mardi","Mercredi","Jeudi", "Vendredi","Samedi","Dimanche"];
var mois = ["Janvier","Février", "Mars","Avril","Mai", "Juin", "Juillet", "Aout","Septembre","Octobre","Novembre","Décembre"];
//tous les groupes
var groupesEuro = ['A','B','C','D','E','F'];
var groupeA = ["France", "Roumanie", "Albanie",   "Suisse"];
var groupeB = ["Angleterre", "Russie", "Pays de Galles",   "Slovaquie"];
var groupeC = ["Allemagne", "Ukraine", "Pologne",   "Irlande du Nord"];
var groupeD = ["Espagne", "République tchèque", "Turquie",   "Croatie"];
var groupeE = ["Belgique", "Italie", "Irlande",   "Suède"];
var groupeF = ["Portugal", "Islande", "Autriche",   "Hongrie"];

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
		document.getElementById('remplirPoule').innerHTML += '<div class="col-md-4"><div class="chat-panel panel panel-default"><div class="panel-heading"><i class="fa fa-glass fa-fw"></i>Choisir les deux premiers du Groupe '+i+':</div><!-- /.panel-heading --><div class="panel-body"><div class="row"><div class="col-lg-12"><form id="groupe_'+i+'_form_id"><div class="form-group"><label for="groupe_'+i+'_select_id_1">Premier du groupe '+i+':<img id=""src="../images/trophy.png" ><em style="color:grey">15 Pts</em></label><p class="text-primary col-md-12" id="groupe_'+i+'_select_voted_1" style="display:none">Vous avez voté :</p><select class="form-control" id="groupe_'+i+'_select_id_1" style=""></select></div><div class="form-group"><label for="groupe_'+i+'_select_id_2">Second du groupe '+i+':<img id=""src="../images/trophy.png" ><em style="color:grey">10 Pts</em></label><p class="text-primary col-md-12" id="groupe_'+i+'_select_voted_2" style="display:none">Vous avez voté :</p><select class="form-control" id="groupe_'+i+'_select_id_2" style=""></select></div><button type="submit" class="btn btn-default" id="groupe_'+i+'_btn_id">Votez !</button><img id="groupe_'+i+'_gif_submit" src="../images/ajax-loader-mid.gif" style="height:auto; width:auto; display:none;"><p class="text-success" id="groupe_'+i+'_submit_OK" style="height:auto; width:auto; display:none;"> Vote Envoyé !</p><p class="text-danger" id="groupe_'+i+'_submit_KO" style="height:auto; width:auto; display:none;"> Vote NON Envoyé ! rééssayez plus tard !</p><p class="text-warning" id="groupe_'+i+'_submit_KO_doublon" style="height:auto; width:auto; display:none;"> Vote NON Envoyé ! Choisir une équipe différente pour chaque classement !</p></form></div></div></div></div></div>';
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
					var groupe = r.data.groupe;
					hideShowElements('groupe_'+groupe+'_btn_id','groupe_'+groupe+'_gif_submit');
					showElement('groupe_'+groupe+'_submit_OK');
				}else if(r.data.action =="VOTERMATCHDUJOUR"){
					
				}else{
					hideShowElements('BTN_VOTER1EURO','voteVainqueursGIF');
					showElement('voteVainqueursOK');
				}
				obj.post({action:'RECUPERERINFOS'},obj.log_callback);
			}else if(r.suc_methode == "RECUPERERINFOS"){
				remplirMatchDuJour({mesVotes: r.mesVotesVainqueursEuro2016, listeMatchDuJour:r.listeMatchDuJour, autresVotes:r.autresVotesVainqueursEuro2016});
				remplirSelectVainqueursMesVotes(r);
				remplirTableauVoteVainqueurs(r, 'tableClassementVainqueursEuro');//vainqueurs EURO 2016				
				compterMeilleurVoteVainqueurEuro2016(r);
				calculScoreChaquePersonne(r.mesVotesVainqueursEuro2016, r.autresVotesVainqueursEuro2016, r.listeMatchDuJour);
			}	
		}else if(r.categorie == "ERROR"){
			if(r.err_methode == "VOTER1EURO"){
				hideShowElements('BTN_VOTER1EURO','voteVainqueursGIF');
				showElement('voteVainqueursKO');
				console.log("error VOTER1EURO");
			}else if(r.err_methode == "RECUPERERINFOS"){
				remplirSelectVainqueursMesVotes({aze:1});
				console.log("error RECUPERERINFOS");
				//document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
			}
		}else{
			alert('une erreur incongrue est arrivée, rechargez la page SVP');
		}
	}
};
//submit des trois premiers de l'euro
document.getElementById('FORM_VOTER1EURO').onsubmit = function(event){
  hideElement('voteVainqueursKOdoublon');
  hideElement('voteVainqueursKO');
  hideElement('voteVainqueursOK');
  var pays1 = document.getElementById('SELECT_VOTER1EURO').value;
  var pays2 = document.getElementById('SELECT_VOTER2EURO').value;
  var pays3 = document.getElementById('SELECT_VOTER3EURO').value;
  if(pays1 == pays2 || pays1== pays3 || pays2 == pays3){
  	showElement('voteVainqueursKOdoublon');
  	return false;
  }
  //remplirSaLigneVoteVainqueur(getParameterByName('pseudo'), pays1, pays2, pays3);
  hideShowElements('voteVainqueursGIF','BTN_VOTER1EURO');
  obj.post({action:'VOTER1EURO', pays1:pays1, pays2:pays2, pays3:pays3}, obj.log_callback);
  return false;
};

//submit pour les groupes
$('#groupe_A_form_id, #groupe_B_form_id, #groupe_C_form_id, #groupe_D_form_id, #groupe_E_form_id, #groupe_F_form_id').on('submit', function(event){
	var groupe = this.id.slice(7,8);
	hideElement('groupe_'+groupe+'_submit_KO_doublon');
	hideElement('groupe_'+groupe+'_submit_KO');
	hideElement('groupe_'+groupe+'_submit_OK');	
	var pays1 = document.getElementById('groupe_'+groupe+'_select_id_1').value;
	var pays2 = document.getElementById('groupe_'+groupe+'_select_id_2').value;
	if(pays1 == pays2){
  	showElement('groupe_'+groupe+'_submit_KO_doublon');
		return false;
	  }	  
	hideShowElements('groupe_'+groupe+'_gif_submit','groupe_'+groupe+'_btn_id');
	obj.post({action:'VOTERGROUPEEURO', groupe: groupe, pays1:pays1, pays2:pays2}, obj.log_callback);
	return false;
});


var remplirSelectVainqueursMesVotes = function(r){
	var data = r.mesVotesVainqueursEuro2016;
	for (var i in arrPaysEuro){
		document.getElementById('SELECT_VOTER1EURO').innerHTML += "<option value="+i+">"+arrPaysEuro[i]+"</option>";
  		document.getElementById('SELECT_VOTER2EURO').innerHTML += "<option value="+i+">"+arrPaysEuro[i]+"</option>";
  		document.getElementById('SELECT_VOTER3EURO').innerHTML += "<option value="+i+">"+arrPaysEuro[i]+"</option>";	
	}
	//vainqueur EURO 2016
	if(data && data.VAINQUEURSEURO2016){//vainqueur 3 premiers euros
		//*********************** */
		remplirSaLigneVoteVainqueur(getParameterByName('pseudo'), data.avatar, data.VAINQUEURSEURO2016.VOTER1EURO, data.VAINQUEURSEURO2016.VOTER2EURO, data.VAINQUEURSEURO2016.VOTER3EURO);
		//*********************** */
		if(data.VAINQUEURSEURO2016.VOTER1EURO){
			afficherSelectReceptionVote('SELECT_VOTER1EURO',data.VAINQUEURSEURO2016.VOTER1EURO, 'SELECT_VOTER1EURO_VOTED');
		}if(data.VAINQUEURSEURO2016.VOTER2EURO){
			afficherSelectReceptionVote('SELECT_VOTER2EURO',data.VAINQUEURSEURO2016.VOTER2EURO, 'SELECT_VOTER2EURO_VOTED');
		}if(data.VAINQUEURSEURO2016.VOTER3EURO){
			afficherSelectReceptionVote('SELECT_VOTER3EURO',data.VAINQUEURSEURO2016.VOTER3EURO, 'SELECT_VOTER3EURO_VOTED');
		}
	}
	showElement('SELECT_VOTER1EURO');
	showElement('SELECT_VOTER2EURO');
	showElement('SELECT_VOTER3EURO');
	//vainqueursPoules
	if(data && data.GROUPEEURO2016_A && data.GROUPEEURO2016_A.VOTER1EURO && data.GROUPEEURO2016_A.VOTER2EURO){
		afficherSelectReceptionVote('groupe_A_select_id_1',data.GROUPEEURO2016_A.VOTER1EURO, 'groupe_A_select_voted_1');
		afficherSelectReceptionVote('groupe_A_select_id_2',data.GROUPEEURO2016_A.VOTER2EURO, 'groupe_A_select_voted_2');
	}
	if(data && data.GROUPEEURO2016_B && data.GROUPEEURO2016_B.VOTER1EURO && data.GROUPEEURO2016_B.VOTER2EURO){
		afficherSelectReceptionVote('groupe_B_select_id_1',data.GROUPEEURO2016_B.VOTER1EURO, 'groupe_B_select_voted_1');
		afficherSelectReceptionVote('groupe_B_select_id_2',data.GROUPEEURO2016_B.VOTER2EURO, 'groupe_B_select_voted_2');
	}
	if(data && data.GROUPEEURO2016_C && data.GROUPEEURO2016_C.VOTER1EURO && data.GROUPEEURO2016_C.VOTER2EURO){
		afficherSelectReceptionVote('groupe_C_select_id_1',data.GROUPEEURO2016_C.VOTER1EURO, 'groupe_C_select_voted_1');
		afficherSelectReceptionVote('groupe_C_select_id_2',data.GROUPEEURO2016_C.VOTER2EURO, 'groupe_C_select_voted_2');
	}
	if(data && data.GROUPEEURO2016_D && data.GROUPEEURO2016_D.VOTER1EURO && data.GROUPEEURO2016_D.VOTER2EURO){
		afficherSelectReceptionVote('groupe_D_select_id_1',data.GROUPEEURO2016_D.VOTER1EURO, 'groupe_D_select_voted_1');
		afficherSelectReceptionVote('groupe_D_select_id_2',data.GROUPEEURO2016_D.VOTER2EURO, 'groupe_D_select_voted_2');
	}
	if(data && data.GROUPEEURO2016_E && data.GROUPEEURO2016_E.VOTER1EURO && data.GROUPEEURO2016_E.VOTER2EURO){
		afficherSelectReceptionVote('groupe_E_select_id_1',data.GROUPEEURO2016_E.VOTER1EURO, 'groupe_E_select_voted_1');
		afficherSelectReceptionVote('groupe_E_select_id_2',data.GROUPEEURO2016_E.VOTER2EURO, 'groupe_E_select_voted_2');
	}
	if(data && data.GROUPEEURO2016_F && data.GROUPEEURO2016_F.VOTER1EURO && data.GROUPEEURO2016_F.VOTER2EURO){
		afficherSelectReceptionVote('groupe_F_select_id_1',data.GROUPEEURO2016_F.VOTER1EURO, 'groupe_F_select_voted_1');
		afficherSelectReceptionVote('groupe_F_select_id_2',data.GROUPEEURO2016_F.VOTER2EURO, 'groupe_F_select_voted_2');
	}
	//vote du jour
	if(data && data.MATCHDUJOUR_){
		console.log(data.MATCHDUJOUR_.VOTER1EURO)
	}

};

var remplirTableauVoteVainqueurs = function (r, documentID){
	var autresVotesObj = r.autresVotesVainqueursEuro2016;
	var str = "";
	var i = 0;
	Object.keys(autresVotesObj).forEach(function(key) {
		if(autresVotesObj[key].VAINQUEURSEURO2016){
		var pseudo = key;
		var avatar = src='<img height=30 class="img-circle" src="../images/avatar/'+autresVotesObj[key].avatar+'.png" </img>&nbsp';
		var vote1 = arrPaysEuro[parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER1EURO)];
		var vote2 = arrPaysEuro[parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER2EURO)];
		var vote3 = arrPaysEuro[parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER3EURO)];
		var img1 = '<img src="../images/flags/'+parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER1EURO)+'.png" alt="Smiley face" height="20" width="30">&nbsp';
		var img2 = '<img src="../images/flags/'+parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER2EURO)+'.png" alt="Smiley face" height="20" width="30">&nbsp';
		var img3 = '<img src="../images/flags/'+parseInt(autresVotesObj[key].VAINQUEURSEURO2016.VOTER3EURO)+'.png" alt="Smiley face" height="20" width="30">&nbsp';
		if(i%2 == 0){
			str += '<tr class="success"><td>'+avatar+pseudo+'</td><td>'+img1+vote1+'</td><td>'+img2+vote2+'</td><td>'+img3+vote3+'</td></tr>'
		}else{
			str += '<tr class="info"><td>'+avatar+pseudo+'</td><td>'+img1+vote1+'</td><td>'+img2+vote2+'</td><td>'+img3+vote3+'</td></tr>'	
		}
		i++;
		}		
	});
	document.getElementById(""+documentID).innerHTML = "";
	document.getElementById(""+documentID).innerHTML += str;
};

var remplirSaLigneVoteVainqueur = function(pseudo, avatar, pays1, pays2, pays3){
	document.getElementById('ligneMesVotesVainqueursEuro').innerHTML = '';
	document.getElementById('ligneMesVotesVainqueursEuro').innerHTML += "<td><img height=30 class='img-circle' src='../images/avatar/"+avatar+".png'</img>&nbsp"+pseudo.toUpperCase()+"</td>";

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

var compterMeilleurVoteVainqueurEuro2016 = function(r){
	var mesVotes = r.mesVotesVainqueursEuro2016;
	var autresVotesObj = r.autresVotesVainqueursEuro2016;
	var objVotesGlobaux = {};
	objVotesGlobaux.voteTotal = 0;//pour savoir le nombre de votes
	objVotesGlobaux.votePremier = -1;//pour savoir le vainqueur
	objVotesGlobaux.pourcentage = 100;
	if(mesVotes && mesVotes.VAINQUEURSEURO2016){//si j'ai des votes
		objVotesGlobaux[mesVotes.VAINQUEURSEURO2016.VOTER1EURO] = 1; //mon vote vainqueur
		objVotesGlobaux.voteTotal += 1;//on ajoute une voix
	}
	if(autresVotesObj){//si d'autres votes
		Object.keys(autresVotesObj).forEach(function(key) {
			if(autresVotesObj[key].VAINQUEURSEURO2016){
				if(objVotesGlobaux[autresVotesObj[key].VAINQUEURSEURO2016.VOTER1EURO])
					objVotesGlobaux[autresVotesObj[key].VAINQUEURSEURO2016.VOTER1EURO] += 1;
				else
					objVotesGlobaux[autresVotesObj[key].VAINQUEURSEURO2016.VOTER1EURO] = 1;
				objVotesGlobaux.voteTotal += 1;//on ajoute une voix
			}
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
		document.getElementById('progress_bar_id_vainqueur_euro_2016').innerHTML = arrPaysEuro[parseInt(objVotesGlobaux.votePremier)]+" avec "+objVotesGlobaux.pourcentage+" % des votes !";
	}
};
//compteur pour le match du jour
var compteurMatchDuJour = function(mesVotes, autresVotesObj, _idMatch){
	var _idMatch2 = _idMatch;
	_idMatch = 'MATCHDUJOUR_'+_idMatch;
	var objVotesGlobaux = {};
	objVotesGlobaux.voteTotal = 0;//pour savoir le nombre de votes
	objVotesGlobaux.paysVoted = new Array();
	objVotesGlobaux.pourcentage = new Array();
	if(mesVotes && mesVotes[_idMatch]){//si j'ai des votes
		objVotesGlobaux[mesVotes[_idMatch].VOTER1EURO] = 1; //mon vote vainqueur
		objVotesGlobaux.voteTotal += 1;//on ajoute une voix
	}
	if(autresVotesObj){//si d'autres votes
		Object.keys(autresVotesObj).forEach(function(key) {
			if(autresVotesObj[key][_idMatch]){
				if(objVotesGlobaux[autresVotesObj[key][_idMatch].VOTER1EURO])
					objVotesGlobaux[autresVotesObj[key][_idMatch].VOTER1EURO] += 1;
				else
					objVotesGlobaux[autresVotesObj[key][_idMatch].VOTER1EURO] = 1;
			objVotesGlobaux.voteTotal += 1;//on ajoute une voix
			}
		});
	}
	Object.keys(objVotesGlobaux).forEach(function(key) {
		if(Number.isInteger(parseInt(key))){
			objVotesGlobaux.paysVoted.push(key);
			objVotesGlobaux.pourcentage.push(Math.floor(objVotesGlobaux[key]/(objVotesGlobaux.voteTotal)*100));
		}
	});
	for (var i = 0; i< 3 ; i++){
		var _id2 = 'display_progress_'+i+'_'+_idMatch2;
		document.getElementById(_id2).style.display = "none";
	}
	if(objVotesGlobaux.paysVoted.length>0){
		for(var i = 0; i <objVotesGlobaux.paysVoted.length ; i++ ){
			var _id = 'progress_bar_id_vainqueur_match_du_jour_'+i+'_'+_idMatch2;
			var _id2 = 'display_progress_'+i+'_'+_idMatch2;
			document.getElementById(_id).style.width = ""+objVotesGlobaux.pourcentage[i]+"%";
			document.getElementById(_id2).style.display = "";
			if(objVotesGlobaux.paysVoted[i] != -1)
				document.getElementById(_id).innerHTML = arrPaysEuro[parseInt(objVotesGlobaux.paysVoted[i])]+" avec "+objVotesGlobaux.pourcentage[i]+" % des votes !";
			else
				document.getElementById(_id).innerHTML = "Match nul avec "+objVotesGlobaux.pourcentage[i]+" % des votes !";
		}
	}
	console.log(objVotesGlobaux);
};

//on rempli le match du jour
var remplirMatchDuJour = function(data){
	var ref = "";
	document.getElementById('row_match_jour').innerHTML = "";
	if(data && data.listeMatchDuJour){
		Object.keys(data.listeMatchDuJour).forEach(function(key) {
			if(data.listeMatchDuJour[key].affichage){
				//on affiche le panel body
				ref = ""+ data.listeMatchDuJour[key].id_match;
				var str = '<div class="col-lg-6"><div class="panel panel-default"><div class="panel-heading text-center"><h3 class="">Match du jour : <img alt="trophy" src="../images/trophy.png" ><em style="color:grey"><span id="id_points_match_jour_'+ref+'"></span></em></h3><small id="id_expiration_match_jour_'+ref+'" class="text-danger text-center" style="display:none;">Les votes sont clôturés !</small></div><div class="panel-body" style="max-height: 376px;overflow-y: scroll;"><div class="table-responsive"><table class="table"><thead><tr><th id="matchDuJourPays1_'+ref+'" class="text-center"></th><th id="matchDuJourNul_'+ref+'" class="text-center"></th><th id="matchDuJourPays2_'+ref+'" class="text-center"></th></tr></thead><tbody><tr><td class="text-center" id="btn_matchDuJour_id_1_'+ref+'"></td><td class="text-center" id="btn_matchDuJour_id_nul_'+ref+'"></td><td class="text-center" id="btn_matchDuJour_id_2_'+ref+'"></td></tr></tbody><tbody><tr><td colspan="3" id="votre_choix_match_du_jour_id_'+ref+'" class="text-center"></td></tr><tr><td colspan="3" class="text-center"><h3>Résultat de tous les votes:</h3><div class="progress" style="display:none;" id="display_progress_0_'+ref+'"><div id="progress_bar_id_vainqueur_match_du_jour_0_'+ref+'"class="progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="     100" style="width: 0%;">Pas de votes</div></div> <div class="progress" style="display:none;" id="display_progress_1_'+ref+'"><div id="progress_bar_id_vainqueur_match_du_jour_1_'+ref+'"class="progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="     100" style="width: 0%;">Pas de votes</div></div> <div class="progress" style="display:none;" id="display_progress_2_'+ref+'"><div id="progress_bar_id_vainqueur_match_du_jour_2_'+ref+'"class="progress-bar-danger" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="     100" style="width: 0%;">Pas de votes</div></div></td></tr></tbody></table></div></div></div></div>';
				$('#row_match_jour').prepend(str);
				//fin on affiche le panel body

				//on remplie l'objet data avec ce dont on a besoin
				data.pays1 = data.listeMatchDuJour[key].pays1;
				data.pays2 = data.listeMatchDuJour[key].pays2;
				data.id_match = data.listeMatchDuJour[key].id_match;				
				//fin remplissage data

				//on compare la date du match avec la date du pc pour bloquer les votes
				if(data.listeMatchDuJour[key].expireDate < new Date().getTime()){
					data.isDisabled = "disabled";					
					document.getElementById('id_expiration_match_jour_'+ref).style.display = "";
					if(data.listeMatchDuJour[key].vainqueur){
						if(data.listeMatchDuJour[key].vainqueur == -1){
							document.getElementById('id_expiration_match_jour_'+ref).innerHTML = "Match Nul";
						}else{
							document.getElementById('id_expiration_match_jour_'+ref).innerHTML = "Vainqueur : "+arrPaysEuro[data.listeMatchDuJour[key].vainqueur]
						}
					}
				}else{
					data.isDisabled ="";
					document.getElementById('id_expiration_match_jour_'+ref).style.display = "none";
				}
				//fin compare

				//affichage informations diverses
				//images drapeaux
				var img1 = '<img src="../images/flags/'+data.pays1+'.png" alt="Smiley face" height="20" width="30">&nbsp';
				var img2 = '<img src="../images/flags/'+data.pays2+'.png" alt="Smiley face" height="20" width="30">&nbsp';
				//nom pays + drapeau
				document.getElementById('matchDuJourPays1_'+ref).innerHTML = img1+arrPaysEuro[data.pays1];
				document.getElementById('matchDuJourNul_'+ref).innerHTML = "NUL";
				document.getElementById('matchDuJourPays2_'+ref).innerHTML = img2 + arrPaysEuro[data.pays2];
				//boutons
				document.getElementById('btn_matchDuJour_id_1_'+ref).innerHTML = '<button type="" id="btn_voter_match_du_jour_1_'+ref+'" class="btn btn-default" onclick="ftcVoterMatchDuJour('+data.pays1+',\'btn_matchDuJour_id_1\',\''+data.id_match+'\')" '+data.isDisabled+'>Votez !</button>';
				document.getElementById('btn_matchDuJour_id_nul_'+ref).innerHTML = '<button type="" id="btn_voter_match_du_jour_nul_'+ref+'" class="btn btn-default" onclick="ftcVoterMatchDuJour(-1,\'btn_matchDuJour_id_nul\',\''+data.id_match+'\')" '+data.isDisabled+'>Votez !</button>';
				document.getElementById('btn_matchDuJour_id_2_'+ref).innerHTML = '<button type="" id="btn_voter_match_du_jour_2_'+ref+'" class="btn btn-default" onclick="ftcVoterMatchDuJour('+data.pays2+', \'btn_matchDuJour_id_2\',\''+data.id_match+'\')" '+data.isDisabled+'>Votez !</button>';				
				//nombre de points pour le match
				document.getElementById('id_points_match_jour_'+ref).innerHTML = data.listeMatchDuJour[key].points + " points";
				//si on a voté, on affiche son vote
				if(data.mesVotes && data.mesVotes['MATCHDUJOUR_'+data.id_match]){
					if(data.mesVotes["MATCHDUJOUR_"+data.id_match].VOTER1EURO == -1){
						document.getElementById('votre_choix_match_du_jour_id_'+ref).innerHTML = '<span class="text-success"> Vous avez voté pour le match nul </span>';
					}else{
						document.getElementById('votre_choix_match_du_jour_id_'+ref).innerHTML = '<span class="text-success"> Vous avez voté pour la '+arrPaysEuro[data.mesVotes["MATCHDUJOUR_"+data.id_match].VOTER1EURO]+'</span>';
					}
				}else{
					document.getElementById('votre_choix_match_du_jour_id_'+ref).innerHTML = 'Faites un vote !';
				}
				//on affiche les progress bar
				compteurMatchDuJour(data.mesVotes, data.autresVotes, data.id_match);
			}
		});
	}
};

//bouton voter pour le match du jour
var ftcVoterMatchDuJour = function(index,id, _id_match){
	//document.getElementById(id).innerHTML = '<img src="../images/ajax-loader-mid.gif" style="height:auto; width:auto;">';
	document.getElementById('votre_choix_match_du_jour_id_'+_id_match).innerHTML = '<img src="../images/ajax-loader-mid.gif" style="height:auto; width:auto;">';
	obj.post({action:'VOTERMATCHDUJOUR', pays1:index, _id_match:_id_match},obj.log_callback);
};

//pour afficher les scores
var calculScoreChaquePersonne = function(mesVotes, autresVotes, listeMatchDuJour){
	var arrMatchId = new Array();
	var arrMatchVainqueur = new Array();
	var arrMatchPoints = new Array();
	var arrPseudo = new Array();

	Object.keys(listeMatchDuJour).forEach(function(key) {
		arrMatchId.push(listeMatchDuJour[key].id_match);//on stocke les id des matchs
		arrMatchVainqueur.push(listeMatchDuJour[key].vainqueur);
		arrMatchPoints.push(listeMatchDuJour[key].points);
	});
	//tous les autres votes
	Object.keys(autresVotes).forEach(function(key) {
		var score = 0;
		for(var i in arrMatchId){
			if(autresVotes[key]['MATCHDUJOUR_'+arrMatchId[i]] && autresVotes[key]['MATCHDUJOUR_'+arrMatchId[i]].VOTER1EURO == arrMatchVainqueur[i]){				
				score+=arrMatchPoints[i];
			}
		}
		arrPseudo.push({pseudo:key,score:score, avatar:autresVotes[key].avatar});				
	});
	//mes Votes
	mesVotes = {[getParameterByName('pseudo').toUpperCase()]:mesVotes};
	Object.keys(mesVotes).forEach(function(key) {
		var score = 0;
		for(var i in arrMatchId){
			if(mesVotes[key]['MATCHDUJOUR_'+arrMatchId[i]] && mesVotes[key]['MATCHDUJOUR_'+arrMatchId[i]].VOTER1EURO == arrMatchVainqueur[i]){				
				score+=arrMatchPoints[i];			
			}
		}
		arrPseudo.push({pseudo:key,score:score, avatar:mesVotes[key].avatar});					
	});
	arrPseudo.sort(function(a,b) {return (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0);} ); 
	afficherClassementScore(arrPseudo);
};

var afficherClassementScore = function(arr){
	document.getElementById('table_classement_score').innerHTML = "";
	for(var i = arr.length-1; i>= 0; i--){
		var avatar = '<img height=30 class="img-circle" src="../images/avatar/'+arr[i].avatar+'.png" </img>&nbsp';
		document.getElementById('table_classement_score').innerHTML += "<tr ><td>"+avatar+arr[i].pseudo+"</td><td>"+arr[i].score+" points</td></tr>"
	}
};

// on met le valeur dans le select et on affiche 'vous avez voté'
var afficherSelectReceptionVote = function(idSelect, value, spanPhraseVote){
	showElement(spanPhraseVote);
	document.getElementById(idSelect).value = value;
};

//recupere les votes et autres
obj.post({action:'RECUPERERINFOS'},obj.log_callback);


