"use strict";
class Conference {
	constructor(conf) {
		this.conference = conf['conference'];
		this.acronym = conf['acronym'];
		this.chairs = conf['chairs'];
		this.pc_members = conf['pc_members'];
		
		var subs = [];
		for(var i = 0; i < conf['submissions'].length; i++)
			subs.push(new Submissions(this.conference, conf['submissions'][i]));
		
		this.submissions = subs;
	}	
	IsChair(){
		for(var j = 0; j < this.chairs.length; j++)
			if (this.chairs[j].includes(userInfo['email']))
				return 1;
			
		return 0;
	}
	
	//se sei reviewer di almeno un articolo della conference
	IsReviewer(){
		for (var i = 0; i < this.submissions.length; i++)
			for (var j = 0; j < this.submissions[i].reviewers.length; j++)
				if (this.submissions[i].reviewers[j].includes(userInfo['email']))
					return 1;
				
		return 0;
	}
}

class Submissions{
	constructor(conf, sub){
		this.conference = conf;
		this.title = sub['title'];
		this.authors = sub['authors'];
		this.url = sub['url'];
		this.reviewers = sub['reviewers'];
		this.annotations = [];
	}
	
	IsReviewer(){
		for (var j = 0; j < this.reviewers.length; j++)
			if (this.reviewers[j].includes(userInfo['email']))
				return 1;
		return 0;
	}
	
	HaveDecision(){
		for(var i = 0; i < this.annotations.length; i++)
			for(var j = 0; j < this.annotations[i].length; j++){
				var item = this.annotations[i][j];
				if (item['@type'] == "decision")
					return 1;
			}
		return 0;
	}

	HaveReview(){
		for(var i = 0; i < this.annotations.length; i++)
			for(var j = 0; j < this.annotations[i].length; j++){
				var item = this.annotations[i][j];
				if (item['@type'] == "review" && item['article']['eval']['author'].includes(userInfo['email']))
					return 1;
			}
		return 0;
	}
}

// funzione per caricare la lista Eventi all'apertura della pagina
$(document).ready(function (e){
	getUserInfo(); //get current user info
	loadConferences(); //load all conferences in combobox
	document.getElementById("utente").innerHTML = userInfo['email'];
});

//funzione che carica tutta le conference nella combobox
function loadConferences(){
	$.getJSON( "json/events.json", function( data ) {
		conferences=data;
        for(var i = 0; i < conferences.events.length; i++){
			confs.push(new Conference(conferences.events[i]));
			if (confs[i].IsChair() || confs[i].IsReviewer()) //se si è chair della conference o reviewer di almeno un articolo
				$('#events').append('<li><a href="#" data-id="' + i + '" onclick="selectConference(this)" >'+confs[i].conference+'</a></li>');
		}
    })
    .fail(function() {
        alert( "Impossibile caricare il file conference.json" );
    })
}

//funzione che prende le informazioni dell'utente loggato
function getUserInfo(){
	$.ajax({ 
		url: 'php/functions.php',
        data: {action: 'getUserInfo'},
        type: 'post',
		async: false,
        success: function(output) {
			userInfo = JSON.parse(output);
        },
		error: function(output) {
			alert("Impossibile caricare le informazioni utente.");
		}
	});
}

//funzione lanciata alla selezione di una conference
function selectConference(element){
	confN = $(element).attr("data-id");
	var submissions = confs[confN].submissions;
	var tmp = "";
	
	for(var i = 0; i < submissions.length; i++)
		if (confs[confN].IsChair() || submissions[i].IsReviewer())
			tmp += '<a href="#" class="list-group-item" data-id="'+i+'" onclick="openArticle(this)" >'+submissions[i].title+'</a>';
			
	$("#articles").html(tmp);
}

//effettua un reset del div dell'articolo
function resetArticle(){
	$( "#RASHhead" ).empty();
	$( "#paperdiv" ).empty();
	if (articleN)
		confs[confN].submissions[articleN].annotations = []; //svuota la cache delle annotazioni
}

//funzione per caricare un articolo nel div
function openArticle(id){
	resetArticle();
	
	//se c'era un articolo selezionato, distrugge il lock
	if (articleN)
		removeLock(confs[confN].submissions[articleN].url); //rimuove il lock sul vecchio articolo
	
	articleN = $(id).attr('data-id');
	var submission = confs[confN].submissions;
	
	addLock(submission[articleN].url); //QUANDO PREMI ANNOTATOR
	
	if (locked == 0){
	}
	else
		alert("file attualmente aperto da un altro utente.");
		
	$.ajax({
		url:"RASH/"+submission[articleN].url, 
		success:function(data) {
			jQuery.each($(data).filter("section"),function(index,value){$("#paperdiv").append($(this));}); // DA SOVRASCRIVERE NEL FILE RASH
			jQuery.each($(data).filter("title"),function(index,value){$("#RASHhead").append($(this));});
			jQuery.each($(data).filter("meta"),function(index,value){$("#RASHhead").append($(this));});
			jQuery.each($(data).filter("#voti"),function(index,value){$("#RASHhead").append($(this));});
			$("#RASHhead").append('<script type="text/javascript" src="js/rash.js"> </script>');
			loadAnnotations(data);			
		}
	});
}

//{ LOCK MANAGMENT
function addLock(uri){
	$.ajax({ 
		url: 'php/functions.php',
        data: {action: 'addLock', name: uri},
        type: 'post',
		async: false,
        success: function(output) {
			locked = output;
        },
		error: function(output) {
			locked = 1;
		}
	});
}

function removeLock(uri){
	$.ajax({ 
		url: 'php/functions.php',
        data: {action: 'removeLock', name: uri},
        type: 'post',
		async: false,
        success: function(output) {
        }
	});
}
//}

//funzione per caricare le annotazioni del documento
function loadAnnotations(data){
	jQuery.each($(data).filter('script[type="application/ld+json"]'),
		function(i,v){
			//annotations.push(JSON.parse($(this).html()));
			confs[confN].submissions[articleN].annotations.push(JSON.parse($(this).html()));
		}
	);
	/*
	if(confs[confN].submissions[articleN].HaveDecision()){
		alert("Il documento ha terminato la fase di Decision.");
		return;
	}
	
	if(confs[confN].submissions[articleN].HaveReview()){
		alert("Hai già revisionato il documento.");
		return;
	}
	*/
	var annotations = confs[confN].submissions[articleN].annotations;
	for(var i = 0; i < annotations.length; i++)
		for(var j = 0; j < annotations[i].length; j++){
			var item = annotations[i][j];
			if (item['@type'] == "comment"){
				var id = item['ref'].substring(1, item['ref'].length);
				if (confs[confN].IsChair()){
					document.getElementById(id).setAttribute("data-eventid",confN);
					document.getElementById(id).setAttribute("class",item['@type']);
				}
				else if (item['author'].includes(userInfo['email'])){
					document.getElementById(id).setAttribute("data-eventid",confN);
					document.getElementById(id).setAttribute("class",item['@type']);
					document.getElementById(id).setAttribute("onclick","loadAnnotation("+j+")");
				}
			}
		}
	showAnnotations();
}

//{ funzione per far apparire i campi per cambiare password
function showPassFields(){
	$('#password').fadeIn();
	$('#newPassword').fadeIn();
	$('#changePass').hide();
	$("#newPassword").prop('required',true);
	$("#password").prop('required',true);
}

function hidePassFields(){
	$('#password').fadeOut();
	$('#newPassword').fadeOut();
	$('#changePass').show();
	$("#newPassword").prop('required', false);
	$("#password").prop('required', false);
}
//}
