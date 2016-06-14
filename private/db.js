/**
* message retour ko sur la forme : <nomDeLaFonction>_<l+numeroDeLigne>_<koOUok>
*/

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;


//var ID_MONGO = process.env.DATABASE_URL;
var ID_MONGO = "mongodb://userdev:pwduserdev@dogen.mongohq.com:10036/ProjetEsme";


//collections
var COLLECTIONNAME = 'pronosSportif';//il y a deja une collection
var COLLECTIONNAMEUSERS = 'pronos_users';//document des users
var COLLECTION_COMPETITION ='pronos_competition';//collection pronos_competition
//messages d'erreur
var ERR_CONNECTION_BASE = 'erreur lors de la connection à la base de données';
var CATEGORIE_ERREUR = 'ERROR';
var CATEGORIE_OK = 'SUCCESS';


// Ajout AM 16/12/15
exports.signup = function(b,res){
	var NOM_METHODE = 'SIGNUP';
	MongoClient.connect(ID_MONGO, function(err, db) {
	if(err) {//en cas d'erreur de connection
		res.writeHead(503, {"Content-Type": "application/json" });
		res.end(JSON.stringify({categorie:CATEGORIE_ERREUR, err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
		return;
	}else{
		res.writeHead(200, {"Content-Type": "application/json" });
		var collection_users = db.collection(COLLECTIONNAMEUSERS);
		var cookieValue =  b.pseudo.substring(0,3) + Math.floor(Math.random() * 100000000);//pour cookieName
		cookieValue = pad(20,cookieValue,'0');
		var cookieExpire = new Date(new Date().getTime()+ 365*24*60*60*1000).toUTCString();//si rememberme pas cochee, 15min
		b.cookieValue =cookieValue;
		b.rememberme = false;
		collection_users.insert(b,function(err, doc){
			if(err){				
				res.end(JSON.stringify({categorie:CATEGORIE_ERREUR, err_methode: NOM_METHODE, err_ligne: "2", err_message:"signUpDoublon"}));
				db.close();
			}else{
				res.writeHead(200, {"Content-Type": "'text/plain'", "Set-Cookie" : 'cookieName='+cookieValue+';expires='+cookieExpire});//on ecrit le cookie chez le client					
				res.end(JSON.stringify({categorie:CATEGORIE_OK, suc_methode: NOM_METHODE, avatar:b.avatar, gender:b.gender, pseudo:b.pseudo}));
				db.close();
			}
		});
	}
});
};
//fin Ajout AM 16/12/15

/**
* RCU - 09/08/2015 - Ajout fonction sign-in, pour se connecter à son compte
* parametres entres : login et password
************************************************************************************
*
*/
exports.signin = function(data, res){//fonction pour ajouter un USER
	var NOM_METHODE = "SIGNIN";
	MongoClient.connect(ID_MONGO, function(err, db) {
	    if(err){
	    	throw err;
	    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
	    }else{	
			var collection_users = db.collection(COLLECTIONNAMEUSERS);
			collection_users.find({pseudo:data.formLogin, pwd:data.formPassword}).toArray(function(err, results){			
				if (err) {
					res.writeHead(503, {"Content-Type": "application/json" });
					throw err;
					res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "2", err_message:ERR_CONNECTION_BASE}));
				}else{
					if (results[0]){//si on trouve bien le login et le PW associé dans la base de donnée
						if(results[0].pseudo == "ADMIN"){
							var cookieValue =  data.formLogin.substring(0,3) + Math.floor(Math.random() * 100000000);//pour cookieName
							cookieValue = pad(20,cookieValue,'0');
							var cookieExpire = new Date(new Date().getTime()+ 365*24*60*60*1000).toUTCString();//si la case rememberme est cochée, 1 an
							res.writeHead(200, {"Content-Type": "'text/plain'", "Set-Cookie" : 'adminazeqsd='+cookieValue+';expires='+cookieExpire});//on ecrit le cookie chez le client					
							res.end(JSON.stringify({categorie:CATEGORIE_OK,suc_methode:NOM_METHODE,data:'admin'}));
						}
						var cookieValue =  data.formLogin.substring(0,3) + Math.floor(Math.random() * 100000000);//pour cookieName
						cookieValue = pad(20,cookieValue,'0');
						if (data.formRememberMe == true){
							var cookieExpire = new Date(new Date().getTime()+ 365*24*60*60*1000).toUTCString();//si la case rememberme est cochée, 1 an
						}else{
							var cookieExpire = new Date(new Date().getTime()+ 365*24*60*60*1000).toUTCString();//si rememberme pas cochee, 15min
						}								
						collection_users.update(
							{pseudo:data.formLogin, pwd:data.formPassword},
							{$set:
								{					 					 
								 rememberme: data.formRememberMe,
								 cookieValue: cookieValue
								}
							},
							{upsert: false}, function(err, doc){
							if (err){
								throw err;
								res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "3", err_message:'erreur methode update inconnue'}));
							} console.log("doc: " + doc);
						}); // fin update
						res.writeHead(200, {"Content-Type": "'text/plain'", "Set-Cookie" : 'cookieName='+cookieValue+';expires='+cookieExpire});//on ecrit le cookie chez le client					
						res.end(JSON.stringify({categorie:CATEGORIE_OK,suc_methode:NOM_METHODE,data:results[0]}));
					}else{
						res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "4", err_message:'Login or password are false !'}));
					}
				}
				//db.close();
			});	
		}    

	});
};
// fin RCU - 09/08/2015 - Ajout fonction sign-in, pour se connecter à son compte

