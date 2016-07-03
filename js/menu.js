var selectedRange;

//{ TEXT SELECTION FOR CREATION OF ANNOTATION
function Highlight(){
	var selection = window.getSelection();
	if (selection &&  selection != ""){
		selectedRange = selection.getRangeAt(0);
		changeSelection(selection);
	}
}

//cambia la selezione e restituisce i nodi selezionati
function changeSelection(selection){
	var range = selection.getRangeAt(0);
	var start = range.startContainer;
	var end = range.endContainer;
	var ancestor = range.commonAncestorContainer;
	var rangeNodes = [];
	
	var ignore = ["cgen", "title", "author_name", "email", "lead authors", "keywords", "acm_subject_categories"];
	for (var i = 0; i < ignore.length; i++)
		if (start.parentNode.className.indexOf(ignore[i]) > -1 || end.parentNode.className.indexOf(ignore[i]) > -1) {
			selection.removeAllRanges();
			return;
		}
	
	if (start.parentNode == end.parentNode) //se hanno entrambi i nodi lo stesso padre
		rangeNodes.push(start);
	else if (ancestor == start.parentNode){ //il padre è lo start
		while (end.parentNode != start.parentNode)
			end = end.parentNode;
			
		rangeNodes.push(start);
		rangeNodes.push(end);
		addSelection(selection, end);
	}
	else if (ancestor == end.parentNode){ //il padre è l'end
		while (start.parentNode != end.parentNode)
			start = start.parentNode;
			
		rangeNodes.push(start);
		rangeNodes.push(end);
		addSelection(selection, start);
	}
	else if (start.parentNode != end.parentNode){
		selection.removeAllRanges();
		addSelection(selection, ancestor);
	}
	
	return rangeNodes;
}
//aggiunge nodi alla selezione

function addSelection(currSelection, node){
	var range = document.createRange();
	range.selectNodeContents(node);
	currSelection.addRange(range);
}
//}

//{ FUNCTIONS FOR MANIPULATION OF ANNOTATIONS IN CACHE
function creaAnnotation(text){
	var user = selectUser();
	var id = confs[confN].submissions[articleN].annotations[user].length;
	storeAnnotation(id,text);
	var span = document.createElement('span');
	span.setAttribute("id", id);
	span.setAttribute("class", "comment");
	span.setAttribute("onclick","loadAnnotation("+id+")");
	selectedRange.surroundContents(span);
}
//modifica un'annotazione aperta nella finestra modale

function modifyAnnotation(text){
	var user = selectUser();
	annotation['text'] = text;
	showAnnotations();
}

function deleteAnnotation(){
	var user = selectUser();
	var id = confs[confN].submissions[articleN].annotations[user][annotationN]['ref'];
	confs[confN].submissions[articleN].annotations[user].splice(annotationN, 1);
	var span = document.getElementById(id.substring(1, id.length));
	span.outerHTML = span.innerHTML;
	showAnnotations();
}
//}

//apre la finestra modale per l'inserimento di annotazioni
function beginAnnotation(){
	if (window.getSelection())
		$('#createAnnotation').modal();
	else
		alert("you must select some text to review.");
}

//apre un'annotazione nella finestra modale (per rivederela/modificarla)
function loadAnnotation(id){
	var user = selectUser();
	annotationN = id;
	annotation = confs[confN].submissions[articleN].annotations[user][id];
	$('#modifyAnnotation').modal();
	$("#textMODIFY").val(annotation['text']);
}

function generateID(){
    var i=1;
    while(true){
        if ($("#"+i).size()==0)
            return i.toString();
        else i++;
    }
}

//id 0 is always for person
function selectUser(){
	var userN = -1;
	var annotations = confs[confN].submissions[articleN].annotations;
	for(var i = 0; i < annotations.length; i++)
		for(var j = 0; j < annotations[i].length; j++){
			var item = annotations[i][j];
			if (item['@type'] == "person" && item["@id"] == "mailto:"+userInfo['email'])
				userN = i;
		}
	
	if (userN == -1){
		userN = annotations.length;
		annotations.push(
		[
			{
				"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
				"@type": "person",
				"@id": "mailto:"+userInfo['email'],
				"name": userInfo['given_name'] + " " + userInfo['family_name'],
				"as": {
					"@id": "#role3",
					"@type": "role",
					"role_type": "pro:reviewer",//chair
					"in": ""
				}
			}
		]);
	}
	return userN;
}

