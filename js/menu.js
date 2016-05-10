var selectedText;
var selectedNode;
var annotations = [];
var username = "a";

function Highlight(){
	var currSelection = window.getSelection();
	if (currSelection != "") {
		var start = currSelection.getRangeAt(0).startContainer.parentNode;
		var end = currSelection.getRangeAt(0).endContainer.parentNode;
		var ancestor = currSelection.getRangeAt(0).commonAncestorContainer;
		
		//alert(start.innerHTML);
		//alert(end);
		//alert(ancestor.innerHTML);
		
		/* MANAGE METADATA
		if (start.className == "title" || start.parentNode.className == "title")
		{
			var range = document.createRange();
			range.selectNodeContents(start);
			currSelection.removeAllRanges();
			currSelection.addRange(range);
		}
		else if (end.className == "title" || end.parentNode.className == "title")
		{
			var range = document.createRange();
			range.selectNodeContents(end);
			currSelection.removeAllRanges();
			currSelection.addRange(range);
		}
		if (start.className == "author_name")
		{
			var range = document.createRange();
			range.selectNodeContents(start);
			currSelection.removeAllRanges();
			currSelection.addRange(range);
		}
		else if (end.className == "author_name")
		{
			var range = document.createRange();
			range.selectNodeContents(end);
			currSelection.removeAllRanges();
			currSelection.addRange(range);
		}
		if (start.parentNode.className == "email")
		{
			var range = document.createRange();
			range.selectNodeContents(start);
			currSelection.removeAllRanges();
			currSelection.addRange(range);
		}
		else if (end.parentNode.className == "email")
		{
			var range = document.createRange();
			range.selectNodeContents(end);
			currSelection.removeAllRanges();
			currSelection.addRange(range);
		}
		if (start.className == "affiliation")
		{
			var range = document.createRange();
			range.selectNodeContents(start);
			currSelection.removeAllRanges();
			currSelection.addRange(range);
		}
		else if (end.className == "affiliation")
		{
			var range = document.createRange();
			range.selectNodeContents(end);
			currSelection.removeAllRanges();
			currSelection.addRange(range);
		}
		
		else 
			
		*/
		if (start.innerHTML == end.innerHTML)
			selectedNode = start;
		else if (ancestor.innerHTML == start.innerHTML){//il padre è lo start
			//alert("b");
			while (end.parentNode != start)
				end = end.parentNode;
			
			selectedNode = start;
			addSelection(currSelection, end);
		}
		else if (ancestor.innerHTML == end.innerHTML){//il padre è l'end
			//alert("c");
			while (start.parentNode != end)
				start = end.parentNode;
			
			selectedNode = end;
			addSelection(currSelection, start);
		}
		else{
			//alert("d");
			currSelection.removeAllRanges();
			addSelection(currSelection, ancestor);
			selectedNode = currSelection;
		}
		
		selectedText = getSelectionHtml();
		//alert(selectedNode.innerHTML);
	}
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
function creaAnnotation(){
	if (selectedText != "") {
		var paragraphText = selectedNode.innerHTML;
		//alert("paragraph: " + paragraphText);
		//alert("selected text: " + selectedText);
		//alert("tag: " + selectedNode.tagName);
		
		/*if ((start.innerHTML == selectedText || end.innerHTML == selectedText) && start.innerHTML == end.innerHTML) {
			alert(start.id);
			if (start.id != ""){
				var myID = document.createElement("id");
				myID.setAttribute(ID, "mmm");
				var ancestor = currSelection.getRangeAt(0).commonAncestorContainer;
				ancestor.parentNode.replaceChild(span, ancestor);
			}
		}
		else{*/
			//var selectionContents = currSelection.getRangeAt(0).extractContents().innerHTML;
			alert(selectedText);
			//alert(selectionContents);
			var node = document.createElement(selectedNode.tagName);
			var stringa = "";
			var index = paragraphText.search(selectedText);
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
		//}
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
		"@id": "#article1",
		"text": text,
		"ref": id_element,
		"author": 'mailto:'+username,
		"date": Date.now()
	});
	//date:  "2016-01-16T11:54:26"
	var text = JSON.stringify(annotations);
 	alert(text);
	showAnnotations();
 }
function storeScore(text){
 	annotations.push(
	{
 		"@context": "easyrash.json",
 		"@type": "score",
 		"@id": "#article1",
 		"text": text,
 		"ref": "#id_element",
 		"author": "mailto:john@smith.com",
 		"date": Date.now()
 	});
 	//date:  "2016-01-16T11:54:26"
 	var text = JSON.stringify(annotations);
 	alert(text);
 }
function storeOpinion(text){
 	annotations.push(
 	{
 		"@context": "easyrash.json",
 		"@type": "opinion",
 		"@id": "#article1",
 		"text": text,
 		"ref": "#id_element",
 		"author": "mailto:"+userName,
 		"date": Date.now()
 	});
 	//date:  "2016-01-16T11:54:26"
 	var text = JSON.stringify(annotations);
 	alert(text);
 }
function storeDecision(text){
 	annotations.push(
 	{
 		"@context": "easyrash.json",
 		"@type": "decision",
 		"@id": "#article1",
 		"text": text,
 		"ref": "#id_element",
 		"author": "mailto:"+username,
 		"date": Date.now()
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
function showAnnotations()
{
	var tmp = "";
	for(var i = 0; i < annotations.length; i++){
		var aName = annotations[i]['text'].substring(0,25);
		tmp += '<a href="#" data-toggle="tooltip" title="'+aName+'" class="list-group-item">'+aName+'....'+'</a>';
	}
	$("#annotationsMenu").html(tmp);
}
function countID(){
	
}