/**
* RCU - 09/08/2015 - Ajout fonction qui verifie l'existence d'un cookie dans la DB
* parametres entree : c : le cookie du client, dans le header, fct : la fct renvoye au routeur
* collection : bourse_users
************************************************************************************
*/
exports.valid_cookie = function(c, obj, fct){
	var NOM_METHODE = 'valid_cookie';
	if (c && c.indexOf("cookieName=") != -1){
		MongoClient.connect(ID_MONGO, function(err, db) {
		if(err){
	    	throw err;
	    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "71", err_message:ERR_CONNECTION_BASE}));
	    }	
		var collection = db.collection(COLLECTIONNAMEUSERS);
		c = c.split("cookieName=");//car cookieName=rom19282839;azeaze" par excemple donc on eneleve le cookieName
		c = c[1];
		c = c.substr(0,20);		
		 collection.find({cookieValue: c}).toArray(function(err, results) {
		 if (err){		 	
		 	obj[fct](false);	 
		 }else if (results[0]){		 	
		 	obj[fct](true); 
		 }else if (!results[0]){		 	
		 	obj[fct](false);	 
		 }		 
	 });	
	})
	}else{
		obj[fct](false);	 
	}
};
// fin RCU - 09/08/2015 - Ajout fonction qui verifie l'existence d'un cookie dans la DB


/**
* RCU 25/12/2015 - recuperation pseudo via cookie c
*/

exports.checkCookie = function(c, res){
	var NOM_METHODE = "CHECKCOOKIE";	
	MongoClient.connect(ID_MONGO, function(err, db) {
	    if(err){
	    	throw err;
	    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
	    }else{	
			var collection = db.collection(COLLECTIONNAMEUSERS);
			c = c.split("cookieName=");//car cookieName=rom19282839" par excemple donc on eneleve le cookieName
			c = c[1];
			c = c.substr(0,20);
			collection.find({cookieValue: c}).toArray(function(err, results) {
			if (err){
				res.writeHead(503, {"Content-Type": "application/json" });	
				res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "2", err_message:"erreur find"}));	 								
			}else if (results[0]){	
				var r = results[0];
				res.writeHead(200, {"Content-Type": "application/json" });
				res.end(JSON.stringify({categorie:CATEGORIE_OK,suc_methode: NOM_METHODE, data:r}));
			}else if (!results[0]){	 	
				res.writeHead(503, {"Content-Type": "application/json" });	
				res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "3", err_message:"pas de cookie"}));
			}
		})
		}//else
});
};
//fin RCU 25/12/2015

/**
* RCU 25/12/2015 - recuperation pseudo via cookie c
*/

exports.getInfosViaCookieForRooter = function(c, obj, fct){
	var NOM_METHODE = "GETINFOSVIACOOKIEFORROOTER";	
	MongoClient.connect(ID_MONGO, function(err, db) {
	    if(err){
	    	throw err;
	    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
	    }else{	
			var collection = db.collection(COLLECTIONNAME);
			var collection_users = db.collection(COLLECTIONNAMEUSERS);
			c = c.split("cookieName=");//car cookieName=rom19282839;azeaze" par excemple donc on eneleve le cookieName
			c = c[1];
			c = c.substr(0,20);
			collection_users.find({cookieValue: c}).toArray(function(err, results) {
			if (err){		 	
				obj[fct]("false 1");	 
			}else if (results[0]){
				var query =  { pseudo: { "$in": [ "ADMIN", "parisVainqueursEuro2016" ] }};
				//query[''+results[0].pseudo+'.VAINQUEURSEURO2016'] = {'$exists' : true};
				collection.find(query).toArray(function(err, results2) {
				if (err){		 	
					obj[fct]("false 2");	 
				}else if (results2[0]){
					obj[fct](results[0],results2);
				}else{		 	
					obj[fct](query);	 
				}
				});//deuxieme find
			}else{		 	
				obj[fct]("false 4");	 
			}
		})
		}//else
});
};
//fin RCU 25/12/2015

