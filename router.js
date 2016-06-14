var util = require("util"); 
var url = require("url"); 
var fs = require("fs");
var db = require("./private/db.js");

var chatRoomArray = new Array();
var keySignUp = ["170868021", "614209486", "351105936", "904305695", "220425509", "308762382", "35629449", "313038326", "937738415", "335028273", "488610600", "291507150", "477068703", "136464234", "893264933", "593100108", "43714495", "129589807", "306396163", "347728654", "350031403", "366011722", "309613262", "106801707", "551188621", "930735883", "218910524", "741871738", "961915044", "20602840", "775540887", "670030642", "374048786", "39785708", "319508659", "444971685", "239752528", "792690038", "512180504", "755239402", "800450430", "208764781", "283077851", "728897325", "323833074", "39577290", "32598842", "608604964", "695448875", "590320029", "904162418", "782598074", "318841354", "3919012", "583136915", "620300353", "13451034", "892447110", "316524258", "581396441", "444413881", "786009229", "440071757", "470016400", "626876906", "298629371", "809988282", "782738086", "783248958", "601630363", "271556321", "967418286", "231297853", "545975897", "371742640", "124065197", "40366181", "606445770", "230188739", "776619618", "880224133", "817837085", "116654985", "98288764", "33230822", "843199247", "154563034", "478778532", "649294393", "434671018", "642307463", "972979257", "803606352", "588883627", "72244798", "530889025", "972666543", "456486783", "94569284", "205350859"];
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
 

/**
* This method is used to process the request * @param req (Object) the request object
* @param resp (Object) the response object */

exports.router = function (req, resp) {
	var inc_request = new srouter(req, resp);
	inc_request.run();
	inc_request = null;
};

/* --------*/

srouter = function (req, resp) {
	 if (req && resp) {
			this.req = req;
			this.resp = resp;
			this.pathname = "";
			this.filetype = "";
			this.path = "";
			this.image_file = "jpg png jpeg bmp gif"; 
	} else {
			util.log("ERROR - A srouter object need a request and a response object");
			return;
			}
};

