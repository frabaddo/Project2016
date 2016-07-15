<!DOCTYPE html>
<html lang="en">
<head>
	<?php
    $lifetime=3600;
    session_start();
    setcookie(session_name(),session_id(),time()+$lifetime);
    ?>
	<title>EasyRASH</title>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
	<script type="text/javascript" src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/global_var.js"></script>
	<script type="text/javascript" src="js/classes.js"></script>
	<script type="text/javascript" src="js/text-selection.js"></script>
	<script type="text/javascript" src="js/lock.js"></script>
	<script type="text/javascript" src="js/user-manage.js"></script>
	<script type="text/javascript" src="js/annotation-manage.js"></script>
	<script type="text/javascript" src="js/menu.js"></script>
	<script type="text/javascript" src="js/eventmanager.js"></script>
	<link rel="stylesheet" type="text/css" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
	<link rel="stylesheet" type="text/css" href="css/rash.css" />
	<link rel="stylesheet" type="text/css" href="css/style-article.css" />
</head>
<body>
	<div class="container-fluid">
		<?php
			if(isset($_SESSION['changeError'])){ 
				$message= " ";
				switch($_SESSION['changeError']){
					case 0:
						$message = "Account successfully edited.";
						break;
					case 1:
						$message = "ERROR: Email address already in use.";
						break;
					case 2:
						$message = "ERROR: Password is not correct.";
						break;
				}
				unset($_SESSION['changeError']);
			?>
			<div class="alert alert-info">
			<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
			<strong><?php echo $message; ?></strong>
		</div>
		<?php } ?>	
		
		<!-- NAV !-->
		<div class="row noselect">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<nav class="navbar navbar-inverse">
					<div class="container-fluid">
						<div class="navbar-header">
							<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
							</button>
							<a class="navbar-brand" href="#">Rash Project</a>
						</div>
						<div id="myNavbar" class="collapse navbar-collapse">
							<ul class="nav navbar-nav navbar-right">
								<li class="dropdown">
									<a id="utente" class="dropdown-toggle" data-toggle="dropdown" href="#"><span class="carret"></span></a>
									<ul class="dropdown-menu">
										<li><a href="#" class="btn" data-toggle="modal" onclick="changeCredentials();">Account configuration</a></li>
									</ul>
								</li>
								<li><a href="php/logout.php"><span class="glyphicon glyphicon-log-out"></span>Logout</a></li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
		</div>
		<!-- BODY !-->
		<div class="row">
		  <!-- ASIDE !-->
			<div  class="col-xs-12 col-sm-3 col-md-3 col-lg-3 noselect" style="padding-top: 10px;z-index:1001">
				<div class="dropdown">
					<button class="btn btn-default dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						Select events
						<span class="caret"></span>
					</button>
					<ul id="events" class="dropdown-menu" aria-labelledby="dropdownMenu1">
						<li class="dropdown-header">Events</li>
					</ul>
				</div>
				<div id="eventsMenu" class="list-group"></div>
				<div id="articles" class="list-group"></div>
				<div id="annotationsMenu" class="list-group"></div>
			</div>
			<!-- SECTION !-->
			<div class="col-xs-12 col-sm-9 col-md-9 col-lg-9">
				<nav id="menuNavbar" class="navbar navbar-default noselect" data-spy="affix" data-offset-top="80">
					<div class="container-fluid">
						<div class="navbar-header">
							<button id="menuButton" type="button" class="navbar-toggle btn btn-primary" data-toggle="collapse" data-target="#myNavbar2">
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
							</button>
						</div>						  
						<div id="myNavbar2" class="collapse navbar-collapse">
							<ul class="nav navbar-nav navbar-fixed">
								<li class="dropdown">
									<a id="actionsBtn" class="list-group-item list-group-item-menu dropdown-toggle" data-toggle="dropdown" href="#">Actions<span class="caret"></span></a>
									<ul class="dropdown-menu">
										<li><a id="createAnnotationBtn" href="#" class="btn" data-toggle="modal" onclick="openAnnotation();">Create Annotation</a></li>
										<li><a id="reviewArticleBtn" href="#" class="btn" data-toggle="modal" onclick="openReview()">Review Article</a></li>
										<li><a id="chairArticleBtn" href="#" class="btn" data-toggle="modal" onclick="openDecision();">Chair Article</a></li>
										<li><a id="viewReviewsBtn" href="#" class="btn" data-toggle="modal" onclick="viewReviews();">View Reviews</a></li>
									</ul>
								</li>
								<li>
									<a class="list-group-item list-group-item-menu" id="saveChangesBtn" href="#" onclick="applyChange();">Save & Exit</a>
								</li>
								
								<li>
									<a class="list-group-item list-group-item-menu" id="annotatorBtn" href="#" onclick="annotationMode();">Annotator</a>
								</li>
								<li>
									<a class="list-group-item list-group-item-menu" id="readerBtn" href="#" onclick="readerMode();">Reader</a>
								</li>
								<li>
									<a class="list-group-item list-group-item-menu" id="scoreBtn" data-placement="right" href="#">Score</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>
				<!-- PAPERDIV !-->
				<div id="RASHhead">
				</div>
				<div id="paperdiv" class="col-sm-9 col-md-9 col-lg-9" onmouseup="Highlight()">   
                </div>
                <div id="accessorybutton">
						<div title="Go to Events" onclick='toX("dropdownMenu1")' class="tomenu list-group-item list-group-item-menu">
                            <span class="glyphicon glyphicon-book" aria-hidden="true"></span>
                        </div>
                        <div title="Go to Annotations" onclick="toX('annotationsMenu')" class="tomenu list-group-item list-group-item-menu">
                            <span class="glyphicon glyphicon-tags" aria-hidden="true"></span>
                        </div>
                </div>
			</div>
			<!-- Modals -->
			<div id="createAnnotation" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<!-- Modal content-->
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">Create Annotation</h4>
						</div>
						<div class="modal-body">
							<textarea class="form-control" style="min-width: 100%" id="textCREATE" placeholder="Insert your annotation here." autofocus></textarea>
						</div>
						<div class="modal-footer">
							<button onclick="creaAnnotation(document.getElementById('textCREATE').value)" class="btn btn-default btn-success" data-dismiss="modal">Ok</button>
							<button type="button" class="btn btn-default btn-danger" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div id="modifyAnnotation" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<!-- Modal content-->
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">Modify Annotation</h4>
						</div>
						<div class="modal-body">
							<label id="author" style="display:block; text-align: center;"> </label>
							<textarea class="form-control" style="min-width: 100%" id="textMODIFY" placeholder="Insert your annotation here."></textarea>
						</div>
						<div class="modal-footer">
							<button id="modAnnotation" onclick="modifyAnnotation(document.getElementById('textMODIFY').value)" class="btn btn-default btn-success" data-dismiss="modal">Ok</button>
							<button id="delAnnotation" onclick="deleteAnnotation()" class="btn btn-default btn-danger" data-dismiss="modal">Delete</button>
							<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
						</div>
					</div>
				</div>
			</div>
			<div id="reviewArticle" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">Review Article</h4>
						</div>
						<div class="modal-body" style="text-align: center;">
							<div class="row">
								<textarea class="form-control" style="min-width: 100%" id="opinionReview" placeholder="Insert your opinion here."></textarea>
								<h3>Select your score</h3>
								<div class="large-12 columns" style="text-align: center;display: inline-block;">
									<div class="btn-group" id="score-review" data-toggle="buttons">
										<label class="btn btn-primary btn-danger active">
											<input type="radio" name="options" value="0" checked >Rejected
										</label>
										<label class="btn btn-primary">
											<input type="radio" name="options" value="1" >1
										</label>
										<label class="btn btn-primary">
											<input type="radio" name="options" value="2" >2
										</label>
										<label class="btn btn-primary">
											<input type="radio" name="options" value="3" >3
										</label>
										<label class="btn btn-primary">
											<input type="radio" name="options" value="4" >4
										</label>
										<label class="btn btn-primary">
											<input type="radio" name="options" value="5" >5
										</label>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<button onclick="storeReview(document.getElementById('opinionReview').value)" class="btn btn-default btn-success" data-dismiss="modal">Ok</button>
								<button type="button" class="btn btn-default btn-danger" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="chairArticle" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">Decision Article</h4>
						</div>
						<div class="modal-body" style="text-align: center;">
							<div class="row">
								<textarea class="form-control" style="min-width: 100%" id="opinionChair" placeholder="Insert your opinion here."></textarea>
								<h3>Select your decision</h3>
								<div class="large-12 columns" style="text-align: center;display: inline-block;">
									<div class="btn-group" id="score-decision" data-toggle="buttons">
										<label class="btn btn-success active">
											<input type="radio" name="options" value="0" checked /> Accept
										</label>
										<label class="btn btn-danger">
											<input type="radio" name="options" value="1" />	Reject
										</label>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<button type="submit" onclick="storeDecision(document.getElementById('opinionChair').value)"  class="btn btn-default btn-success" data-dismiss="modal">Ok</button>
								<button type="button" class="btn btn-default btn-danger" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div id="viewReviews" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<!-- Modal content-->
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title">Reviews</h4>
						</div>
						<div class="modal-body">
							<p id="reviewers">
							</p>
							<ul id="reviews">
							</ul>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
			<div id="changeCredentials" class="modal fade" role="dialog">
				<div class="modal-dialog">
					<!-- Modal content--> 
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 style="color:red;">
								<span class="glyphicon glyphicon-lock"></span>
								Account configuration
							</h4>
						</div>
						<div class="modal-body">
							<form action="php/change.php" method="post">
								<div class="form-group">
									<label for="name">Name</label>
									<input type="text" name="name" id="name" tabindex="1" class="form-control" required autofocus>
								</div>
								<div class="form-group">
									<label for="surname">Surname</label>
									<input type="text" name="surname" id="surname" tabindex="2" class="form-control" required>
								</div>
								<div class="form-group">
									<label for="email">Email</label>
									<input type="email" name="email" id="email" tabindex="3" class="form-control" required>
								</div>
								<div class="radio">
									<label><input id="genderMale" type="radio" name="gender" value="male">Male</label>
								</div>
								<div class="radio">
									<label><input id="genderFemale" type="radio" name="gender" value="female">Female</label>
								</div>
								<div class="form-group">
									<label for="password">Password <span><a href="#" class="btn" id="changePass" onclick="showPassFields()">(change)</a></span></label>
									<input type="password" name="oldPass" id="password" tabindex="4" class="form-control" placeholder="Old password" style="display: none">
								</div>
								<div class="form-group">
									<input type="password" name="newPass" id="newPassword" tabindex="5" class="form-control" placeholder="New Password" style="display: none">
								</div>
									<div class="modal-footer">
										<button type="submit" class="btn btn-default btn-success" tabindex="6">Save</button>
										<button type="button" class="btn btn-default btn-danger" data-dismiss="modal" tabindex="7" onclick="hidePassFields()">Cancel</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
	   </div>
	</div>
</body>
</html>