exports.faireUnParis = function(res, c, b){
	var NOM_METHODE = "VOTER1EURO";	
	MongoClient.connect(ID_MONGO, function(err, db) {
	    if(err){
	    	throw err;
	    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
	    }else{
	    var collection = db.collection(COLLECTIONNAME);
	    var collection_users = db.collection(COLLECTIONNAMEUSERS);
		c = c.split("cookieName=");//car cookieName=rom19282839;azeaze" par excemple donc on eneleve le cookieName
		c = c[1];
		c = c.substr(0,20);
		collection_users.find({cookieValue: c}).toArray(function(err, results) {//pour trouver le pseudo
			if (err){		 	
				throw err;
				res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "2", err_message:'erreur methode update inconnue'}));	 
			}else if (results[0]){//on update le champ
				var update = { $set : {} };
				update.$set['' + results[0].pseudo +'.'+b.destinationVote] = b.stockVote;
				update.$set['' + results[0].pseudo +'.avatar'] = results[0].gender+'/'+results[0].avatar;
				collection.update({pseudo:"parisVainqueursEuro2016"},
				update,
				{upsert: false}, function(err, doc){
				if (err){
					throw err;
					res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "3", err_message:'erreur methode update inconnue'}));
				}
				else if (doc){
					res.writeHead(200, {"Content-Type": "'text/plain'"});					
					res.end(JSON.stringify({categorie:CATEGORIE_OK,suc_methode:NOM_METHODE, data: b}));
				}else{
					res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "4", err_message:'erreur methode update inconnue'}));
				}
				}); // fin update
			}else if (!results[0]){		 	
				throw err;
				res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "5", err_message:'erreur no cookie'}));	 
			}
		});//find
	    }
	});
};
/**
*********************************************************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************
*********************************PARTIE    ADMIN*********************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************
*********************************************************************************************************************************
*/

//admin : recupere toutes les competitions et leurs données
exports.adminGetData = function(res,b){
	var NOM_METHODE = "GET_DATA";	
		MongoClient.connect(ID_MONGO, function(err, db) {
		    if(err){
		    	throw err;
		    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
		    }else{
		    	var collection = db.collection(COLLECTION_COMPETITION);
		    	collection.find().toArray(function(err, results){
		    			if (err){
							throw err;
							res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:"erreur get data"}));
						}
						else if (results[0]){
							res.writeHead(200, {"Content-Type": "'text/plain'"});
							res.end(JSON.stringify({categorie:CATEGORIE_OK, suc_methode: NOM_METHODE, message:"recuperation des matchs ok", data:results}));											
						}else{
							res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:"pas de document"}));
						}
		    		}
		    	);
		}
	});
};

//ajouter competition
exports.adminAddCompetition = function(res, obj){
		var NOM_METHODE = "ADD_COMPETITION";
		res.writeHead(200, {"Content-Type": "'text/plain'"});
		MongoClient.connect(ID_MONGO, function(err, db) {
		    if(err){
		    	throw err;
		    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
		    }else{
		    	var collection = db.collection(COLLECTION_COMPETITION);
		    	collection.update({name:obj.name, saison:obj.saison},
		    		{
		    			$set:{
		    				name: obj.name,
		    				saison: obj.saison,
		    				id_competition: obj.id_competition,
		    				sport:obj.sport,
		    				journee:obj.journee
		    			}
		    		},
		    		{upsert:true},
		    		function(err, doc){
		    			if (err){
							throw err;
							res.end(JSON.stringify({categorie:CATEGORIE_ERREUR, err_methode: NOM_METHODE, err_ligne: "2", err_message:"ajout competition echec"}));
						}
						else{											
							res.end(JSON.stringify({categorie:CATEGORIE_OK, suc_methode: NOM_METHODE, message:"ajout competition ok"}));
						}
		    		}
		    	);
		}
	});
};
//supprimer une competition
exports.adminDelCompetition = function(res, obj){
	var NOM_METHODE = "DEL_COMPETITION";
		res.writeHead(200, {"Content-Type": "'text/plain'"});
		MongoClient.connect(ID_MONGO, function(err, db) {
		    if(err){
		    	throw err;
		    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
		    }else{
		    	var collection = db.collection(COLLECTION_COMPETITION);
		    	collection.remove({id_competition:obj.id_competition},
		    		function(err, doc){
		    			if (err){
							throw err;
							res.end(JSON.stringify({categorie:CATEGORIE_ERREUR, err_methode: NOM_METHODE, err_ligne: "2", err_message:"suppression competition echec"}));
						}
						else{											
							res.end(JSON.stringify({categorie:CATEGORIE_OK, suc_methode: NOM_METHODE, message:"suppression competition ok"}));
						}
		    		}
		    	);
		}
	});
};