srouter.prototype = {
run:
	function () { 
		this.rest_method	();
	},

rest_method:
	function () {
		if (this.req.method == "GET") { 
			this.get_method();
		} else if (this.req.method == "POST") {
			this.post_method();
		} else {
			this.resp.writeHead(501, {"Content-Type": "application/json"});
			this.resp.write(JSON.stringify({message: "Not Implemented"}));
			this.resp.end();
			return;
		}
},



get_method:
	function () {
		var u = url.parse(this.req.url, true, true);
		u.path = u.pathname;//pour pouvoir marcher avec paramètres
		var regexp = new RegExp("[/]+", "g");
		this.pathname = u.pathname.split(regexp);
		this.pathname = this.pathname.splice(1, this.pathname.length - 1); this.filetype = this.pathname[this.pathname.length - 1].split(".");
		this.filetype = this.filetype[this.filetype.length - 1];
		this.filtype = this.filetype;
		this.path = "." + u.path;		
		if (this.pathname[1] == "admin.html")//pour voir dans quel page on va
		{
			if(this.req.headers.cookie && this.req.headers.cookie.indexOf('adminazeqsd') != -1){
				this.read_file();
			}				
			else{
				this.resp.writeHead(301, {Location: '../index.html?err=cookieNotFound'});
				this.resp.end();	
			}
		}
		else if (this.pathname[0] == "html")//pour voir dans quel page on va
		{
			db.valid_cookie(this.req.headers.cookie, this, "check_cookie");
		}
		else
		{			
			this.read_file();
		}
		},

check_cookie:
	function (ret) {		
		if (ret) {				
			this.read_file();			
		}else{			
			this.resp.writeHead(301, {Location: '../index.html?err=cookieNotFound'});
			this.resp.end();	
		}
	},

post_method:
	function (){
		var _this = this;
        var buff = "";
        this.req.on("data", function (c) {
            buff += c;
        });
        this.req.on("end", function () {
            _this.go_post(buff);
        });
    },



go_post:
	function (b) {
		b = JSON.parse(b);
		this.b = b;		
		if(b.action == "signin") {
			b.formLogin = b.formLogin.toUpperCase();
			db.signin(b, this.resp);
		}else if(b.action == "SIGNUP"){
			if(b.uniqueKey && keySignUp.indexOf(b.uniqueKey) != -1){
				keySignUp.splice(keySignUp.indexOf(b.uniqueKey) , 1);			
				var objDb = {};//on cree nouvel objet pour etre sur qu on insere bien ce que l on veut dans la base : pseudo, mail...
				verificationFormulaireRegister(objDb,b);				
				db.signup(objDb, this.resp);
			}else{
				this.resp.end(JSON.stringify({etat:"signupKO",message:"key non trouvée"}));
			}			
		}else if(b.admin){
			if(this.req.headers.cookie.indexOf('adminazeqsd') == -1){
				this.resp.end(JSON.stringify({message:"nocookie"}));
			}else if(b.action == "ADD_MATCH_JOUR"){
				db.adminAddMatchDuJour(this.resp, b);
			}else if(b.action == "GET_DATA"){
				db.adminGetData(this.resp, b);
			}else if(b.action == "MAJ_MATCH_JOUR"){
				db.adminMajMatchJour(this.resp, b.listeMatch);
			}else if(b.action == "ADD_COMPETITION"){
				db.adminAddCompetition(this.resp, b);
			}else if(b.action == "DEL_COMPETITION"){
				db.adminDelCompetition(this.resp, b);
			}else if(b.action == "ADD_TEAM"){
				db.adminAddTeam(this.resp, b);
			}else if(b.action == "DEL_TEAM"){
				db.adminDelTeam(this.resp, b);
			}
		}else {			
			db.valid_cookie(this.req.headers.cookie, this, "cb_cookie");
		}	
},


cb_cookie:
	function (ret) {	
		var b = this.b;
		if (ret) {
			if (b.action == 'CHECKCOOKIE'){
				db.checkCookie(this.req.headers.cookie, this.resp);
				return;
			}else if(b.action == "VOTER1EURO"){
				if(!verifPaysListeEURO(b.pays1)) b.pays1 = 1;
				if(!verifPaysListeEURO(b.pays2)) b.pays2 = 1;
				if(!verifPaysListeEURO(b.pays3)) b.pays3 = 1;
				b.destinationVote = 'VAINQUEURSEURO2016';
				b.stockVote = {VOTER1EURO: b.pays1, VOTER2EURO: b.pays2, VOTER3EURO: b.pays3};
				db.faireUnParis(this.resp, this.req.headers.cookie, b);
			}else if(b.action == "VOTERGROUPEEURO"){
				//on verifie que les pays existent
				if(!verifPaysListeGroupeEURO(b.pays1)) b.pays1 = 1;
				if(!verifPaysListeGroupeEURO(b.pays2)) b.pays2 = 1;
				//on vérifie que le groupe existe sinon on annule
				if(!verifPaysListeGroupeEUROValide(b.groupe)){
					this.resp.end(JSON.stringify({message:"action not found"}));
					return;
				}
				b.destinationVote = 'GROUPEEURO2016_'+b.groupe;
				b.stockVote = {VOTER1EURO: b.pays1, VOTER2EURO: b.pays2};
				db.faireUnParis(this.resp, this.req.headers.cookie, b);
			}else if(b.action == "RECUPERERINFOS"){				
				db.getInfosViaCookieForRooter(this.req.headers.cookie, this, "RECUPERERINFOS");				
			}else if(b.action == "VOTERMATCHDUJOUR"){				
				b.destinationVote = 'MATCHDUJOUR_'+b._id_match;
				b.stockVote = {VOTER1EURO:parseInt(b.pays1)};
				db.faireUnParis(this.resp, this.req.headers.cookie, b);		
			}else{
				util.log("INFO - Action not found : " + b.ac);
				this.resp.end(JSON.stringify({message:"action not found"}));
			}
		}else{	
			this.resp.end(JSON.stringify({message:"nocookie"}));
		}			
	},

// r1 : document de la personne concernée
// r2 : documenet de tous les votes
// r3 : document de l'admin
RECUPERERINFOS : function(r1,r2){	
	var r3 = r2[0];
	r2 = r2[1];
	var objDb = {};
	var pseudo = r1.pseudo;//on recupere le pseudo dans la premier table		
	if(r2[pseudo]){//on recupere les infos de vote relative au pseudo
		objDb.mesVotesVainqueursEuro2016 = r2[pseudo];
	}
	if(r2['listeMatchDuJour']){//on recupere la liste des match du jour
		objDb.listeMatchDuJour = r2['listeMatchDuJour'];
	}
	if(r3.message){
		objDb.messageAdmin = r3.message;
	}
	//on fait le menage dans autres votes vainqueur
	objDb.autresVotesVainqueursEuro2016 = r2;
	delete objDb.autresVotesVainqueursEuro2016[pseudo];
	delete objDb.autresVotesVainqueursEuro2016['_id'];
	delete objDb.autresVotesVainqueursEuro2016['pseudo'];
	delete objDb.autresVotesVainqueursEuro2016['listeMatchDuJour'];
	delete objDb.autresVotesVainqueursEuro2016['COMPETITION'];
	this.resp.end(JSON.stringify({
		categorie:"SUCCESS",
		suc_methode:"RECUPERERINFOS",
		mesVotesVainqueursEuro2016:objDb.mesVotesVainqueursEuro2016,
		autresVotesVainqueursEuro2016 :objDb.autresVotesVainqueursEuro2016,
		listeMatchDuJour:objDb.listeMatchDuJour,
		messageAdmin: objDb.messageAdmin
	}));
},

read_file:
function () {	
	if (!this.pathname[0] || this.pathname[0] == "nodejs" || this.pathname[0] == "router.js" || this.pathname[0] == "server.js") {
		//util.log("ALERT - Hack attempt, resquest on : " + util.inspect(this.pathname)
		this.pathname = "./index.html";
		this.path = "./index.html";
		this.filetype = "html";
	}
	this.load_file();	
},
	
load_file:
	function () {
		var _this = this;
		fs.exists(this.path, function (ex) {
			if (ex) {
				fs.readFile(_this.path, function (e, d) {
					if (e) {
						util.log("ERROR - Problem reading file : " + e);
					} else {
						_this.file = d;
						//util.puts("GET on path : " + util.inspect(_this.path));
						_this.file_processing();
			} });
			} else {
				util.log("INFO - File requested not found : " + _this.path);
				_this.resp.writeHead(404, {"Content-Type":"text/html"});
				_this.resp.end(); 
			}
		});
	},
	
file_processing:
	function () {
		if (this.filetype == "htm") {
			this.resp.writeHead(200, {"Content-Type": "text/html"});
		} else if (this.image_file.indexOf(this.filetype) >= 0) {
			this.resp.writeHead(200, { "Content-Type" : "image/" + this.filetype });
		} else {
			this.resp.writeHead(200, { "Content-Type" : "text/" + this.filetype });
		}
		this.file_send();
	},
	
file_send:
function () {
	this.resp.write(this.file);
	this.resp.end();
	}
};

