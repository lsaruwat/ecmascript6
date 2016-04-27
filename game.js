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

	toString(){
		return "Block";
	}
}

class Paddle extends Block{

	constructor(x,y,width,height, moveIncrement, color="purple"){
		super(x,y,width,height, color);
		this.moveIncrement = moveIncrement;
		this.valueToMove = 0; //this gets changed based on arrow keys to either a positive or negative amount
		this.multiplier = 1;
	}

	toString(){
		return "Paddle";
	}
}

class PowerupBlock extends Block{

	constructor(x, y, width, height, color="gold"){
		super(x, y, width, height, color);
		this.value = 20;
	}

	toString(){
		return "PowerupBlock";
	}
}

class PenaltyBlock extends Block{

	constructor(x, y, width, height, color="red"){
		super(x, y, width, height, color);
		this.penalty = 1.1;
	}

	toString(){
		return "PenaltyBlock";
	}
}

class Ball{

	constructor(x, y, radius, a, b, moveIncrement=3,color="#00d4d4"){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.a = a;
		this.b = b;
		this.color = color;
		this.moveIncrement = moveIncrement;
		this.dx = this.moveIncrement;
		this.dy = -this.moveIncrement;
		//cos(angle*(pi/180))*velocity
		//sin(angle*(pi/180))*velocity
		this.radians = Math.cos(this.angle*(Math.PI / 180) ) * this.dy/this.dx;
	}
}

class User{
	
	constructor(){
		this.name ="John Doe";
		this.lives = 5;
		this.score = 0;
	}

	setName(name){
		this.name = name;
	}

	getName(){
		return this.name;
	}

	addLives(lives){
		this.lives += lives;
	}

	toString(){
		return this.name + " " + this.lives;
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
  	this.user = new User();
  	this.user.score = 0;
  	
  }

  createCanvas(width, height, element=document.getElementsByTagName("body")[0] ){
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
		this.blocks = [];
		this.collisionBlock = null;
		this.intervalId = null;
		this.setKeyListeners();
		this.setMouseListeners();

	}

	play(){
		this.populateBlocks();
		this.startBall();
	}

	setCanvasText(family, size){
		this.ctx.font = size + "px " + family;
	}

	updateText(){
		this.ctx.clearRect(0, 0, 300, 55);
		this.ctx.clearRect(this.gameWidth-110, 0, 110, 55);
		this.ctx.font = "30px Helvetica";
		this.ctx.fillText("Score: " + this.user.score ,10,50);
		this.ctx.fillText("Lives: " + this.user.lives ,this.gameWidth-110,50);
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
		this.ctx.clearRect(this.paddle.x-1, this.paddle.y-1, this.paddle.width+2, this.paddle.height+2);
		this.paddle.x = e.pageX - this.paddle.width/2;
		this.drawBlock(this.paddle);
	}

	setKeyListeners(){

		this.addEventListener("keydown", this.routeKeys, false);
	}

	setMouseListeners(){

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
		
		else if(this.paddleCollision()){
			this.paddleHit();
		}
		
		else if(this.blockCollision()){
			this.blockHit();
		}

		else if(this.ball.y -this.ball.radius > this.gameHeight)this.die();
			
		this.ctx.clearRect(this.ball.x-this.ball.radius-1, this.ball.y-this.ball.radius-1, this.ball.radius*2+2, this.ball.radius*2+2);
		this.ball.x +=this.ball.dx;
		this.ball.y +=this.ball.dy;
		this.drawBall(this.ball);
		
		this.updateText();
		this.ctx.clearRect(this.paddle.x-1, this.paddle.y-1, this.paddle.width+2, this.paddle.height+2);
		this.drawBlock(this.paddle);
	}

	paddleCollision(){
		let isXAligned = (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.width);
		let isYAligned = (this.ball.y + this.ball.radius > this.paddle.y);
		if(isXAligned && isYAligned) return true;
		else return false;
	}

