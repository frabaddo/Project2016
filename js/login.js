function login(){
	$("#login-form").delay(100).fadeIn(100);
	$("#register-form").fadeOut(100);
	$('#register-form-link').removeClass('active');
	$('#login-form-link').addClass('active');
	return false; //no redirection
}

function register(){
	$("#register-form").delay(100).fadeIn(100);
	$("#login-form").fadeOut(100);
	$('#login-form-link').removeClass('active');
	$('#register-form-link').addClass('active');
	return false; //no redirection
}