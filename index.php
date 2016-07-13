<!DOCTYPE html>
<html lang="en">
<head>
	<title>EasyRASH</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" type="text/css" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
	<link rel="stylesheet" type="text/css" href="css/login.css" />	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
	<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/login.js"></script>
</head>
<body>
	<?php
		if(isset($_SESSION['email'])){
			header('Location: main.php');
			exit;
		}
		
		if(isset($_SESSION['logError'])){ ?>
		<div class="alert alert-info">
			<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
			<strong>ERROR: Username or password is incorrect, please try again.</strong>
		</div>
	<?php } ?>
	
	<?php
		if(isset($_SESSION['regError'])){ 
			$message= " ";
			switch($_SESSION['regError']){
				case 0:
					$message = "Account successfully created.";
					break;
				case 1:
					$message = "ERROR: Password confirm must be the same as password.";
					break;
				case 2:
					$message = "ERROR: Email address already in use.";
					break;
			}
			unset($_SESSION['regError']);
		?>
		<div class="alert alert-info">
		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
		<strong><?php echo $message; ?></strong>
	</div>
	<?php } ?>
	
	<?php session_unset(); ?>
	
	<div class="container">
		<div class="row">
			<div class="col-md-6 col-md-offset-3">
				<div class="panel panel-login">
					<div class="panel-heading">
						<div class="row">
							<div class="col-xs-6">
								<a href="#" class="active" id="login-form-link" onclick="login()">Login</a>
							</div>
							<div class="col-xs-6">
								<a href="#" id="register-form-link" onclick="register()">Register</a>
							</div>
						</div>
						<hr>
					</div>
					<div class="panel-body">
						<div class="row">
							<div class="col-lg-12">
								<form id="login-form" action="php/login.php" method="post" role="form" style="display: block;" > 
									<div class="form-group">
										<input type="email" name="usr" id="username" tabindex="1" class="form-control" placeholder="Email Address" value="" required autofocus>
									</div>
									<div class="form-group">
										<input type="password" name="psw" id="password" tabindex="2" class="form-control" placeholder="Password" required>
									</div>
									<div class="form-group">
										<div class="row">
											<div class="col-sm-6 col-sm-offset-3">
												<input type="submit" name="login-submit" id="login-submit" tabindex="3" class="form-control btn btn-login" value="Log In">
											</div>
										</div>
									</div>
								</form>
								<form id="register-form" action="php/register.php" method="post" role="form" style="display: none;">
									<div class="form-group">
										<input type="text" name="name" id="name" tabindex="1" class="form-control" placeholder="Name" value="" required>
									</div>
									<div class="form-group">
										<input type="text" name="surname" id="surname" tabindex="2" class="form-control" placeholder="Surname" value="" required>
									</div>
									<div class="form-group">
										<input type="email" name="email" id="email" tabindex="3" class="form-control" placeholder="Email Address" value="" required>
									</div>
									<div class="form-group">
										<input type="password" name="pass" id="passwordReg" tabindex="4" class="form-control" placeholder="Password" required>
									</div>
									<div class="form-group">
										<input type="password" name="cPass" id="confirm-password" tabindex="5" class="form-control" placeholder="Confirm Password" required>
									</div>
									<div class="radio">
										<label><input type="radio" name="gender" value="male" required>Male</label>
									</div>
									<div class="radio">
										<label><input type="radio" name="gender" value="female">Female</label>
									</div>
									<div class="form-group">
										<div class="row">
											<div class="col-sm-6 col-sm-offset-3">
												<input type="submit" name="register-submit" id="register-submit" tabindex="6" class="form-control btn btn-register" value="Register Now">
											</div>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>