//push annotation and return last annotation
function storeAnnotation(id_element,text){
	var userN = selectUser();
	var annotations = confs[confN].submissions[articleN].annotations;
	
	annotations[userN].push(
	{
		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
		"@type": "comment",
		"@id": "#review-c"+annotations[userN].length,
		"text": text,
		"ref": "#"+id_element,
		"author": 'mailto:'+userInfo['email'],
		"date": new Date().toDateString(), //"2016-01-16T12:34:56"
	});
	showAnnotations();
	return annotations[userN][annotations[userN].length];
}
//score from reviewer
function storeReview(text){
	var userN = selectUser();
	var annotations = confs[confN].submissions[articleN].annotations;
	var score = $('#score-review input:radio:checked').val();
	var result = score ? "reject-for-publication" : "accepted-for-publication";
	
 	annotations[userN].push(
	{
		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
		"@type": "review",
		"@id": "#review"+annotations[userN].length,
		"article": {
			"@id": "", 
			"eval": {
				"@id": "#review"+annotations[userN].length+"-eval",
				"@type": "score",
				"status": "pso:"+result,
				"author": 'mailto:' + userInfo['email'],
				"date": new Date().toDateString(), //"2016-01-16T12:34:56"
			}
		},
		"comments": [ "#review1-c1" , "#review1-c2" ]
		//BISOGNEREBBE PRENDERE LA LISTA DI COMMENTI E SBATTERLI:
		//nel campo "comments" della review: [ "#review1-c1" , "#review1-c2" ]
	});
 	var text = JSON.stringify(annotations);
	alert(text);
	//A QUESTO PUNTO NON DOVREBBE PIU' ESSERE POSSIBILE FARE NULLA
 }
//decision from chair
function storeDecision(text){
	var userN = selectUser();
	var annotations = confs[confN].submissions[articleN].annotations;
	var score = $('#score-review input:radio:checked').val();
	var result = score ? "reject-for-publication" : "accepted-for-publication";
	
 	annotations[userN].push(
 	{
		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
		"@type": "decision",
		"@id": "#decision1",
		"article": {
			"@id": "",
			"eval": {
				"@context": "easyrash.json",
				"@id": "#decision1-eval",
				"@type": "score",
				"status": "pso:"+result,
				"author": 'mailto:'+userInfo['email'],
				"date": new Date().toDateString(), //"2016-01-16T12:34:56"
			}
		}
	});
	var text = JSON.stringify(annotations);
	alert(text);
}
function createAnnotation() {
	$.ajax({
	   url: 'insert.php',
	   success: function (response) 
	   {
		 alert(response);
	   }
	});
}
function showAnnotations(){
	var annotations = confs[confN].submissions[articleN].annotations;
	var tmp = "";
	
	for(var i = 0; i < annotations.length; i++)
		for(var j = 0; j < annotations[i].length; j++){
			var item = annotations[i][j];
			if (item['@type'] && item['@type'] == "comment"){
				//alert(JSON.stringify(item));
				if (confs[confN].IsChair() || item['author'].includes(userInfo['email'])){
					var aName = item['text'].substring(0,25);
					tmp += '<a href="'+item['ref']+'" data-toggle="tooltip" title="'+aName+'" class="list-group-item">'+aName+'...'+'</a>';
				}
			}
		}
		
	$("#annotationsMenu").empty();
	$("#annotationsMenu").html(tmp);
}

function logModal(){
	$('#logModal').modal();
	document.getElementById("name").setAttribute("value", userInfo['given_name']);
	document.getElementById("surname").setAttribute("value", userInfo['family_name']);
	document.getElementById("email").setAttribute("value", userInfo['email']);
}