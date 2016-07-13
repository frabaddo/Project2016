<?php
	session_start();

	$name = $_POST["name"];
	$surname = $_POST["surname"];
	$email = $_POST["email"];
	$pass = $_POST["pass"];
	$cPass = $_POST["cPass"];
	$gender = $_POST["gender"];
	
	if(strcmp($pass, $cPass)){
		$_SESSION['regError'] = 1;
		header('Location: index.php');
		exit;
	}
	
	$jsonFile = file_get_contents('../json/users.json', true);
	$users = json_decode($jsonFile, true);

	foreach ($users as $user) {
		if(!strcmp($user['email'], $email)){
			$_SESSION['regError'] = 2;
			header('Location: index.php');
			exit;
		}
	}

	$newUser = $name . " " . $surname . " <" . $email . ">";

	$newInfoUser = array(
		"given_name" =>	$name,
		"family_name" => $surname,
		"email" => $email,
		"pass" => $pass,
		"sex" => $gender
	);

	$users[$newUser] = $newInfoUser;
	$users = json_encode($users);
	file_put_contents('../json/users.json', $users);

	$_SESSION['regError'] = 0;

	header('Location: ../index.php');
	exit;

?>
