<html>
<head>
<title>ECMA Script 6</title>
<style>
	body{
		padding: 0px;
		margin:0px;
	}
</style>
</head>
<body>
<div id="stuff"></div>
<script src="https://code.jquery.com/jquery-2.2.3.min.js" integrity="sha256-a23g1Nt4dtEYOj7bR+vTu7+T8VP13humZFBJNIYoEJo=" crossorigin="anonymous"></script>
<script type="text/javascript" src="polygon.js"></script>
<script type="text/javascript" src="game.js"></script>

<script type="text/javascript">

$(document).ready(function(){
	var breakout = new Breakout();
	console.log(breakout.toString());
	breakout.user.setName("Logan Saruwatari");
	breakout.populateBlocks();
	breakout.startBall();
	
	// var madness = new Madness();
	// console.log(madness.toString());
	// madness.user.setName("Logan Saruwatari");
	// madness.populateBlocks();
	// madness.startBall();
})


function doStuff(){

	var square = new Polygon(10,10);
	square.setColor("red");

	console.log(square);
	console.log(square.area);

	var size = 20;
	for(var i=0; i<window.innerWidth-size; i+=size){
		for(var j=0; j<window.innerHeight-size; j+=size){

			var domSquare = new DomPolygon(size,size);

			domSquare.setColor( "rgb(" + Math.floor(Math.random()*256) + "," + Math.floor(Math.random()*256) + "," + Math.floor(Math.random()*256) +")");
			//domSquare.setColor( "rgb(" + j + "," + i + "," + i +")");
			domSquare.setPosition(i,j);

			$("#stuff").append(domSquare.element);
		}
		
	}



}

</script>
</body>