<html>
<head>
<title>Breakout Plus</title>
<style>
	body{
		padding: 0px;
		margin:0px;
	}
</style>
</head>
<body>
<div id="stuff"></div>
<script type="text/javascript" src="game.js"></script>

<script type="text/javascript">

window.addEventListener("load", function(){

	var breakoutPlus = new BreakoutPlus();
	breakoutPlus.play();

}, false);

</script>
</body>