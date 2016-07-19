"use strict";

//{ CARICAMENTO INFO
$(document).ready(function (e){
	$("#accessorybutton").hide();//hide accessory button
	getUserInfo(); //get current user info
	loadConferences(); //load all conferences in combobox
	document.getElementById("utente").innerHTML = userInfo['email']; //carica il nome dell'utente corrente
	hideMenuNavbar(); //nasconde il menu per interagire con il documento
});

//funzione che carica tutta le conference nella combobox
function loadConferences(){
	$.getJSON( "json/events.json", function( data ) {
		for(var i = 0; i < data.events.length; i++){
			confs.push(Conference(data.events[i]));
			if (confs[i].IsChair() || confs[i].IsReviewer()) //se si è chair della conference o reviewer di almeno un articolo
				$('#events').append('<li><a href="#" data-id="' + i + '" onclick="selectConference(this)" >'+confs[i].conference+'</a></li>');
		}
	})
	.fail(function() {
		alert( "Impossibile caricare il file conference.json" );
	})
}

//funzione lanciata alla selezione di una conference
function selectConference(element){
	confN = $(element).attr("data-id");
    articleN = -1;
	if (closeArticle()){
		var submissions = confs[confN].submissions;
		var text = "<a style='text-align: center;' class='list-group-item'>"+confs[confN]['conference']+"</a>";
		for(var n = 0; n < submissions.length; n++){
			$.ajax({
				url:"RASH/"+submissions[n].url, 
				cache: false,
				async: false,
				success:function(data) {
					loadAnnotations(data, n);			
				}
			});
			if (submissions[n].IsReviewer())
				if (confs[confN].submissions[n].HaveReview())
					text += '<a id="c'+ confN +'a'+n+'" href="#" class="list-group-item list-group-item-success" data-id="'+n+'" title="authors: '+ submissions[n].authors +'" onclick="openArticle(this);" >'+confs[confN].submissions[n].title+'</a>';
				else
					text += '<a id="c'+ confN +'a'+n+'" href="#" class="list-group-item list-group-item-warning" data-id="'+n+'" title="authors: '+ submissions[n].authors +'" onclick="openArticle(this);" >'+confs[confN].submissions[n].title+'</a>';
			else if (confs[confN].IsChair())
				if (confs[confN].submissions[n].HaveDecision())
					text += '<a id="c'+ confN +'a'+n+'" href="#" class="list-group-item list-group-item-success" data-id="'+n+'" title="authors: '+ submissions[n].authors +'" onclick="openArticle(this);" >'+confs[confN].submissions[n].title+'</a>';
				else
					text += '<a id="c'+ confN +'a'+n+'" href="#" class="list-group-item list-group-item-warning" data-id="'+n+'" title="authors: '+ submissions[n].authors +'" onclick="openArticle(this);" >'+confs[confN].submissions[n].title+'</a>';
		}
		$("#articles").html(text);
	}
}

//effettua un reset delle view dell'articolo precedentemente
function resetArticle(){
	$( "#RASHhead" ).empty();
	$( "#paperdiv" ).empty();
	$("#annotationsMenu").empty();
	hideMenuNavbar();
}

//funzione per caricare un articolo nel div
function openArticle(id){
	var r = true;
	if (locked == 0 && changes != 0)
        r = confirm("Desideri uscire senza salvare?");
	if (r == true){
		resetArticle();
		
		// se c'era un articolo selezionato, rimuove il lock sul vecchio articolo
		if (locked == 0 && articleN >= 0)
			removeLock(confs[confN].submissions[articleN].url);
		
		if (id) // per parametro opzionale
			articleN = $(id).attr('data-id');
				
		$.ajax({
			url:"RASH/"+confs[confN].submissions[articleN].url, 
			cache: false,
			async: false,
			success:function(data) {
				jQuery.each($(data).filter("section"),function(index,value){$("#paperdiv").append($(this));}); // DA SOVRASCRIVERE NEL FILE RASH
				jQuery.each($(data).filter("title"),function(index,value){$("#RASHhead").append($(this));});
				jQuery.each($(data).filter("meta"),function(index,value){$("#RASHhead").append($(this));});
				jQuery.each($(data).filter("#voti"),function(index,value){$("#RASHhead").append($(this));});
				$.getScript("js/rash.js");
				loadAnnotations(data, articleN);
				showAnnotations(); //funzione che si occupa di visualizzare le annotazioni (modificando il DOM)				
			}
		});
		changes = 0;
		$("#accessorybutton").show();	
        hideMenuElements();
	}
}

function closeArticle(){
	var r = true;
	if (locked == 0 && changes != 0)
        r = confirm("Desideri uscire senza salvare?");
	if (r == true){
		resetArticle();
		
		// se c'era un articolo selezionato, rimuove il lock sul vecchio articolo
		if (locked == 0 && articleN >= 0)
			removeLock(confs[confN].submissions[articleN].url);
		
		changes = 0;
	}
	return r;
}

//funzione per caricare le annotazioni del documento
function loadAnnotations(data, n){
	confs[confN].submissions[n].annotations = []; //reset modifiche
	
	jQuery.each($(data).filter('script[type="application/ld+json"]'),
		function(i,v){
			confs[confN].submissions[n].annotations.push(JSON.parse($(this).html()));
		}
	);
}

function toX(x){
    $('#'+x)[0].scrollIntoView( true );
}

function addMargin() {
    window.scrollTo(0, window.pageYOffset - 70);
    history.pushState("", document.title, window.location.pathname);
}

window.onhashchange = addMargin;
//window.addEventListener('hashchange', addMargin());
//}
