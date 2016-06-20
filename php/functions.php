<?php
	if(isset($_POST['action']) && !empty($_POST['action'])) {
		$action = $_POST['action'];
		switch($action) {
			case 'getUserInfo' : userInfo(); break;
		}
	}
	
	function userInfo(){
		session_start();
		echo $_SESSION['userInfo'];
	}
?>