<?php
// Apro la sessione
session_start();

//Recupero username e password dal form
$username = $_POST["usr"];
$password = $_POST["psw"];
$name;
$surname;
$email;

//Controllo i dati nel database

$jsonFile = file_get_contents('../json/users.json', true);
$users = json_decode($jsonFile, true);

$authentication = false;

foreach ($users as $user) {
	if(!strcmp($user['email'], $username) and !strcmp($user['pass'], $password)){
		$authentication = true;
		$_SESSION['email'] = $user['email'];
		$_SESSION['name'] = $user['given_name'];
		$_SESSION['surname'] = $user['family_name'];
		$_SESSION['userInfo'] = json_encode($user, true);	
		break;
	}
}

if($authentication){	
	header('Location: ../main.php');
}
else {
	$_SESSION['logError'] = true;
	header('Location: ../index.php');
}
exit;
?>