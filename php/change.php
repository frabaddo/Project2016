<?php
session_start();

$_SESSION['changeError'] = 0;

$oldName = $_SESSION["name"];
$oldSurname = $_SESSION["surname"];
$oldEmail = $_SESSION["email"];
$oldPass = $_POST["oldPass"];
$name = $_POST["name"];
$surname = $_POST["surname"];
$email = $_POST["email"];
$pass = $_POST["newPass"];

$jsonFile = file_get_contents('../json/users.json', true);
$users = json_decode($jsonFile, true);

if(strcmp($oldEmail, $email)){
	foreach ($users as $user) {
		//verifico che il nuevo email non esista gia
		if(!strcmp($user['email'], $email)){
			$_SESSION['changeError'] = 1;
			header('Location: ../main.php');
			exit;
		}
	}
}

foreach ($users as $user){
	if(strcmp($user['email'], $oldEmail) == 0){
		//controllo che la vecchia password sia corretta (in caso sia presso change password)
		if((!empty($_POST["newPass"]) and strcmp($user['pass'], $oldPass))){
			$_SESSION['changeError'] = 2;
			header('Location: ../main.php');
			exit;
		}
	}
}

if((empty($_POST["newPass"]))) $pass = $user['pass']; //Conservo pass originale (change non è stato presso)

$oldUser = $oldName . " " . $oldSurname . " <" . $oldEmail . ">";
$newUser = $name . " " . $surname . " <" . $email . ">";

$newInfoUser = array(
		"given_name" =>	$name,
		"family_name" => $surname,
		"email" => $email,
		"pass" => $pass
);

unset($users[$oldUser]);
$users[$newUser] = $newInfoUser;

$users = json_encode($users);
file_put_contents('../json/users.json', $users);

$_SESSION['username'] = $email;
$_SESSION['email'] = $email;
$_SESSION['name'] = $name;
$_SESSION['surname'] = $surname;
$_SESSION['userInfo'] = json_encode($newInfoUser, true);	

header('Location: ../main.php');
exit;

?>