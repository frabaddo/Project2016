var conferences;
// funzione per caricare la lista Eventi all'apertura della pagina
$(document).ready(function (e){
    $.getJSON( "conference.json", function( data ) {
        conferences=data;    
        for(var i = 0; i < conferences.events.length; i++)
            $('#events').append('<li><a href="#" data-id="' + i + '" onclick="selectEvent(this)" >'+conferences.events[i]['conference']+'</a></li>');
    })
    .fail(function() {
        alert( "conference.json not found" );
    })
    $("#logBtn").click(function(){
    	$("#logModal").modal();
    })
});

function selectEvent(identifier){
	var id = $(identifier).attr("data-id");
	var submissions = conferences.events[id]['submissions'];
	var tmp = "";
	for(var i = 0; i < submissions.length; i++)
		tmp += '<a href="#" class="list-group-item" data-id="' + i +'"'+' data-eventid="' + id + '" onclick="openArticle(this)" >'+submissions[i]['title']+'</a>';
	$("#articles").html(tmp);
}

function resetArticle(){
	$( "#RASHhead" ).empty();
	$( "#paperdiv" ).empty();
}

function openArticle(identifier){
	resetArticle();
	var eventN= $(identifier).attr('data-eventid');
	var articleN= $(identifier).attr('data-id');
	var submission = conferences.events[eventN]['submissions'];
	jQuery.ajax({
		url:submission[articleN]['url'], 
		success:function( data ) {
			jQuery.each($(data).filter("section"),function(index,value){$("#paperdiv").append($( this ));});
			jQuery.each($(data).filter("title"),function(index,value){$("#RASHhead").append($( this ));});
			jQuery.each($(data).filter("meta"),function(index,value){$("#RASHhead").append($( this ));});
			jQuery.each($(data).filter("#voti"),function(index,value){$("#RASHhead").append($(this ));});
			$("#RASHhead").append('<script src="js/rash.js"> </script>');
			loadAnnotations(data);
		},
		async: true
	});
}

//funzione per caricare le annotazioni del documento
function loadAnnotations(data){
	var text = $(data).filter("#data").html();
	var annotations = JSON.parse(text);
	for(var i=0; i < annotations.length; i++){		
		//se l'autore dell'annotazione è uguale all'utente mostra le annotazioni in giallo
		//altrimenti mostra le annotazioni di un'altro colore
		$(annotations[i]['ref']).attr('class', annotations[i]['@type']);
		$(annotations[i]['ref']).css('background-color','yellow');
	}
}
