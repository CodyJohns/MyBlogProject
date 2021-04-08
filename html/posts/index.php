<?php
session_set_cookie_params(3600);
session_start();

if(!$_SESSION['username']) {
	header("Location: /");
}

?>
<!DOCTYPE html>
<html>
<head>
<title>Welcome to the community pinboard!</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Quicksand&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="../semanui/semantic.min.css">
<link rel="stylesheet" href="../style.css">
<script src="../jquery-3.6.0.min.js"></script>
<script src="../semanui/semantic.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
<script>
var username = "<?php echo $_SESSION['username']; ?>";
var cat = "misc";
</script>
<script src="webfunc.js"></script>
</head>
<body>
<div id="np"><b style="cursor:pointer;">Community Pinboard</b></div><br>
<div class="objt"><button class="ui button" id="newpostbtn">Write Post</button></div><br>
<div class="obj" id="newpost">
	<div class="obj_top"><b>Write something:</b></div>
	<div class="obj_cont">
	<textarea id="newp"></textarea>
	<button class="ui primary button" id="posth">Post</button>
	<button class="ui button" id="discard">Discard</button>
	</div>
</div>
<br><br>
<div class="objt">
	<div class="ui buttons">
	  <button class="ui button" onclick="selCat('misc')">Misc</button>
	  <button class="ui button" onclick="selCat('prog')">Programming</button>
	  <button class="ui button" onclick="selCat('byu')">BYU</button>
	</div>
</div>
<div id="postsm">
	<div class="ui active loader">
		<div class="ui medium text loader">Loading</div>
	</div>
</div>
<footer>Copyright &copy; 2021. Cody Johns. <a href="https://github.com/CodyJohns/MyBlogProject">Github link</a></footer>
</body>
</html>