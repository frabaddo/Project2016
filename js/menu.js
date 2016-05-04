function Highlight(){
	//var currSelection = document.getElementById('article').contentWindow.getSelection();
	var currSelection = window.getSelection();
	if (currSelection != "") {
		var currSelection = window.getSelection();
		var start = currSelection.getRangeAt(0).startContainer.parentNode;
		var end = currSelection.getRangeAt(0).endContainer.parentNode;
		var ancestor = currSelection.getRangeAt(0).commonAncestorContainer;
		//alert(currSelection);
		//alert(start);
		//alert(end);
		//alert(ancestor.innerHTML);
		//alert(currSelection.getRangeAt(0).startOffset);
		//alert(currSelection.getRangeAt(0).endOffset);
		
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
			
		*/if (start.innerHTML == end.innerHTML)
			b = true;
		else if (ancestor.innerHTML == start.innerHTML) //il padre è lo start
		{
			//alert("b");
			while (end.parentNode != start)
				end = end.parentNode;
			
			var range = document.createRange();
			range.selectNodeContents(end);
			currSelection.addRange(range);
			addSelection(currSelection, end);
		}
		else if (ancestor.innerHTML == end.innerHTML) {//il padre è l'end
			//alert("c");
			while (start.parentNode != end)
				start = end.parentNode;
			
			addSelection(currSelection, start);
		}
		else
		{
			//alert("d");
			currSelection.removeAllRanges();
			addSelection(currSelection, ancestor);
		}
	}
}
function addSelection(currSelection, item)
{
	var range = document.createRange();
	range.selectNodeContents(item);
	currSelection.addRange(range);
}
function storeAnnotation(text){
	annotations.push(
	{
		"@context": "easyrash.json",
		"@type": "comment",
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
 		"author": "mailto:john@smith.com",
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
 		"author": "mailto:john@smith.com",
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