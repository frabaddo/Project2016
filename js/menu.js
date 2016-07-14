//{ FUNCTIONS FOR LAUNCH MODALS
//apre la finestra modale per l'inserimento di annotazioni (reviewer & chair)
function openAnnotation(){
	if (window.getSelection().toString())
		$('#createAnnotation').modal();
	else
		alert("you must select some text to review.");
}

//apre la finestra modale per l'inserimento di una review dell'articolo (reviewer only)
function openReview(){
	alert(confs[confN].submissions[articleN].HaveReview());
	if (confs[confN].submissions[articleN].IsReviewer() && !confs[confN].submissions[articleN].HaveReview()){
		$('#reviewArticle').modal();
	}
	else
		alert("you have already review this article!");
}

//apre la finestra modale per l'inserimento di una decisione finale sull'articolo (chair only)
function openDecision(){
	if (confs[confN].IsChair() && !confs[confN].submissions[articleN].HaveDecision()){
		if (confs[confN].submissions[articleN].ReviewComplete())
			$('#chairArticle').modal();
		else
			alert("this article is under review!");
	}
	else
		alert("you have already get a decision about this article!");
}

//visualizza le review già inserite da parte dei reviewers (chair only)
function viewReviews(){
	if (confs[confN].IsChair()){
		$('#viewReviews').modal();
		var reviewers = confs[confN].submissions[articleN].reviewers;
		var list = "Reviewers: ";
		for(var i = 0; i < reviewers.length; i++){
			list += "'"+reviewers[i] + "'";
		}
		$('#reviewers').html(list);
		
		var reviews = confs[confN].submissions[articleN].GetReviews();
		var text = "";
		for(var i = 0; i < reviews.length; i++){
			var eval = reviews[i]['article']['eval'];
			vote = eval['status'].substring(4, eval['status'].length);
			if (vote == 0) 
				vote = "REJECTED";
			text += "<li><p>"+eval['author'].substring(7, eval['author'].length)+", vote: "+ vote +"</p> commento: "+eval['text']+"</li>";
		}
		$('#reviews').html(text);
	}
}

//apre un'annotazione nella finestra modale (per rivederela/modificarla - author only)
function loadAnnotation(id){
	var user = selectUser();
	annotationN = id;
	var annotation = confs[confN].submissions[articleN].annotations[user][id];
	$('#modifyAnnotation').modal();
	$("#textMODIFY").val(annotation['text']);
	$("#author").text("autore: " + annotation['author'].substring(7, annotation['author'].length));
}
//}

//trova il primo id numerico non esistente
function generateID(){
	var i=1;
	while(true){
		if ($("#"+i).size()==0)
			return i.toString();
		else i++;
	}
}

var filetosave;
var annotationsToSavetmp;
var phpurl = 'phpsave.php';

function applyChange(){
	filetosave=$("#paperdiv");
	
	var elements = document.getElementsByClassName("comment");
	//rimuove tutti gli attributi nello span tranne l'id
	while (elements.length > 0) {
		var oldSpan = document.getElementById(elements[0].id);
		var newSpan = document.createElement('span');
		newSpan.setAttribute("id", elements[0].id);
		newSpan.innerHTML = oldSpan.innerHTML;
		var parent = oldSpan.parentNode;
		parent.replaceChild(newSpan, oldSpan);
	}
	
	$(filetosave).find(".noselect").filter(".todelete").remove();
	$(filetosave).find(".noselect").html("");
	filetosave=$(filetosave).html().toString();
	
	var annotations = confs[confN].submissions[articleN].annotations;
	var annotationsToSave=[];
	
	for(var i = 0; i < annotations.length; i++){
		for(var j = 0; j < annotations[i].length; j++){
			var item = annotations[i][j];
			if (item != 0) //se l'elemento dell'array non è vuoto (perchè cancellato)
				annotationsToSave.push(JSON.stringify(item));
		}
	}
	annotationsToSavetmp=annotationsToSave.toString();
	annotationsToSave=[];
	saveNewFile();
	
	removeLock(confs[confN].submissions[articleN].url); //rimuove il lock
	openArticle(); //riapre l'articolo
}
function saveNewFile(){
	var url = "RASH/"+confs[confN].submissions[articleN].url;
	//$.post( phpurl, { filename: url , content: filetosave , note: annotationsToSavetmp });
    $.ajax({
        type: 'POST',
        url: phpurl,
        data: { filename: url , content: filetosave , note: annotationsToSavetmp },
        async:false
    });
}

//funzione per passare in modalità annotator
function annotationMode(){
	openArticle(); //riapre l'articolo, per visualizzare l'ultima versione

	//{ CHECK FINE DECISION e FINE REVIEW
	if(confs[confN].submissions[articleN].HaveDecision()){
		alert("Il documento ha terminato la fase di Decision.");
		return;
	}
	
	if(confs[confN].submissions[articleN].HaveReview()){
		alert("Hai già revisionato il documento.");
		return;
	}

	var url = confs[confN].submissions[articleN].url;
	addLock(url); //QUANDO PREMI ANNOTATOR
	
	if (locked == 0){
        showMenuElements();
		mantainLock = setInterval(function(){refreshLock(url)}, 4000); //mantiene il lock (tempo minore di 5 sec)
		var annotations = confs[confN].submissions[articleN].annotations;
		for(var i = 0; i < annotations.length; i++)
			for(var j = 0; j < annotations[i].length; j++){
				var item = annotations[i][j];
				if (item['@type'] == "comment"){
					var id = item['ref'].substring(1, item['ref'].length);
					if (item['author'].indexOf(userInfo['email']) > -1) //puoi modificarlo solo se sei l'autore
						document.getElementById(id).setAttribute("onclick","loadAnnotation("+j+")");
				}
			}
			
		showAnnotations();
	}
	else
	{
		alert("file attualmente aperto in modalità Annotator da un altro utente.");
	}
}

//funzione per tornare in modalità reader
function readerMode(){
	if(openArticle()){
        hideMenuElements();
    }
}

//{ funzioni per gestire la parte view del menu
function hideMenuNavbar(){
	$('#menuNavbar').hide();
}
function hideMenuElements(){
	$('#annotatorBtn').show();
	$('#readerBtn').hide();
	$('#menuNavbar').show();
	$('#saveChangesBtn').hide();
	$('#filterAnnotationBtn').hide();
	$('#actionsBtn').hide();
	$('#reviewArticleBtn').hide();
	$('#chairArticleBtn').hide();
	$('#createAnnotationBtn').hide();
	$('#viewReviewsBtn').hide();
}
function showMenuElements(){
	$('#annotatorBtn').hide();
	$('#readerBtn').show();
	$('#actionsBtn').show();
	$('#saveChangesBtn').show();
	$('#createAnnotationBtn').show();
	if (confs[confN].IsChair()){
		$('#filterAnnotationBtn').show();
		$('#viewReviewsBtn').show();
		$('#chairArticleBtn').show();
	} 
	else{
		$('#reviewArticleBtn').show();
	}
}
//}