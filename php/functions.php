<?php
	if(isset($_GET['action'])){
		$action = $_GET['action'];
		switch($action) {
			case 'getUserInfo' : userInfo(); break;
		}
	}
	else if(isset($_POST['action'])) {
		$action = $_POST['action'];
		switch($action) {
			case 'addLock' : addLock($_POST['name']); break;
			case 'removeLock' : removeLock($_POST['name']); break;
			case 'refreshLock' : refreshLock($_POST['name']); break;
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
			$file = fopen($uri, "w") or die(function(){ echo 1; });
			fwrite($file, time());
			fclose($file);
			echo 0;
		}
		else {
			$file = fopen($uri, "r") or die(function() { echo 1; });
			$time = fgets($file);
			fclose($file);
			if (intval($time)+5 < time()){
				file_put_contents($uri, time()) or die(function(){ echo 1; });
				echo 0;
			}
			else echo 1;
		}
	}
	function refreshLock($uri){
		if (!file_exists($uri)){
			$file = fopen($uri, "w") or die(function(){ echo 1; });
			fwrite($file, time());
			fclose($file);
			echo 0;
		}
		else {
			file_put_contents($uri, time()) or die(function(){ echo 1; });
			echo 0;
		}
	}
?>