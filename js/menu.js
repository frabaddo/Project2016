var selectedText = "";
var selectedNode;
var annotations = [];
var username = "a";
var startOffset;

function Highlight(){
	var currSelection = window.getSelection();
	if (currSelection != "") {
		var start = currSelection.getRangeAt(0).startContainer.parentNode;
		var end = currSelection.getRangeAt(0).endContainer.parentNode;
		var ancestor = currSelection.getRangeAt(0).commonAncestorContainer;
		startOffset = currSelection.getRangeAt(0).startOffset;
		//alert(start.innerHTML);
		//alert(end);
		//alert(ancestor.innerHTML);
		//alert("start: " + startOffset + " end: " + endOffset);
		var ignore = ["cgen", "title", "author_name", "email", "lead authors", "keywords", "acm_subject_categories"];
		for (var i = 0; i < ignore.length; i++)
			if (start.className.indexOf(ignore[i]) > -1 || end.className.indexOf(ignore[i]) > -1)
			{
				currSelection.removeAllRanges();
				return;
			}
		/* tecnicamente se il noselect funziona su tutti i browser questa parte non serve (PER ORA NON CANCELLARE)
		var node = start;
		while (node.id != "paperdiv"){
			for (var i = 0; i < ignore.length; i++) {
				if (node.className.indexOf(ignore[i]) > -1){
					currSelection.removeAllRanges();
					return;
				}
			}
			node = node.parentNode;
		}
		/*for (var i = 0; i < ignore.length; i++) {
			if (start.parentNode.className.indexOf(ignore[i]) > -1 || end.parentNode.className.indexOf(ignore[i]) > -1){
					currSelection.removeAllRanges();
					return;
				}
		}
		//ATTENZIONE: i valori delle keywords non hanno classname!!
		/* GLI AUTORI NON HANNO CGEN???
		alert(start.className);
		alert(start.parentNode.className);
		alert(end.className);
		alert(end.parentNode.className);
		*/
		if (start.innerHTML == end.innerHTML)
			selectedNode = start;
		else if (ancestor.innerHTML == start.innerHTML){//il padre è lo start
			while (end.parentNode != start)
				end = end.parentNode;
			
			selectedNode = start;
			addSelection(currSelection, end);
		}
		else if (ancestor.innerHTML == end.innerHTML){//il padre è l'end
			while (start.parentNode != end)
				start = end.parentNode;
			
			selectedNode = end;
			addSelection(currSelection, start);
		}
		else{
			currSelection.removeAllRanges();
			addSelection(currSelection, ancestor);
			selectedNode = currSelection;
		}
		
		selectedText = getSelectionHtml();
		//alert(selectedNode.innerHTML);
	}
	else selectedText = "";
}
function addSelection(currSelection, item){
	var range = document.createRange();
	range.selectNodeContents(item);
	currSelection.addRange(range);
}
function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}
function beginAnnotation(){
	if (selectedText.length > 0)
		$('#createAnnotation').modal();
	else
		alert("you must select some text to review.");
}
function creaAnnotation(){
	if (selectedText != "") {
		var paragraphText = selectedNode.innerHTML;
		//alert("paragraph: " + paragraphText);
		//alert("selected text: " + selectedText);
		//alert("tag: " + selectedNode.tagName);
		//alert(paragraphText == selectedText);
		
		//se selezioni un testo racchiuso tra 2 tag, basta aggiungere l'id
		if (paragraphText == selectedText){
			var id = selectedNode.getAttributeNode("id");
			if (id == null){
				selectedNode.setAttribute("id", "prova"); //ID INCREMENTALE
				selectedNode.setAttribute("style", "background-color:Yellow");
				storeAnnotation("prova","autore",selectedText);
			}
		}
		else{
			//var selectionContents = currSelection.getRangeAt(0).extractContents().innerHTML;
			alert(selectedText);
			//alert(selectionContents);
			var node = document.createElement(selectedNode.tagName);
			var stringa = "";
			var index = paragraphText.indexOf(selectedText, startOffset);
			alert("index: " + index);
			stringa += paragraphText.substring(0, index);
			stringa += "<span style='background-color:Yellow;'>"+selectedText+"</span>";
			stringa += paragraphText.substring(index + selectedText.length);
			node.innerHTML = stringa;
			//alert("replace: " + selectedText);
			//alert("from: " + paragraphText);
			//alert("to: " + stringa);
			//alert("in node: " + node.innerHTML);
			selectedNode.parentNode.replaceChild(node, selectedNode);
			storeAnnotation("prova","autore",selectedText);
		}
		//alert(start.innerHTML.indexOf(currSelection.toString()) > -1);
	}
}
//id_element must start with #
//author example: mailto:john@smith.com
function storeAnnotation(id_element,author,text){
	annotations.push(
	{
		"@context": "easyrash.json",
		"@type": "comment",
		"@id": "#review-c"+"1",
		"text": text,
		"ref": id_element,
		"author": 'mailto:'+username,
		"date": Date.now()
	});
	//"@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
	//date:  "2016-01-16T11:54:26"
	var text = JSON.stringify(annotations);
 	alert(text);
	showAnnotations();
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
					"author": "mailto:silvio.peroni@unibo.it",
					"date": "2016-01-16T12:34:56"
				}
			},
			"comments": [ "#review1-c1" , "#review1-c2" ]
		});
 	//date:  "2016-01-16T11:54:26"
 	var text = JSON.stringify(annotations);
 	alert(text);
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
				"author": "mailto:fabio.vitali@unibo.it",
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
	for(var i = 0; i < annotations.length; i++){
		var aName = annotations[i]['text'].substring(0,25);
		tmp += '<a href="#" data-toggle="tooltip" title="'+aName+'" class="list-group-item">'+aName+'...'+'</a>';
	}
	$("#annotationsMenu").html(tmp);
}