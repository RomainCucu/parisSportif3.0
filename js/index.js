var obj = {};
var data = {} //objet transmis au routeur
var contenuHTML = {} // Contient le code html pour remplacer le gif annimé

data.avatar = 'man1';//par défaut

obj.start = function(){
	obj.remplirDateFormulaire();//on rempli les dates au chargement
	obj.formSignin();//fonction pour se connecter
	obj.formSignup();//fonction pour s'enregistrer
	obj.remplirChampAvatar("man");//fonction pour afficher les images d'avatar
};

obj.remplirDateFormulaire = function(){
	for(var i = new Date().getFullYear(); i >1900; i--){
		document.getElementById("register_birthdate_year").innerHTML+= "<option value="+i+">"+i+"</option>";
	}
	for(var i = 1; i <32; i++){
		document.getElementById("register_birthdate_day").innerHTML+= "<option value="+i+">"+i+"</option>";
	}
};

obj.remplirChampAvatar = function(gender){
	var string ="";
	if(gender != "man" && gender != "woman") {
		data.avatar = "err";
		return;
	}
	for(var i = 1;i<31;i++){
    	string+='<a onclick="data.avatar=\''+gender+i+'\' " class="thumbnail col-md-1" href="#"><img class="img-responsive" style="height=50px;width=50px;" src="./images/avatar/'+gender+'/'+gender+i+'.png" alt=""></a>';
	}
	document.getElementById('display_avatar').innerHTML=string;
};

obj.formSignin = function(){
	document.getElementById('formSignin').onsubmit = function(event){
		obj.replace_content_by_animation_GIF_loader('signinAjaxLoader');
		data.action = "signin"
		data.formLogin = document.getElementById('formLogin').value.toUpperCase().trim();
		data.formPassword = document.getElementById('formPassword').value.trim();
		data.formRememberMe = document.getElementById('formRememberMe').checked;
		obj.post(data, obj.log_callback);
		event.preventDefault();
	};
};

obj.formSignup = function(){
	document.getElementById('formSignup').onsubmit = function(event){
		data.action = "SIGNUP"; // action a traité pour le routeur
		data.pseudo = document.getElementById('register_name').value;		
		data.register_birthdate_day = document.getElementById('register_birthdate_day').value;
		data.register_birthdate_month = document.getElementById('register_birthdate_month').value;
		data.register_birthdate_year = document.getElementById('register_birthdate_year').value;			
		data.pwd = document.getElementById('register_password').value;
		data.c_pwd = document.getElementById('register_confirm_password').value;
		data.gender = document.getElementById('register_gender').value;
		data.uniqueKey = document.getElementById('register_unique_key').value.toUpperCase();		

		if(data.pwd != data.c_pwd){ //si pwd != confirm pwd
			document.getElementById('problem_confirm_pwd').innerHTML="<strong>You have entered different passwords!</strong>";//on affiche le message d'erreur
			document.getElementById('couleur_register_pwd').className="form-group col-md-6 has-error";//mettre case en rouge pwd et c pwd
			document.getElementById('couleur_register_confirm_pwd').className="form-group col-md-6 has-error";
		}else{//pwd et confirm password sont les même
			document.getElementById('problem_confirm_pwd').innerHTML="";//on supprime le message d'erreur au cas où il y ait
			document.getElementById('couleur_register_pwd').className="form-group col-md-6 has-success";//mettre case en vert pwd et c pwd
			document.getElementById('couleur_register_confirm_pwd').className="form-group col-md-6 has-success";
			obj.replace_content_by_animation_GIF_loader("signupButtonAjaxLoader");//pour remplacer le bouton par un chargement
			obj.post(data, obj.log_callback);
		}
		event.preventDefault();
	};
};

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
			if(r.suc_methode == "SIGNIN"){
				if(r.data == "admin"){
					window.location = "/html/admin.html";
					return;
				}
				document.getElementById(contenuHTML.id).innerHTML = '<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> <strong>Signed successfully!</strong> you are being redirected !</div>';//pour remettre le bouton originel (car gif qui tourne)
				document.getElementById('colorLogin').className="form-group has-success"; //mettre case en rouge pwd et pseudo (innutile je pense vu que l'on redirige)
				var avatar = ""+r.data.avatar;
				var gender = ""+r.data.gender;
				var pseudo = ""+r.data.pseudo;
				window.location = "/html/accueil.html?avatar="+avatar+"&gender="+gender+"&pseudo="+pseudo;
			}else if(r.suc_methode == "SIGNUP"){
				var avatar = ""+r.avatar;
				var gender = ""+r.gender;
				var pseudo = ""+r.pseudo;				
				document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
				window.location = "/html/accueil.html?avatar="+avatar+"&gender="+gender+"&pseudo="+pseudo;
			}		
		}else if(r.categorie == "ERROR"){
			if(r.err_methode == "SIGNIN"){
				document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
				document.getElementById("signinError").innerHTML="Your login or password are false.";
				document.getElementById('colorLogin').className="form-group has-error"; //mettre case en rouge pwd et pseudo
			}else if(r.err_methode == "SIGNUP"){
				alert('pseudo deja existant');
				document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
			}		
		}else if(r.etat == "signupKO"){
			alert(r.message);
			document.getElementById(contenuHTML.id).innerHTML = contenuHTML.string;//pour remettre le bouton originel (car gif qui tourne)
		}
	}
};

obj.replace_content_by_animation_GIF_loader = function(id){
	contenuHTML.string = document.getElementById(id).innerHTML; // objet contenuHTML créé en haut du doc
	contenuHTML.id = id;
	document.getElementById(id).innerHTML = '<img src="./images/ajax-loader-mid.gif" style="height:auto width:auto" >';
};

obj.start();
