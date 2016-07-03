<?php
	if(isset($_POST['action']) && !empty($_POST['action'])) {
		$action = $_POST['action'];
		switch($action) {
			case 'getUserInfo' : userInfo(); break;
			case 'addLock' : addLock($_POST['name']); break;
			case 'removeLock' : removeLock($_POST['name']); break;
		}
	}
	
	function userInfo(){
		session_start();
		echo $_SESSION['userInfo'];
	}
	
	function removeLock($uri){
		unlink($uri);
	}
	
	function addLock($uri){
		if (!file_exists($uri)){
			$file = fopen($uri, "w") or die(function() { echo 1; });
			fwrite($file, time());
			echo 0;
		}
		else {
			$file = fopen($uri, "r") or die(function() { echo 1; });
			$time = fgets($file);
			fclose($file);
			if (intval($time)+5 < time()){
				$file = fopen($uri, "w") or die(function() { echo 1; });
				fwrite($file, time()) or die(function() { echo 1; });
				fclose($file);
				echo 0;
			}
			else echo 1;
		}
	}
?>