	blockCollision(){
		for (let [i,block] of this.blocks.entries()) {// ecma script foreach style iterator
			
			let isXAligned = (this.ball.x+this.ball.radius > block.x && this.ball.x-this.ball.radius < block.x + block.width);
			let isYAligned = (this.ball.y+this.ball.radius > block.y && this.ball.y-this.ball.radius < block.y + block.height);
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
		
		if(this.ball.x < this.paddle.x+this.paddle.width/2){
			this.ball.multiplier = (-this.ball.x + this.paddle.x + this.paddle.width)/(this.paddle.width/1.5);
			this.ball.dx = -this.ball.moveIncrement * this.ball.multiplier;
		}
		else {
			this.ball.multiplier = (this.ball.x-this.paddle.x)/(this.paddle.width/1.5);
			this.ball.dx = this.ball.moveIncrement * this.ball.multiplier;
		}

		this.ball.dy = -this.ball.dy;
	}

	blockHit(){
		this.user.score +=1;
		let block = this.blocks[this.collisionBlock];
		this.ctx.clearRect(block.x-1, block.y-1, block.width+2, block.height+2);
		this.blocks.splice(this.collisionBlock, 1);
		this.ball.dy = -this.ball.dy;

		if(this.blocks.length <= 0){
			this.won();
		}	
	}

	setBallInMotion(){

		this.intervalId = window.setInterval(this.updateBall.bind(this), 10);
	}

	removeInterval(){
		//remove the interval so we can rebind on restart
		window.clearInterval(this.intervalId);
	}

	updatePaddle(){
		this.ctx.clearRect(this.paddle.x-1, this.paddle.y-1, this.paddle.width+2, this.paddle.height+2);
		
		if(this.paddle.x < this.paddle.width/2) this.paddle.x = this.paddle.width/2;
		else if(this.paddle.x > this.gameWidth - this.paddle.width) this.paddle.x = this.gameWidth - this.paddle.width;
		else {
			this.paddle.x += this.paddle.valueToMove;
		}
		
		this.drawBlock(this.paddle);

	}

	die(){
		if(this.user.lives > 0){
			this.ctx.clearRect(this.paddle.x-1, this.paddle.y-1, this.paddle.width+2, this.paddle.height+2);
			this.user.addLives(-1);
			this.removeInterval();
			this.startBall();
		}
		else this.lost();
	}

	startBall(){
		this.paddle = new Paddle(this.gameWidth, this.gameHeight-20, this.gameWidth/10, 20, this.gameWidth/20);
		this.ball = new Ball(Math.floor(Math.random()*this.gameWidth), this.gameHeight-this.paddle.height-11, 10, 0, Math.PI*2);
		this.setKeyListeners();
		this.setMouseListeners();


		this.drawBlock(this.paddle);
		this.setBallInMotion();
	}

	populateBlocks(color="green"){
		this.ctx.clearRect(0,0,this.gameWidth, this.gameHeight);
		for(let i=0; i<this.gameWidth; i+=this.gameWidth/20){
			for(let j=this.gameHeight/10; j<this.gameHeight/3; j+=this.gameHeight/20){

				this.blocks.push(new Block(i,j, this.gameWidth/30, this.gameHeight/50) );
				this.drawBlock(this.blocks[this.blocks.length-1]);
			}
		}
	}

	won(){
		this.user.lives +=1;
		this.removeInterval();
		this.populateBlocks();
		this.startBall();
	}

	lost(){
		window.alert("Game Over " + this.user.name + " score " + this.user.score);
		this.ball.y = 0;
		location.reload();
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
		
		if(this.ball.x < this.paddle.x+this.paddle.width/2){
			this.ball.multiplier = (this.ball.x-this.paddle.x + this.paddle.width/2)/(this.paddle.width/1.5);
			this.ball.dx = -this.ball.moveIncrement * this.ball.multiplier;
		}
		else {
			this.ball.multiplier = (this.ball.x-this.paddle.x)/(this.paddle.width/1.5);
			this.ball.dx = this.ball.moveIncrement * this.ball.multiplier;
		}

		this.ball.dy = -this.ball.dy;
		this.ball.dy *=1.1;
		this.ball.dx *=1.1;
	}

	blockHit(){
		this.user.score +=1;
		let block = this.blocks[this.collisionBlock];
		this.ctx.clearRect(block.x-1, block.y-1, block.width+2, block.height+2);
		this.blocks.splice(this.collisionBlock, 1);
		this.ball.dy = -this.ball.dy;

		if(this.blocks.length <= 0){
			this.won();
		}	
	}
}


class BreakoutPlus extends Breakout{

	constructor(){
		super();
		this.gameName = "Breakout Plus";
		this.paddleSize = this.gameWidth/20;
		this.ballVelocity = 3;
		this.maxVelocity = 10;
	}

	resetPaddle(){
		this.paddleSize = this.gameWidth/20;
	}

	startBall(){
		this.paddle = new Paddle(this.gameWidth/2, this.gameHeight-20, this.paddleSize, 20, this.gameWidth/20);
		this.ball = new Ball(Math.floor(Math.random()*this.gameWidth), this.gameHeight-this.paddle.height-11, 10, 0, Math.PI*2,this.ballVelocity);
		this.setKeyListeners();
		this.setMouseListeners();


		this.drawBlock(this.paddle);
		this.setBallInMotion();
	}

	populateBlocks(){
		this.ctx.clearRect(0,0,this.gameWidth, this.gameHeight);

		for(let i=0; i<this.gameWidth; i+=this.gameWidth/20){
			for(let j=this.gameHeight/10; j<this.gameHeight/3; j+=this.gameHeight/20){

				if(Math.floor(Math.random()*5) === 4){
					this.blocks.push(new PowerupBlock(i,j,this.gameWidth/30, this.gameHeight/50));
				}

				else if(Math.floor(Math.random()*5) === 1){
					this.blocks.push(new PenaltyBlock(i,j,this.gameWidth/30, this.gameHeight/50));
				}

				else this.blocks.push(new Block(i,j, this.gameWidth/30, this.gameHeight/50) );
				this.drawBlock(this.blocks[this.blocks.length-1]);
			}
		}
	}


	blockHit(){

		this.user.score +=1;
		let block = this.blocks[this.collisionBlock];
		if(block.toString() == "PowerupBlock"){
			this.paddle.width += block.value;
			this.paddleSize = this.paddle.width; //save the paddle width for next levels
			if(this.paddleSize >= this.gameWidth)this.beatGame();
		}
		else if(block.toString() == "PenaltyBlock"){
			if(this.ball.moveIncrement <= this.maxVelocity)this.ball.moveIncrement *= block.penalty;
			this.ballVelocity = this.ball.moveIncrement;
			console.log(this.ballVelocity);
		}
		this.ctx.clearRect(block.x-1, block.y-1, block.width+2, block.height+2);
		this.blocks.splice(this.collisionBlock, 1);
		this.ball.dy = -this.ball.dy;

		if(this.blocks.length <= 0){
			this.won();
		}	
	}


	beatGame(){
		window.alert("YOU WON GAME OVER");
		this.resetPaddle();
		this.play();
	}
}


