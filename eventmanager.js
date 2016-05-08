/*function registerCloseEvent() {
     
        $(".closeTab").on('click',function () {
    //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
            var tabContentId = $(this).parent().attr("href");
            $(this).closest('li').remove(); //remove li of tab
            $('#myTab a:first').tab('show'); // Select first tab
            $(tabContentId).remove(); //remove respective tab content

        });
}

function GetCurrentTabId(){
    var mytab = $('#myTabcontents').find('.tab-pane.active');
    return(mytab.attr("id"));
        }

$(function () {
        $("#myTab").on("click", function () {
        registerCloseEvent();
        });
}); */
        
var arr;
// funzione per caricare la lista Eventi all'apertura della pagina
$(document).ready(function (e) {
	var text = $("#data").html();
	arr = JSON.parse(text);
	//alert(arr.events[0]['conference']);
	for(var i = 0; i < arr.events.length; i++)
		$('#events').append('<li><a href="#" data-id="' + i + '" onclick="selectEvent(this)" >'+arr.events[i]['conference']+'</a></li>');
  $("#logBtn").click(function(){
		$("#logModal").modal();
  });
});

function selectEvent(identifier)
{
	var id = $(identifier).attr("data-id");
	var submissions = arr.events[id]['submissions'];
	var tmp = "";
	for(var i = 0; i < submissions.length; i++)
		tmp += '<a href="#" class="list-group-item" data-id="' + i +'"'+' data-eventid="' + id + '" onclick="openArticle(this)" >'+submissions[i]['title']+'</a>';
	$("#articles").html(tmp);
}

function changeArticle(){
	$( "#RASHhead" ).empty();
	$( "#paperdiv" ).empty();
}

function openArticle(identifier)
{
	changeArticle();
	var eventN= $(identifier).attr('data-eventid');
	var articleN= $(identifier).attr('data-id');
	var submission = arr.events[eventN]['submissions'];
	jQuery.ajax({
		url:submission[articleN]['url'], 
		success:function( data ) {
			jQuery.each($(data).filter("section"),function(index,value){$("#paperdiv").append($( this ));});
			jQuery.each($(data).filter("title"),function(index,value){$("#RASHhead").append($( this ));});
			jQuery.each($(data).filter("meta"),function(index,value){$("#RASHhead").append($( this ));});
			jQuery.each($(data).filter("#voti"),function(index,value){$("#RASHhead").append($(this ));});
			$("#RASHhead").append('<script src="js/rash.js"> </script>');
			loadAnnotation(data);
		},
		async: true
	});
}

//funzione per caricare le annotazioni del documento
function loadAnnotation(data){
	var text = $(data).filter("#data").html();
	//load Annotations
	var arr = JSON.parse(text);
	for(var i=0; i < arr.length; i++){			
		$(arr[i]['ref']).attr('class', arr[i]['@type']);
		$(arr[i]['ref']).css('background-color','yellow');
	}
}
        