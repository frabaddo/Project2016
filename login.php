<?php
// Apro la sessione
session_start();
?>
<?php
	//Recupero username e password dal form
	$username = $_POST["usr"];
	$password = $_POST["psw"];
	
	//Controllo i dati nel database
	
	$jsonFile = file_get_contents('users.json', true);
	$users = json_decode($jsonFile, true);
	
	$authentication = false;
	
	foreach ($users as $user) {
		if($user['email'] == $username and $user['pass'] == $password){
			$authentication = true;
			$_SESSION['userInfo'] = json_encode($user);	
			break;
		}
	}
	
	if($authentication){
		$_SESSION['username'] = $username;	
		header('Location: main.php');
		exit;
	}
	else {
		echo '<script language="javascript">';
		echo 'alert("Username or password is incorrect. ")';
		echo '</script>';
	}
?>
