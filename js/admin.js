  var obj = {};
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
      if(r.categorie == "SUCCESS"){
        if(r.suc_methode =="ADD_COMPETITION"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }else if(r.suc_methode == "MAJ_MATCH_JOUR"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }else if(r.suc_methode == "GET_DATA"){
          if(r.data){
            onGetData(r.data);
          }          
        }else if(r.suc_methode =="ADD_MATCH_JOUR"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }else if(r.suc_methode == "DEL_COMPETITION"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }else if(r.suc_methode == "ADD_TEAM"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }else if(r.suc_methode == "DEL_TEAM"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }

      }else{
        console.log('une erreur est surveneue : '+r.err_message);
        alert("erreur");
      }
    }   
  };
  /*****************************************************************************************
  ******************************************************************************************
  ********************************* SUBMIT *************************************************
  ******************************************************************************************
  ******************************************************************************************
  *****************************************************************************************/
  //fonction pour ajouter un match
  document.getElementById('id_form').onsubmit = function(event){
      var b = {};
      b.action = "ADD_MATCH_JOUR";
      b.admin = true;
      b.id_match = new Date().getTime();
      b.affichage = false;
      b.vainqueur = -20;
      b.pays1 = document.getElementById('id_pays1').value;
      b.pays2 = document.getElementById('id_pays2').value;
      b.points  = document.getElementById('id_points').value;
      var d = new Date(document.getElementById('id_date').value)
      var offset = d.getTimezoneOffset();
      d = d.getTime();
      d = d + offset*60*1000;
      b.expireDate = d;
      var r = confirm("Sûre ?");
      if (r == true) {
          obj.post(b, obj.log_callback);
      }
      return false;
  };
  //ajouter une competition
  document.getElementById('add_competition_form').onsubmit = function(event){
      var b ={};
      b.name = getElementValue('add_competition_select_name');
      b.saison = getElementValue('add_competition_select_saison');
      b.action = "ADD_COMPETITION";
      b.admin = true;
      b.id_competition = ""+(Math.floor((Math.random() * 100) + 1))*(new Date().getTime());
      if(confirm("Valider ?")){
        obj.post(b, obj.log_callback);
      }
      return false;
  };
  //supprimer une competition
  document.getElementById('del_competition_form').onsubmit = function(event){
      var b ={};
      b.id_competition = ""+getElementValue('del_competition_select_name');      
      b.action = "DEL_COMPETITION";
      b.admin = true;
      if(confirm("Valider ?")){
        obj.post(b, obj.log_callback);
      }
      return false;
  };

  //ajouter une equipe
  document.getElementById('add_team_form').onsubmit = function(event){
      var b ={};
      b.id_competition = ""+getElementValue('add_team_select_competition');      
      b.action = "ADD_TEAM";
      b.admin = true;
      b.teams = new Array();
      for(i in getElementValue('add_team_select_team').split(',')){
        b.teams.push({name:getElementValue('add_team_select_team').split(',')[i].trim(),
                      score:0});
      }
      if(confirm("Valider ?")){
        obj.post(b, obj.log_callback);
      }
      return false;
  };

    //supprimer une equipe
  document.getElementById('del_team_form').onsubmit = function(event){
      var b ={};
      b.id_competition = ""+getElementValue('del_team_select_competition');
      b.team = ""+getElementValue('del_team_select_name');
      b.action = "DEL_TEAM";
      b.admin = true;
      if(confirm("Valider ?")){
        obj.post(b, obj.log_callback);
      }
      return false;
  };

/*****************************************************************************************
******************************************************************************************
********************************* Traitement page ****************************************
******************************************************************************************
******************************************************************************************
*****************************************************************************************/
//quand on recoit les données de la BDD
  var onGetData = function(data){
    //data est un tableau, d'objet de competition
    fillSelectCompetition(data); 
    fillSelectTeam(data);
  }

//pour remplir les select qui ont besoin de la competition
var fillSelectCompetition = function(data){
  document.getElementById('del_competition_select_name').innerHTML = "";
  document.getElementById('add_team_select_competition').innerHTML = "";
  document.getElementById('del_team_select_competition').innerHTML = "";
  for(var i in data){
    var text = data[i].name + " saison : "+data[i].saison;
    document.getElementById('del_competition_select_name').innerHTML += '<option value="'+data[i].id_competition+'">'+text+'</option>';
    document.getElementById('add_team_select_competition').innerHTML += '<option value="'+data[i].id_competition+'">'+text+'</option>';
    document.getElementById('del_team_select_competition').innerHTML += '<option value="'+data[i].id_competition+'">'+text+'</option>';
    document.getElementById('del_team_select_competition').onchange = function(){
      fillSelectTeam(data);      
    };
  }
};
//les equipes pour une competition donnée
var fillSelectTeam = function(data){
  document.getElementById('del_team_select_name').innerHTML = "";  
  var competitionChoisie = getElementValue('del_team_select_competition');
  for(var i in data){
    if(data[i].id_competition == competitionChoisie){
      for(var j in data[i].teams){
        var text = data[i].teams[j].name;
        document.getElementById('del_team_select_name').innerHTML += '<option value="'+text+'">'+text+'</option>';
      }      
      return;
    }    
  }
};


  //fonction pour afficher les matchs en bases
  var afficherMatch = function(listeMatch){
    document.getElementById('id_form_maj').innerHTML = "";    
    for(key in listeMatch) {
        document.getElementById('id_form_maj').innerHTML +=  '<div class="form-group">'
            +'<label for="select_'+listeMatch[key].id_match+'">'+ arrPaysEuro[listeMatch[key].pays1]+' VS '+arrPaysEuro[listeMatch[key].pays2]+'</label>'
            +'<select type="text" class="form-control" id="select_'+listeMatch[key].id_match+'">'
            +'<option value="-20">choisir le vainqueur</option>'
            +'<option value="'+listeMatch[key].pays1+'">'+arrPaysEuro[listeMatch[key].pays1]+'</option>'
            +'<option value="-1">nul</option>'
            +'<option value="'+listeMatch[key].pays2+'">'+arrPaysEuro[listeMatch[key].pays2]+'</option>'
            +'</select>'
            +'</div>'
            +'<div class="checkbox"><label><input type="checkbox" id="checkbox'+listeMatch[key].id_match+'"> afficher</label></div>';        
    }
    document.getElementById('id_form_maj').innerHTML += '<button type="submit" class="btn btn-default">Submit</button>';
    for(key in listeMatch){
        document.getElementById('select_'+listeMatch[key].id_match+'').value = listeMatch[key].vainqueur;
        document.getElementById('checkbox'+listeMatch[key].id_match+'').checked = listeMatch[key].affichage;
    }
    document.getElementById('id_form_maj').onsubmit = function(event){
        for(key in listeMatch){
            listeMatch[key].vainqueur = document.getElementById('select_'+listeMatch[key].id_match+'').value;
            listeMatch[key].affichage = document.getElementById('checkbox'+listeMatch[key].id_match+'').checked;
        }
        obj.post({action:"MAJ_MATCH_JOUR", admin: true, listeMatch:listeMatch},obj.log_callback);
        return false;
    };   
  };

  obj.post({action:"GET_DATA",admin: true},obj.log_callback);