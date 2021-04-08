<?php
session_set_cookie_params(3600);
session_start();

if($_SESSION['username']) {
	header("Location: /posts");
}

if($_POST['usern'] && $_POST['sb']) {
	$_SESSION['username'] = $_POST['usern'];
	header("Location: /posts");
}

?>
<!DOCTYPE html>
<html>
<head>
<title>Myblog pinboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Quicksand&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="semanui/semantic.min.css">
<link rel="stylesheet" href="style.css">
<script src="jquery-3.6.0.min.js"></script>
<script src="semanui/semantic.min.js"></script>
</head>
<body>
<div class="mini_obj">
<h1>Welcome to My Blog!</h1>
<br><br>
<form method="post" action="">
	<div class="ui input" style="width:100%;" data-tooltip="This username will be used when you post." data-position="top left">
		<input type="text" name="usern" placeholder="Type username...">
	</div>
	<br><br>
	<div class="ui animated button" id='subbtn' tabindex="0">
	  <div class="visible content">Continue</div>
	  <div class="hidden content">
		<i class="right arrow icon"></i>
	  </div>
	</div>
	<input type='submit' name="sb" id="sb" style="display:none;">
</form>
<br>
<hr>
</div>
<footer>Copyright &copy; 2021. Cody Johns. <a href="#">Github link</a></footer>
<script>
 $(document).ready(function(){
    $('#subbtn').click(function () {
      $("#sb").trigger("click");
    });
  });
</script>
</body>
</html>
