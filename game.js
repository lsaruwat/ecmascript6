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

	constructor(x,y,width,height, moveIncrement, color="purple"){
		super(x,y,width,height, color);
		this.moveIncrement = moveIncrement;
		this.valueToMove = 0; //this gets changed based on arrow keys to either a positive or negative amount
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
		this.moveIncrement = 3;
		this.dx = this.moveIncrement;
		this.dy = -this.moveIncrement;
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
		this.paddle = new Paddle(this.gameWidth/2,this.gameHeight-20, this.gameWidth/10, 20, this.gameWidth/20);
		this.ball = new Ball(this.gameWidth/2, this.gameHeight-this.paddle.height-11, 10, 0, Math.PI*2);
		this.setKeyListeners();
		console.log(this.paddle.y);
		console.log(this.gameHeight);
		console.log(this.paddle.x);
	}

	routeKeys(e){
		console.log(this.paddle);
		if(e.keyCode == 39) {
        	this.paddle.valueToMove = this.paddle.moveIncrement;
        	this.updatePaddle(this.paddle);
    	}
    	else if(e.keyCode == 37) {
        	this.paddle.valueToMove = -this.paddle.moveIncrement;
        	this.updatePaddle(this.paddle);
    	}
	}

	setKeyListeners(){
		window.addEventListener("keydown", this.routeKeys.bind(this), false);
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
		var isXAligned = (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width);
		var isYAligned = (this.ball.y > this.paddle.y-this.ball.moveIncrement)
		if(this.ball.x < 0 || this.ball.x > this.gameWidth)this.ball.dx = -this.ball.dx; // change direction if a wall is hit
		if(this.ball.y < 0)this.ball.dy = -this.ball.dy; // change direction if a wall is hit
		if(isXAligned && isYAligned)this.paddleHit();
			
		this.ctx.clearRect(this.ball.x-this.ball.radius, this.ball.y-this.ball.radius, this.ball.radius*2, this.ball.radius*2);
		this.ball.x +=this.ball.dx;
		this.ball.y +=this.ball.dy;
		this.drawBall(this.ball);
	}

	paddleHit(){
		this.ball.dy = -this.ball.dy;
	}

	setBallInMotion(){
		window.setInterval(this.updateBall.bind(this), 10);
	}

	updatePaddle(){
		this.ctx.clearRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
		
		if(this.paddle.x < this.paddle.width/2) this.paddle.x = this.paddle.width/2;
		else if(this.paddle.x > this.gameWidth - this.paddle.width) this.paddle.x = this.gameWidth - this.paddle.width;
		else {
			this.paddle.x += this.paddle.valueToMove;
		}
		
		this.drawBlock(this.paddle);

	}


	initialize(){
		for(var i=0; i<this.gameWidth; i+=this.gameWidth/10){
			for(var j=0; j<this.gameHeight/3; j+=this.gameHeight/10){

				var block = new Block(i,j, this.gameWidth/20, this.gameHeight/30);
				this.drawBlock(block);
			}
		}

		this.drawBlock(this.paddle);
		this.setBallInMotion();
	}


}

class Madness extends Breakout{

	constructor(){
		super();
		this.gameName = "Madness";
	}

	paddleHit(){
		this.ball.dy = -this.ball.dy;
		this.ball.dy*=1.1;
		this.ball.dx*=1.1;
	}
}


