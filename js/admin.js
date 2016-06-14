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
      $('#myModal').modal('hide');
      if(r.categorie == "SUCCESS"){
        if(r.suc_methode =="ADD_COMPETITION"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }else if(r.suc_methode == "DEL_COMPETITION"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }else if(r.suc_methode == "ADD_TEAM"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }else if(r.suc_methode == "DEL_TEAM"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }else if(r.suc_methode == "ADD_MATCH"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }else if(r.suc_methode == "DEL_MATCH"){
          obj.post({action:"GET_DATA",admin: true},obj.log_callback);
        }else if(r.suc_methode == "GET_DATA"){
          if(r.data){
            onGetData(r.data);
          }          
        }

      }else{
        console.log('une erreur est surveneue : '+r.err_message);
        alert("erreur: "+r.err_message);
      }
    }   
  };
  /*****************************************************************************************
  ******************************************************************************************
  ********************************* SUBMIT *************************************************
  ******************************************************************************************
  ******************************************************************************************
  *****************************************************************************************/
  //ajouter une competition
  document.getElementById('add_competition_form').onsubmit = function(event){
      $('#myModal').modal('show');
      var b ={};
      b.name = getElementValue('add_competition_select_name');
      b.saison = getElementValue('add_competition_select_saison');
      b.action = "ADD_COMPETITION";
      b.admin = true;
      b.sport = getElementValue('add_competition_select_sport');
      b.id_competition = ""+(Math.floor((Math.random() * 100) + 1))*(new Date().getTime());
      b.journee = getElementValue('add_competition_select_journee');
      if(confirm("Valider ?")){
        obj.post(b, obj.log_callback);
      }
      return false;
  };
  //supprimer une competition
  document.getElementById('del_competition_form').onsubmit = function(event){
      $('#myModal').modal('show');
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
      $('#myModal').modal('show');
      var b ={};
      b.id_competition = ""+getElementValue('add_team_select_competition');      
      b.action = "ADD_TEAM";
      b.admin = true;
      b.teams = new Array();
      for(i in getElementValue('add_team_select_team').split(',')){
        b.teams.push({
          name:getElementValue('add_team_select_team').split(',')[i].trim(),
          score:0,
          id_team: "id_team_"+Math.floor((Math.random() * 10000) + 1)*(new Date().getTime())
          });
      }
      if(confirm("Valider ?")){
        obj.post(b, obj.log_callback);
      }
      return false;
  };

    //supprimer une equipe
  document.getElementById('del_team_form').onsubmit = function(event){
      $('#myModal').modal('show');
      var b ={};
      b.id_competition = ""+getElementValue('del_team_select_competition');
      b.id_team = ""+getElementValue('del_team_select_name');
      b.action = "DEL_TEAM";
      b.admin = true;
      if(confirm("Valider ?")){
        obj.post(b, obj.log_callback);
      }
      return false;
  };

      //ajouter un match
  document.getElementById('add_match_form').onsubmit = function(event){
      $('#myModal').modal('show');
      var b ={};
      b.id_competition = ""+getElementValue('add_match_select_competition');
      b.matchs = new Array();
      b.matchs.push({
        equipe_1: getElementValue('add_match_select_team_1'),
        equipe_2: getElementValue('add_match_select_team_2'),
        id_match: "id_match_"+Math.floor((Math.random() * 10000) + 1)*(new Date().getTime()),
        resultat: 0,
        date: getElementValue('add_match_select_time'),
        journee: getElementValue('add_match_select_journee')
      });
      b.action = "ADD_MATCH";
      b.admin = true;
      if(confirm("Valider ?")){
        obj.post(b, obj.log_callback);
      }
      return false;
  };

      //supprimer un match
  document.getElementById('del_match_form').onsubmit = function(event){
      $('#myModal').modal('show');
      var b ={};
      b.id_competition = ""+getElementValue('del_match_select_competition');
      b.id_match = ""+getElementValue('del_match_select_name');
      b.action = "DEL_MATCH";
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
    fillSelectCompetition(data); //remplir tous les select des competition
    fillSelectTeam(data); //gestion equipes : remplir la selection equipe pour une competition
    fillSelectTeamAddMatch(data);//gestion ajout match : remplir les equipe pour ajouter un match
    fillSelectJourneeMatch(data);//gestion ajout match : remplir le select journee pour une competition
    fillSelectMatch(data); //gestion supprimer match : remplir les matchs d'une competion
  }

