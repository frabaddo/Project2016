//{ LOCK MANAGMENT
function addLock(uri){
	$.ajax({ 
		url: 'php/functions.php',
		data: {action: 'addLock', name: uri},
		type: 'post',
		async: false,
		success: function(output) {
			locked = output;
		},
		error: function(output) {
			locked = 1;
		}
	});
}

function removeLock(uri){
	locked = 1;
	clearInterval(mantainLock); //resetta il timer
	$.ajax({ 
		url: 'php/functions.php',
		data: {action: 'removeLock', name: uri},
		type: 'post',
		async: false
	});
}

function refreshLock(uri){
	$.ajax({ 
		url: 'php/functions.php',
		data: {action: 'refreshLock', name: uri},
		type: 'post',
		async: false,
		success: function(output) {
			locked = output;
		}
	});
}
//}