//{ FUNCTIONS FOR MANIPULATION DOM OF ANNOTATIONS
//crea una annotazione da finestra modale
function creaAnnotation(text){
	var user = selectUser();
	var id = generateID();
	var span = document.createElement('span');
	span.setAttribute("id", id);
	span.setAttribute("class", "comment tmpcomment");
	span.setAttribute("onclick","loadAnnotation("+confs[confN].submissions[articleN].annotations[user].length+")");
	
	/* link : https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents
	The Range.insertNode() method inserts a node at the start of the Range.
	The new node is inserted at the start boundary point of the Range. 
	If the new node is to be added to a text Node, that Node is split at the insertion point, and the insertion occurs between the two text nodes.
	*/
	//selectedRange.surroundContents(span);
	span.appendChild(selectedRange.extractContents()); 
	selectedRange.insertNode(span);
	storeAnnotation(id,text);
}

//modifica un'annotazione aperta nella finestra modale
function modifyAnnotation(text){
	var user = selectUser();
	confs[confN].submissions[articleN].annotations[user][annotationN]['text'] = text;
	var ref = confs[confN].submissions[articleN].annotations[user][annotationN]['ref'];
	var id = ref.substring(1, ref.length); //rimuovi il cancelletto iniziale
	document.getElementById(id).setAttribute("class", "comment tmpcomment");
	showAnnotations();
}

//cancella un'annotazione aperta nella finestra modale
function deleteAnnotation(){
	var user = selectUser();
	var id = confs[confN].submissions[articleN].annotations[user][annotationN]['ref']; //prende l'id dell'ennesima annotazione
	confs[confN].submissions[articleN].annotations[user][annotationN] = []; //svuota l'ennesima annotazione
	var span = document.getElementById(id.substring(1, id.length));
	span.outerHTML = span.innerHTML;
	showAnnotations();
	changes--;
	showMenuElements();
}
//}

//{ FUNCTIONS FOR MANAGE ANNOTATIONS IN CACHE
//push annotation in cache(reviewer only)
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
		"date": new Date().toISOString()
	});
	showAnnotations();
	changes++;
	showMenuElements();
}

//push score in cache (reviewer only)
function storeReview(text){
	var userN = selectUser();
	var annotations = confs[confN].submissions[articleN].annotations;
	var score = $('#score-review input:radio:checked').val();
	var result = score ? score : 0;
	
	//lista dei commenti della revisione
	var comments = [];
	for(var i = 0; i < annotations[userN].length; i++)
		if (annotations[userN][i]['@type'] == "comment")
			comments.push(annotations[userN][i]['@id']);
	
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
				"text": text,
				"author": 'mailto:' + userInfo['email'],
				"date": new Date().toISOString()
			}
		},
		"comments": comments
	});
	//aggiorna lo status dell'articolo
	document.getElementById('c'+ confN +'a'+articleN).setAttribute("class", "list-group-item list-group-item-danger"); 
	changes++;
	showMenuElements();
}

//push decision in cache (chair only)
function storeDecision(text){
	var userN = selectUser();
	var annotations = confs[confN].submissions[articleN].annotations;
	var score = $('#score-decision input:radio:checked').val();
	var result = (score == 0) ? "accepted-for-publication" : "reject-for-publication";
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
				"date": new Date().toISOString()
			}
		}
	});
	//aggiorna lo status dell'articolo
	document.getElementById('c'+ confN +'a'+articleN).setAttribute("class", "list-group-item list-group-item-danger"); 
	changes++;
	showMenuElements();
}

//show all annotations (chair & reviewer)
function showAnnotations(){
	var annotations = confs[confN].submissions[articleN].annotations;
	var list = "<a style='text-align: center;' class='list-group-item'>Annotations</a>";
	
	for(var i = 0; i < annotations.length; i++)
		for(var j = 0; j < annotations[i].length; j++){
			var item = annotations[i][j];
			if (item['@type'] && item['@type'] == "comment"){
				var id = item['ref'].substring(1, item['ref'].length);
				if (confs[confN].IsChair() || item['author'].indexOf(userInfo['email']) > -1){
					document.getElementById(id).setAttribute("data-eventid",confN);
					document.getElementById(id).setAttribute("data-original-title", "("+item['author']+")  "+annotations[i][j]['text']);
					$("#"+id).tooltip(); //add tooltip jquery
					
					//aggiorna blocco laterale + annotazioni
					var aName = item['text'].substring(0,25);
					if (!$('#'+id).hasClass("tmpcomment")){
						document.getElementById(id).setAttribute("class",item['@type']);
						list += '<a id="'+id+'left" href="'+item['ref']+'" title="'+item['author'].substring(7, item['author'].length)+'" class="list-group-item list-group-item-success">'+aName+'...'+'</a>';
					}
					else
						list += '<a id="'+id+'left" href="'+item['ref']+'" title="'+item['author'].substring(7, item['author'].length)+'" class="list-group-item list-group-item-danger">'+aName+'...'+'</a>';
				}
			}
		}
	$("#annotationsMenu").empty();
	$("#annotationsMenu").html(list);
}
//}