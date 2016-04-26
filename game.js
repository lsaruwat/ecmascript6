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
		this.multiplier = 1;
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
		//cos(angle*(pi/180))*velocity
		//sin(angle*(pi/180))*velocity
		this.radians = Math.cos(this.angle*(Math.PI / 180) ) * this.dy/this.dx;
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

  addEventListener(domEvent, functionRef, bubbles=false){
  	window.addEventListener(domEvent, functionRef.bind(this), bubbles);
  }

}

class Breakout extends Game{
	
	constructor(){
		super(); // call the next level up constructor
		this.gameName = "Breakout";
		this.paddle = new Paddle(this.gameWidth/2,this.gameHeight-20, this.gameWidth/10, 20, this.gameWidth/20);
		this.ball = new Ball(this.gameWidth/2, this.gameHeight-this.paddle.height-11, 10, 0, Math.PI*2);
		this.blocks = [];
		this.collisionBlock = null;
		this.setKeyListeners();
		this.setMouseListeners();
	}

	routeKeys(e){
		if(e.keyCode == 39) {
        	this.paddle.valueToMove = this.paddle.moveIncrement;
        	this.updatePaddle(this.paddle);
    	}
    	else if(e.keyCode == 37) {
        	this.paddle.valueToMove = -this.paddle.moveIncrement;
        	this.updatePaddle(this.paddle);
    	}
	}

	followMouse(e){
		this.ctx.clearRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
		this.paddle.x = e.pageX - this.paddle.width/2;
		this.drawBlock(this.paddle);
	}

	setKeyListeners(){
		this.addEventListener("keydown", this.routeKeys, false);
	}

	setMouseListeners(){
		//.addEventListener("mousemove", this.followMouse.bind(this), false);
		this.addEventListener("mousemove", this.followMouse, false);
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
		if(this.ball.y < 0)this.ball.dy = -this.ball.dy; // change direction if a wall is hit
		else if(this.paddleCollision())this.paddleHit();
		else if(this.blockCollision())this.blockHit();
			
		this.ctx.clearRect(this.ball.x-this.ball.radius-1, this.ball.y-this.ball.radius-1, this.ball.radius*2+1, this.ball.radius*2+1);
		this.ball.x +=this.ball.dx;
		this.ball.y +=this.ball.dy;
		this.drawBall(this.ball);
	}

	paddleCollision(){
		let isXAligned = (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width);
		let isYAligned = (this.ball.y > this.paddle.y-this.ball.moveIncrement);
		if(isXAligned && isYAligned) return true;
		else return false;
	}

	blockCollision(){
		for (let [i,block] of this.blocks.entries()) {// ecma script foreach style iterator
			
			let isXAligned = (this.ball.x > block.x && this.ball.x < block.x + block.width);
			let isYAligned = (this.ball.y > block.y && this.ball.y < block.y + block.height);
			if(isXAligned && isYAligned) {
				this.collisionBlock = i;
				return true;
			}
    	
    	}

    	return false;
	}

	paddleHit(){
		let middle  = this.paddle.x+this.paddle.width/2;
		let begin  = this.paddle.x;
		let end = this.paddle.x + this.paddle.width;
		this.ball.multiplier = this.paddle.width / (middle - begin);
		
		if(this.ball.x < this.paddle.x+this.paddle.width/2){
			this.ball.dx = -this.ball.moveIncrement * this.ball.multiplier;
		}
		else {
			this.ball.dx = this.ball.moveIncrement * this.ball.multiplier;
		}

		this.ball.dy = -this.ball.dy;
	}

	blockHit(){
		let block = this.blocks[this.collisionBlock];
		this.ctx.clearRect(block.x-1, block.y-1, block.width+2, block.height+2);
		this.blocks.splice(this.collisionBlock, 1);
		//this.ball.dx = -this.ball.dx;
		this.ball.dy = -this.ball.dy;

		if(this.blocks.length <= 0){
			this.gameOver();
		}
		
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
		for(let i=0; i<this.gameWidth; i+=this.gameWidth/10){
			for(let j=0; j<this.gameHeight/3; j+=this.gameHeight/10){

				this.blocks.push(new Block(i,j, this.gameWidth/20, this.gameHeight/30) );
				this.drawBlock(this.blocks[this.blocks.length-1]);
			}
		}

		this.drawBlock(this.paddle);
		this.setBallInMotion();
	}

	gameOver(){
		window.alert("Congratulations Mother Fucker!");
		this.initialize();
	}


}

class Madness extends Breakout{

	constructor(){
		super();
		this.gameName = "Madness";
	}

	paddleHit(){
		let middle  = this.paddle.x+this.paddle.width/2;
		let begin  = this.paddle.x;
		let end = this.paddle.x + this.paddle.width;
		this.ball.multiplier = this.paddle.width / (middle - begin);
		
		if(this.ball.x < this.paddle.x+this.paddle.width/2){
			this.ball.dx = -this.ball.moveIncrement * this.ball.multiplier;
		}
		else {
			this.ball.dx = this.ball.moveIncrement * this.ball.multiplier;
		}

		this.ball.dy = -this.ball.dy;
		
		this.ball.dy*=1.1;
		this.ball.dx*=1.1;
	}

	blockHit(){
		let block = this.blocks[this.collisionBlock];
		this.ctx.clearRect(block.x-1, block.y-1, block.width+2, block.height+2);
		this.blocks.splice(this.collisionBlock, 1);
		//this.ball.dx = -this.ball.dx;
		this.ball.dy = -this.ball.dy;

		if(this.blocks.length <= 0){
			this.gameover();
		}
		
	}
}


