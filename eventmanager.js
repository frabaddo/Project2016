 $(function () {
            $("#myTab").on("click", function () {
            registerCloseEvent();
            });
        });
        
        function GetCurrentTabId(){
            var mytab = $('#myTabcontents').find('.tab-pane.active');
            //alert(mytab.attr("id"));
            return(mytab.attr("id"));
        }
        
		// funzione caricata all'apertura della pagina
		var arr;
		$(document).ready(
			function (e) 
			{
				var text = $("#data").html();
				arr = JSON.parse(text);
				//alert(arr.events[0]['conference']);
				for(var i = 0; i < arr.events.length; i++){
					$('#events').append('<li><a href="#" data-id="' + i + '" onclick="selectEvent(this)" >'+arr.events[i]['conference']+'</a></li>');
				}
			}
		);
        
         function registerCloseEvent() {

                $(".closeTab").on('click',function () {
                    //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
                    var tabContentId = $(this).parent().attr("href");
                    $(this).closest('li').remove(); //remove li of tab
                    $('#myTab a:first').tab('show'); // Select first tab
                    $(tabContentId).remove(); //remove respective tab content

                });
        }
        
		function selectEvent(identifier)
		{
			var id = $(identifier).attr("data-id");
			var submissions = arr.events[id]['submissions'];
			var tmp = "";
			for(var i = 0; i < submissions.length; i++){
				tmp += '<a href="#" class="list-group-item" data-id="' + i +'"'+' data-eventid="' + id + '" onclick="openArticle(this)" >'+submissions[i]['title']+'</a>';
			}
			$("#articles").html(tmp);
			
		}
		
        
        
      
	/*	function openArticle(identifier)           
		{
			var eventN= $(identifier).attr('data-eventid');
            var articleN= $(identifier).attr('data-id');
            var submission = arr.events[eventN]['submissions'];
            //$("#paperdiv").load(submission[articleN]['url'],'body');
            $("#RASHhead").load(submission[articleN]['url'] , 'head');
            alert('"#conf'+eventN+'art'+ submission[articleN]['id']+'"');
            alert('"'+submission[articleN]['url']+'"'); 
		}
    */    