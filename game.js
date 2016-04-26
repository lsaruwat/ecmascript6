// Create the canvas

class Block{
	
	constructor(x, y, width, height, color="green"){
		this.width = width;
		this.height = height;
		this.color = color;
		this.margin = this.width/10;
		this.x = x;
		this.y = y;
	}


}

class Paddle extends Block{

	constructor(x,y,width,height, color="purple"){
		super(x,y,width,height, color);
		this.moveIncrement = 5;
		this.valueToMove = 0;
	}


}

class Ball{

	constructor(x, y, radius, a, b, color="#00d4d4"){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.a = a;
		this.b = b;
		this.color = color;
		this.dx = 5;
		this.dy = -5;
	}

}

class Game {
  
  constructor() {
  	this.state = "started";
  	this.canvas = null;
  	this.gameName = "Game";
  	this.dom = document.getElementsByTagName("html")[0];
  	this.gameHeight = window.innerHeight;
  	this.gameWidth = window.innerWidth;
  	this.createCanvas(this.gameWidth, this.gameHeight);
  }

  createCanvas(width, height, element=$("body")[0] ){
	this.canvas = document.createElement("canvas");
	this.ctx = this.canvas.getContext("2d");
	this.canvas.width = width;
	this.canvas.height = height;
	element.appendChild(this.canvas);
  }

  toString(){
  	return this.gameName;
  }

}

class Breakout extends Game{
	
	constructor(){
		super(); // call the next level up constructor
		this.gameName = "Breakout";
		this.ball = null;
		this.setKeyListeners();
	}

	routeKeys(e){
		if(e.keyCode == 39) {
        	this.paddle.x += this.paddle.moveIncrement;
        	this.drawBlock(this.paddle);
    	}
    	else if(e.keyCode == 37) {
        	this.paddle.x += -this.paddle.moveIncrement;
        	this.drawBlock(this.paddle);
    	}
	}

	setKeyListeners(){
		window.addEventListener("keydown", this.routeKeys, false);
	}

	drawBlock(block){
		this.ctx.beginPath();
		this.ctx.rect(block.x, block.y, block.width, block.height);
		this.ctx.fillStyle = block.color;
		this.ctx.fill();
		this.ctx.closePath();
	}

	drawBall(ball){
		this.ctx.beginPath();
	    this.ctx.arc(ball.x, ball.y, ball.radius, ball.a, ball.b);
	    this.ctx.fillStyle = ball.color;
	    this.ctx.fill();
	    this.ctx.closePath();
	}

	updateBall(){
		if(this.ball.x < 0 || this.ball.x > this.gameWidth)this.ball.dx = -this.ball.dx; // change direction if a wall is hit
		if(this.ball.y < 0 || this.ball.y > this.gameHeight)this.ball.dy = -this.ball.dy; // change direction if a wall is hit
		this.ball.x +=this.ball.dx;
		this.ball.y +=this.ball.dy;
		this.drawBall(this.ball);
	}

	updatePaddle(){
		if(this.paddle.x < 0 + this.paddle.width/2) this.paddle.x = 0+this.paddle.width/2;
		else if(this.paddle.x > this.gameWidth - this.paddle.width/2) this.paddle.x = this.gameWidth - this.paddle.width/2;
		else this.paddle.x += this.paddle.valueToMove;

	}


	initialize(){
		for(var i=0; i<this.gameWidth; i+=this.gameWidth/10){
			for(var j=0; j<this.gameHeight/3; j+=this.gameHeight/10){

				var block = new Block(i,j, this.gameWidth/20, this.gameHeight/30);
				this.drawBlock(block);
			}
		}

		this.paddle = new Paddle(this.gameWidth/2,this.gameHeight-20, this.gameWidth/10, 20);
		this.drawBlock(this.paddle);

		this.ball = new Ball(this.gameWidth/2, this.gameHeight-10, 10, 0, Math.PI*2);
		//this.drawBall(this.ball);
		//this.setBallInMotion();
	}


}

class Madness extends Breakout{

	constructor(){
		super();
		this.gameName = "Madness";
	}
}