//ajouter une equipe
exports.adminAddTeam = function(res, obj){
	var NOM_METHODE = "ADD_TEAM";
		res.writeHead(200, {"Content-Type": "'text/plain'"});
		MongoClient.connect(ID_MONGO, function(err, db) {
		    if(err){
		    	throw err;
		    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
		    }else{
		    	var collection = db.collection(COLLECTION_COMPETITION);
		    	collection.update({id_competition:obj.id_competition},
		    		{ $push: { teams: { $each: obj.teams } } },
		    		function(err, doc){
		    			if (err){
							throw err;
							res.end(JSON.stringify({categorie:CATEGORIE_ERREUR, err_methode: NOM_METHODE, err_ligne: "2", err_message:"ajout equipes echec"}));
						}
						else{											
							res.end(JSON.stringify({categorie:CATEGORIE_OK, suc_methode: NOM_METHODE, message:"ajout equipe ok"}));
						}
		    		}
		    	);
		}
	});
};

//supprimer une equipe
exports.adminDelTeam = function(res, obj){
	var NOM_METHODE = "DEL_TEAM";
		res.writeHead(200, {"Content-Type": "'text/plain'"});
		MongoClient.connect(ID_MONGO, function(err, db) {
		    if(err){
		    	throw err;
		    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
		    }else{
		    	var collection = db.collection(COLLECTION_COMPETITION);
		    	collection.update({id_competition:obj.id_competition},
		    		{ $pull: { teams: { id_team:obj.id_team } } },
		    		function(err, doc){
		    			if (err){
							throw err;
							res.end(JSON.stringify({categorie:CATEGORIE_ERREUR, err_methode: NOM_METHODE, err_ligne: "2", err_message:"suppression equipes echec"}));
						}
						else{											
							res.end(JSON.stringify({categorie:CATEGORIE_OK, suc_methode: NOM_METHODE, message:"suppression equipe ok"}));
						}
		    		}
		    	);
		}
	});
};

//ajouter un match
exports.adminAddMatch = function(res, obj){
	var NOM_METHODE = "ADD_MATCH";
		res.writeHead(200, {"Content-Type": "'text/plain'"});
		MongoClient.connect(ID_MONGO, function(err, db) {
		    if(err){
		    	throw err;
		    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
		    }else{
		    	var collection = db.collection(COLLECTION_COMPETITION);
		    	collection.update({id_competition:obj.id_competition},
		    		{ $push: { matchs: { $each: obj.matchs } } },
		    		function(err, doc){
		    			if (err){
							throw err;
							res.end(JSON.stringify({categorie:CATEGORIE_ERREUR, err_methode: NOM_METHODE, err_ligne: "2", err_message:"ajout match echec"}));
						}
						else{											
							res.end(JSON.stringify({categorie:CATEGORIE_OK, suc_methode: NOM_METHODE, message:"ajout match ok"}));
						}
		    		}
		    	);
		}
	});
};

//supprimer un match
exports.adminDelMatch = function(res, obj){
	var NOM_METHODE = "DEL_MATCH";
		res.writeHead(200, {"Content-Type": "'text/plain'"});
		MongoClient.connect(ID_MONGO, function(err, db) {
		    if(err){
		    	throw err;
		    	res.end(JSON.stringify({categorie:CATEGORIE_ERREUR,err_methode: NOM_METHODE, err_ligne: "1", err_message:ERR_CONNECTION_BASE}));
		    }else{
		    	var collection = db.collection(COLLECTION_COMPETITION);
		    	collection.update({id_competition:obj.id_competition},
		    		{ $pull: { matchs: { id_match:obj.id_match } } },
		    		function(err, doc){
		    			if (err){
							throw err;
							res.end(JSON.stringify({categorie:CATEGORIE_ERREUR, err_methode: NOM_METHODE, err_ligne: "2", err_message:"suppression match echec"}));
						}
						else{											
							res.end(JSON.stringify({categorie:CATEGORIE_OK, suc_methode: NOM_METHODE, message:"suppression match ok"}));
						}
		    		}
		    	);
		}
	});
};


//RCU 29/03/2016
// ajout fonction pad pour que les cookies aient tous la même longueur
function pad(width, string, padding) { 
  return (width <= string.length) ? string : pad(width, padding + string, padding)
}
//fin RCU 29/03/2016
