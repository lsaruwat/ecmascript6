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