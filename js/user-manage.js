//{ USER MANAGMENT
//funzione che prende le informazioni dell'utente loggato
function getUserInfo(){
	$.ajax({ 
		url: 'php/functions.php',
		data: {action: 'getUserInfo'},
		type: 'get',
		async: false,
		success: function(output) {
			if (output)
				userInfo = JSON.parse(output);
			else
				document.location = "./index.php";
		},
		error: function(output) {
			alert("Impossibile caricare le informazioni utente.");
		}
	});
}

//questa funzione restituisce l'index della persona nell'array delle annotazioni (che è sempre 0)
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
			[{
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
			}]
		);
	}
	return userN;
}

//questa funzione lanciata per consentire all'utente di cambiare le informazioni del proprio account
function changeCredentials(){
	$('#changeCredentials').modal(); //visualizza la finestra modale con id changeCredentials
	document.getElementById("name").setAttribute("value", userInfo['given_name']);
	document.getElementById("surname").setAttribute("value", userInfo['family_name']);
	document.getElementById("email").setAttribute("value", userInfo['email']);
	if(!userInfo['sex'].localeCompare("male")){
		$("#genderMale").prop( "checked", true );
	}
	else{
		$("#genderFemale").prop( "checked", true );
	}
}
//}

//{ funzioni per gestire la parte view del modal di cambio informazioni utente
function showPassFields(){
	$('#password').fadeIn(); //visualizza l'elemento con id 'password', con una lenta comparsa
	$('#newPassword').fadeIn(); //visualizza l'elemento con id 'newPassword', con una lenta comparsa
	$('#changePass').hide(); //nasconde l'elemento con id 'changePAss'
	$("#newPassword").prop('required',true); //aggiunge la proprietà required all'elemento con id 'newPassword'
	$("#password").prop('required',true); //aggiunge la proprietà required all'elemento con id 'password'
}

function hidePassFields(){
	$('#password').fadeOut(); //nasconde l'elemento con id 'password', con una lenta scomparsa
	$('#newPassword').fadeOut(); //nasconde l'elemento con id 'newPassword', con una lenta scomparsa
	$('#changePass').show(); //visualizza l'elemento con id 'changePass'
	$("#newPassword").prop('required', false); //rimuove la proprietà required all'elemento con id 'newPassword'
	$("#password").prop('required', false); //rimuove la proprietà required all'elemento con id 'password'
}
//}