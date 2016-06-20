var selectedRange;

function Highlight(){
	var selection = window.getSelection();
	if (selection &&  selection != ""){
		selectedRange = selection.getRangeAt(0);
		changeSelection(selection);
	}
}
function creaAnnotation(text){
	var id = generateID();
	storeAnnotation(id,text);
	var span = document.createElement('span');
	span.setAttribute("style","background-color:Yellow;cursor:pointer;");
	span.setAttribute("onclick","modifyAnnotation("+id+")");
	selectedRange.surroundContents(span);
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

//apre la finestra modale per l'inserimento di annotazioni
function beginAnnotation(){
	if (window.getSelection())
		$('#createAnnotation').modal();
	else
		alert("you must select some text to review.");
}
function modifyAnnotation(id){
	var index = selectUser();
	annotation = JSON.parse(annotations[index][id]);
	
	$('#modifyAnnotation').modal();
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
	var index = -1;
	for(var i = 0; i < annotations.length; i++)
		for(var j = 0; j < annotations[i].length; j++){
			var item = annotations[i][j];
			if (item['@type'] == "person" && item["@id"] == "mailto:"+userInfo['email'])
				index = i;
		}
	
	if (index == -1){
		index = annotations.length;
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
					"role_type": "pro:chair",
					"in": ""
				}
			}
		]);
	}
	return index;
}

//push annotation and return last annotation
function storeAnnotation(id_element,text){
	var index = selectUser();
	var d = new Date();
	annotations[index].push(
	{
		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
		"@type": "comment",
		"@id": "#review-c"+"1",
		"text": text,
		"ref": "#"+id_element,
		"author": 'mailto:'+userInfo['email'],
		"date": d.toDateString()
	});
	
	showAnnotations();
	return annotations[index][annotations[index].length-1];
}
//score from reviewer
function storeReview(text){
 	annotations.push(
	{
		"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
		"@type": "review",
		"@id": "#review1",
		"article": {
			"@id": "", 
			"eval": {
				"@id": "#review1-eval",
				"@type": "score",
				"status": "pso:accepted-for-publication",
				"author": 'mailto:' + userInfo['email'],
				"date": "2016-01-16T12:34:56"
			}
		},
		"comments": [ "#review1-c1" , "#review1-c2" ]
	});
 	//date:  "2016-01-16T11:54:26"
 	var text = JSON.stringify(annotations);
 }
//decision from chair
function storeDecision(text){
 	annotations.push(
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
				"status": "pso:accepted-for-publication",
				"author": 'mailto:'+userInfo['email'],
				"date": "2016-01-18T13:32:11"
			}
		}
	});
 //date:  "2016-01-16T11:54:26"
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
	var tmp = "";
	$("#annotationsMenu").html("");
	for(var i = 0; i < annotations.length; i++)
		for(var j = 0; j < annotations[i].length; j++){
			var item = annotations[i][j];
			if (item['@type'] != "undefined" && item['@type'] == "comment"){
				var aName = item['text'].substring(0,25);
				tmp += '<a href="'+item['ref']+'" data-toggle="tooltip" title="'+aName+'" class="list-group-item">'+aName+'...'+'</a>';
			}
	}
	$("#annotationsMenu").html(tmp);
}