var a = {a: "arg1" , b: 3 }; 

var verificationFormulaireRegister = function(obj1,obj2){
	obj1.pseudo = obj2.pseudo.toUpperCase().trim();	
	obj1.pwd = obj2.pwd.trim();
	obj1.BDjj = obj2.register_birthdate_day;
	obj1.BDmm = obj2.register_birthdate_month;
	obj1.BDyy = obj2.register_birthdate_year;
	obj1.gender = obj2.gender;
	obj1.avatar = obj2.avatar;
	//par défaut
	obj1.score =0;
	obj1.dateCreation = new Date().getTime();
	obj1.dateDerniereConnexion = new Date().getTime();
	obj1.cd_langue = "fr";//pour le moment, sinon à faire en fonction du navigateur
	obj1.cd_profil = 0;//0 user, 1 admin
	obj1.dateLock = -1;//date de blockage
	obj1.flagLock = 0;//non bloque
	obj1.nombreTentative = 0;//tentative MDP
};
var verificationFormulaireSendMessChatRoom = function(obj1, obj2){
	obj1.date = (new Date()).getTime();
	obj1.message = obj2.message;
	obj1.pseudo = "null";
	obj1.gender = "man";//by default
	obj1.avatar = "man1";//by default
};

var verifPaysListeEURO = function(paysParam){
	if(paysParam < 0 && paysParam >23 ){
		return false;
	}else{
		return true;
	}
};

var verifPaysListeGroupeEURO = function(paysParam){
	if(paysParam < 0 && paysParam >3){
		return false;
	}else{
		return true;
	}
};

var verifPaysListeGroupeEUROValide = function(char){
	if(groupesEuro.indexOf(char) == -1){
		return false;
	}else{
		return true;
	}
};

