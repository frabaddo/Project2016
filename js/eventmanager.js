// funzione per caricare la lista Eventi all'apertura della pagina
$(document).ready(function (e){
	getUserInfo(); //get current user info
	loadConferences(); //load all conferences in combobox
	
	$('#modifyAnnotation').on('shown.bs.modal', function() {
		alert(annotation['text']);
		alert($("#textMODIFY").val(item['text']));
	})
});

//funzione che carica tutta le conference nella combobox
function loadConferences(){
	 $.getJSON( "json/conference.json", function( data ) {
        conferences=data;    
        for(var i = 0; i < conferences.events.length; i++)
            $('#events').append('<li><a href="#" data-id="' + i + '" onclick="selectConference(this)" >'+conferences.events[i]['conference']+'</a></li>');
    })
    .fail(function() {
        alert( "Impossibile caricare il file conference.json." );
    })
    $("#logBtn").click(function(){
    	$("#logModal").modal();
    })
}
//funzione che prende le informazioni dell'utente loggato
function getUserInfo() {
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
function selectConference(identifier){
	var id = $(identifier).attr("data-id");
	var submissions = conferences.events[id]['submissions'];
	var tmp = "";
	for(var i = 0; i < submissions.length; i++)
		tmp += '<a href="#" class="list-group-item" data-id="' + i +'"'+' data-eventid="' + id + '" onclick="openArticle(this)" >'+submissions[i]['title']+'</a>';
	$("#articles").html(tmp);
}

//effettua un reset del div dell'articolo
function resetArticle(){
	$( "#RASHhead" ).empty();
	$( "#paperdiv" ).empty();
}

//funzione per caricare un articolo nel div
function openArticle(identifier){
	resetArticle();
	var eventN = $(identifier).attr('data-eventid');
	var articleN = $(identifier).attr('data-id');
	var submission = conferences.events[eventN]['submissions'];
	jQuery.ajax({
		url:"RASH/"+submission[articleN]['url'], 
		success:function( data ) {
			jQuery.each($(data).filter("section"),function(index,value){$("#paperdiv").append($( this ));});
			jQuery.each($(data).filter("title"),function(index,value){$("#RASHhead").append($( this ));});
			jQuery.each($(data).filter("meta"),function(index,value){$("#RASHhead").append($( this ));});
			jQuery.each($(data).filter("#voti"),function(index,value){$("#RASHhead").append($(this ));});
			$("#RASHhead").append('<script src="js/rash.js"> </script>');
			loadAnnotations(data);			
		}
	});
}

//funzione per caricare le annotazioni del documento
function loadAnnotations(data){
	jQuery.each($(data).filter('script[type="application/ld+json"]'),
		function(index,value){
			annotations.push(JSON.parse($(this).html()));
		}
	);
		
	for(var i = 0; i < annotations.length; i++)
		for(var j = 0; j < annotations[i].length; j++){
			var item = annotations[i][j];
			if (item['@type'] == "comment"){
				$(item['ref']).attr('class', item['@type']);
				$(item['ref']).css('background-color','yellow');
			}
	}
	showAnnotations();
}