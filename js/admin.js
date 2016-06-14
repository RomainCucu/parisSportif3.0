  var arrPaysEuro = ["Albanie", "Allemagne", "Angleterre", "Autriche", "Belgique", "Croatie", "Espagne", "France", "Hongrie", "Irlande du Nord", "Islande", "Italie", "Pays de Galles", "Pologne", "Portugal", "République d'Irlande", "Rép. tchèque", "Roumanie", "Russie", "Slovaquie", "Suède", "Suisse", "Turquie", "Ukraine"];
    for (var i in arrPaysEuro){
      document.getElementById('id_pays1').innerHTML += "<option value="+i+">"+arrPaysEuro[i]+"</option>";
      document.getElementById('id_pays2').innerHTML += "<option value="+i+">"+arrPaysEuro[i]+"</option>";      
  }
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
      if(r.listeMatch){
        afficherMatch(r.listeMatch);
      }else if(r.ADMINADDMATCHDUJOUR){
        alert('match ajouté');
        obj.post({action:"ADMINGETDATA"},obj.log_callback);
      }else if(r.ADMINMAJMATCHJOUR){
        alert('MAJ ok');
        obj.post({action:"ADMINGETDATA"},obj.log_callback);
      }
      else{
        alert('erreur');
      }      
    }
  };
  
  //fonction pour ajouter un match
  document.getElementById('id_form').onsubmit = function(event){
      var b = {};
      b.action = "ADMINAZEQSD_ADD_MATCH_JOUR";
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
      b.expireDate = document.getElementById('id_date').value;
      var r = confirm("Sûre ?");
      if (r == true) {
          obj.post(b, obj.log_callback);
      }
      return false;
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
        obj.post({action:"ADMINMAJMATCH", listeMatch:listeMatch},obj.log_callback);
        return false;
    };   
  };

  obj.post({action:"ADMINGETDATA"},obj.log_callback);