//pour remplir les select qui ont besoin de la competition
var fillSelectCompetition = function(data){
  document.getElementById('del_competition_select_name').innerHTML = "";
  document.getElementById('add_team_select_competition').innerHTML = "";
  document.getElementById('del_team_select_competition').innerHTML = "";
  document.getElementById('add_match_select_competition').innerHTML = "";
  document.getElementById('del_match_select_competition').innerHTML = "";
  for(var i in data){
    var text = data[i].name + " saison : "+data[i].saison;
    document.getElementById('del_competition_select_name').innerHTML += '<option value="'+data[i].id_competition+'">'+text+'</option>';
    document.getElementById('add_team_select_competition').innerHTML += '<option value="'+data[i].id_competition+'">'+text+'</option>';
    document.getElementById('del_team_select_competition').innerHTML += '<option value="'+data[i].id_competition+'">'+text+'</option>';
    document.getElementById('add_match_select_competition').innerHTML += '<option value="'+data[i].id_competition+'">'+text+'</option>';
    document.getElementById('del_match_select_competition').innerHTML += '<option value="'+data[i].id_competition+'">'+text+'</option>';

    document.getElementById('del_team_select_competition').onchange = function(){
      fillSelectTeam(data);      
    };
    document.getElementById('del_match_select_competition').onchange = function(){
      fillSelectMatch(data);            
    };
    document.getElementById('add_match_select_competition').onchange = function(){
      fillSelectTeamAddMatch(data);
      fillSelectJourneeMatch(data);
    };
  }
};
//les equipes pour une competition donnée
var fillSelectTeam = function(data){
  document.getElementById('del_team_select_name').innerHTML = " ";  
  var competitionChoisie = getElementValue('del_team_select_competition');
  for(var i in data){
    if(data[i].id_competition == competitionChoisie){
      for(var j in data[i].teams){
        var text = data[i].teams[j].name;
        var id_team = data[i].teams[j].id_team;
        document.getElementById('del_team_select_name').innerHTML += '<option value="'+id_team+'">'+text+'</option>';
      }      
      return;
    }    
  }
};

//les equipes pour une competition donnée pour ajouter un match
var fillSelectTeamAddMatch = function(data){
  for(var k = 1; k < 3; k++){
    document.getElementById('add_match_select_team_'+k).innerHTML = " ";  
    var competitionChoisie = getElementValue('add_match_select_competition');
    for(var i in data){
      if(data[i].id_competition == competitionChoisie){
        for(var j in data[i].teams){
          var text = data[i].teams[j].name;
          var id_team = data[i].teams[j].id_team;
          document.getElementById('add_match_select_team_'+k).innerHTML += '<option value="'+id_team+'">'+text+'</option>';
        }              
      }    
    }
  }
};
//remplir le select journee pour creer un match
var fillSelectJourneeMatch = function(data){
  document.getElementById('add_match_select_journee').innerHTML = " ";
  var competitionChoisie = getElementValue('add_match_select_competition');
  for(var i in data){
    if(data[i].id_competition == competitionChoisie){
      for(var j = 0; j < parseInt(data[i].journee) ; j++){
        document.getElementById('add_match_select_journee').innerHTML += '<option value="'+(j+1)+'">'+(j+1)+'</option>';
      }      
      return;
    }    
  } 
};

//les matchs pour une competition donnée
var fillSelectMatch = function(data){
  document.getElementById('del_match_select_name').innerHTML = " ";    
  var competitionChoisie = getElementValue('del_match_select_competition');
  for(var i in data){
    if(data[i].id_competition == competitionChoisie){
      var arrTeams = data[i].teams;
      for(var j in data[i].matchs){
        var name_equipe_1 = $.grep(arrTeams, function(e){ return e.id_team == data[i].matchs[j].equipe_1 })[0].name;
        var name_equipe_2 = $.grep(arrTeams, function(e){ return e.id_team == data[i].matchs[j].equipe_2 })[0].name;
        var text = ""+name_equipe_1 + " / " +name_equipe_2 + " à "+(data[i].matchs[j].date).replace('T', ' à ');
        text+= " (journée : "+data[i].matchs[j].journee+")"
        var id_match = data[i].matchs[j].id_match;
        document.getElementById('del_match_select_name').innerHTML += '<option value="'+id_match+'">'+text+'</option>';
      }      
      return;
    }    
  }
};

  $('#myModal').modal('show');
  obj.post({action:"GET_DATA",admin: true},obj.log_callback);