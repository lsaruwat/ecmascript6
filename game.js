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

	constructor(x,y,width,height, moveIncrement, color="#008EF8"){
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

class BallBlock extends Block{

	constructor(x, y, width, height, color="blue"){
		super(x, y, width, height, color);
	}

	toString(){
		return "BallBlock";
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
		this.intervalId = null;
	}

	setColor(color){
		this.color = color;
	}

	getColor(){
		return this.color;
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
		this.paused = false;
		this.setKeyListeners();
		this.setMouseListeners();
		this.setTouchListeners();

	}

	play(){
		this.populateBlocks();
		this.startBall();
	}

	pause(){
		console.log("paused");
		this.removeInterval(ball);
		this.paused = true;
	}

	unpause(){
		console.log("unpaused");
		this.setBallInMotion(ball);
		this.paused = false;
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
		if(e.keyCode == 39) { //right arrow key
        	this.paddle.valueToMove = this.paddle.moveIncrement;
        	this.updatePaddle(this.paddle);
    	}
    	else if(e.keyCode == 37) {//left arrow key
        	this.paddle.valueToMove = -this.paddle.moveIncrement;
        	this.updatePaddle(this.paddle);
    	}
    	else if(e.keyCode == 32){ //space bar
    		if(!this.paused){
    			this.pause();
    		}
    	}

    	else if(e.keyCode == 13){
    		if(this.paused){
    			this.unpause();
    		}
    	}
	}

	followMouse(e){
		this.ctx.clearRect(this.paddle.x-1, this.paddle.y-1, this.paddle.width+2, this.paddle.height+2);
		this.paddle.x = e.pageX - this.paddle.width/2;
		this.drawBlock(this.paddle);
	}

	followTouch(e){
		e.preventDefault();
		this.ctx.clearRect(this.paddle.x-1, this.paddle.y-1, this.paddle.width+2, this.paddle.height+2);
		this.paddle.x = e.touches[0].clientX - this.paddle.width/2;
		this.drawBlock(this.paddle);
		
	}

	touchStart(e){
		e.preventDefault();
		console.log("touched");
	}

	setKeyListeners(){

		this.addEventListener("keydown", this.routeKeys, false);
	}

	setMouseListeners(){

		this.addEventListener("mousemove", this.followMouse, false);
	}

	setTouchListeners(){
		this.addEventListener("touchstart", this.touchStart, false);
		this.addEventListener("touchmove", this.followTouch, false);	
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

	updateBall(ball){
		

		if(ball.x < 0 || ball.x > this.gameWidth)ball.dx = -ball.dx; // change direction if a wall is hit
		if(ball.y < 0)ball.dy = -ball.dy; // change direction if a wall is hit
		
		else if(this.paddleCollision(ball)){
			this.paddleHit(ball);
		}
		
		else if(this.blockCollision(ball)){
			this.blockHit(ball);
		}

		else if(ball.y -ball.radius > this.gameHeight)this.die(ball);
			
		this.ctx.clearRect(ball.x-ball.radius-1, ball.y-ball.radius-1, ball.radius*2+2, ball.radius*2+2);
		ball.x +=ball.dx;
		ball.y +=ball.dy;
		this.drawBall(ball);
		
		this.updateText();
		this.ctx.clearRect(this.paddle.x-1, this.paddle.y-1, this.paddle.width+2, this.paddle.height+2);
		this.drawBlock(this.paddle);
	}

	paddleCollision(ball){
		let isXAligned = (ball.x > this.paddle.x && ball.x < this.paddle.x + this.paddle.width);
		let isYAligned = (ball.y + ball.radius > this.paddle.y);
		if(isXAligned && isYAligned) return true;
		else return false;
	}

	blockCollision(ball){
		for (let [i,block] of this.blocks.entries()) {// ecma script foreach style iterator
			
			let isXAligned = (ball.x+ball.radius > block.x && ball.x-ball.radius < block.x + block.width);
			let isYAligned = (ball.y+ball.radius > block.y && ball.y-ball.radius < block.y + block.height);
			if(isXAligned && isYAligned) {
				this.collisionBlock = i;
				return true;
			}
    	
    	}

    	return false;
	}

	paddleHit(ball){

		let middle  = this.paddle.x+this.paddle.width/2;
		let begin  = this.paddle.x;
		let end = this.paddle.x + this.paddle.width;
		
		if(ball.x < this.paddle.x+this.paddle.width/2){
			ball.multiplier = (-ball.x + this.paddle.x + this.paddle.width)/(this.paddle.width/1.5);
			ball.dx = -ball.moveIncrement * ball.multiplier;
		}
		else {
			ball.multiplier = (ball.x-this.paddle.x)/(this.paddle.width/1.5);
			ball.dx = ball.moveIncrement * ball.multiplier;
		}

		ball.dy = -ball.dy;
	}

	blockHit(ball){
		this.user.score +=1;
		let block = this.blocks[this.collisionBlock];
		this.ctx.clearRect(block.x-1, block.y-1, block.width+2, block.height+2);
		this.blocks.splice(this.collisionBlock, 1);
		ball.dy = -ball.dy;

		if(this.blocks.length <= 0){
			this.won(ball);
		}	
	}

	setBallInMotion(ball){

		ball.intervalId = window.setInterval(this.updateBall.bind(this,ball), 10);
	}

	removeInterval(ball){
		//remove the interval so we can rebind on restart
		window.clearInterval(ball.intervalId);
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

	die(ball){
		if(this.user.lives > 0){
			this.ctx.clearRect(this.paddle.x-1, this.paddle.y-1, this.paddle.width+2, this.paddle.height+2);
			this.user.addLives(-1);
			this.removeInterval(ball);
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
		this.setBallInMotion(this.ball);
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

	clearCanvas(){
		this.ctx.clearRect(0,0,this.gameWidth, this.gameHeight);
	}

	won(ball){
		this.user.lives +=1;
		this.ball.y = -100;
		this.removeInterval(ball);
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
		this.savedX = 3;
		this.savedY = 3;
	}

	startBall(){
		this.paddle = new Paddle(this.gameWidth, this.gameHeight-20, this.gameWidth/10, 20, this.gameWidth/20);
		this.ball = new Ball(Math.floor(Math.random()*this.gameWidth), this.gameHeight-this.paddle.height-11, 10, 0, Math.PI*2);
		this.ball.dx = this.savedX;
		if(this.ball.dy > 3) this.ball.dy = -Math.abs(this.savedY)/2;
		this.setKeyListeners();
		this.setMouseListeners();


		this.drawBlock(this.paddle);
		this.setBallInMotion(this.ball);
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
		this.ball.dy *=1.1;
		this.ball.dx *=1.1;
		this.savedX = this.ball.dx;
		this.savedY = this.ball.dy;
		this.ball.moveIncrement = Math.abs(this.ball.dx);
	}

	blockHit(){
		this.user.score +=1;
		let block = this.blocks[this.collisionBlock];
		this.ctx.clearRect(block.x-1, block.y-1, block.width+2, block.height+2);
		this.blocks.splice(this.collisionBlock, 1);
		this.ball.dy = -this.ball.dy;

		if(this.blocks.length <= 0){
			this.won(ball);
		}	
	}
}

class BreakoutPlus extends Breakout{

	constructor(){
		super();
		this.gameName = "Breakout Plus";
		this.balls = [];
		this.paddleSize = this.gameWidth/20;
		this.ballVelocity = 3;
		this.maxVelocity = 10;
	}

	pause(){
		for (let [i,ball] of this.balls.entries()) {
			this.removeInterval(ball);
		}
		this.paused = true;
	}

	unpause(){
		for (let [i,ball] of this.balls.entries()) {
			this.setBallInMotion(ball);
		}
		this.paused = false;
	}

	resetPaddle(){
		this.paddleSize = this.gameWidth/20;
	}

	startBall(){
		this.paddle = new Paddle(this.gameWidth/2, this.gameHeight-20, this.paddleSize, 20, this.gameWidth/20);
		this.ball = new Ball(Math.floor(Math.random()*this.gameWidth), this.gameHeight-this.paddle.height-11, 10, 0, Math.PI*2,this.ballVelocity);
		this.ball.setColor("black");
		this.balls.push(this.ball);
		this.setKeyListeners();
		this.setMouseListeners();


		this.drawBlock(this.paddle);
		this.setBallInMotion(this.ball);
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

				else if(Math.floor(Math.random()*15) === 1){
					this.blocks.push(new BallBlock(i,j,this.gameWidth/30, this.gameHeight/50));
				}

				else this.blocks.push(new Block(i,j, this.gameWidth/30, this.gameHeight/50) );
				this.drawBlock(this.blocks[this.blocks.length-1]);
			}
		}
	}


	blockHit(ball){

		this.user.score +=1;
		let block = this.blocks[this.collisionBlock];
		if(block.toString() == "PowerupBlock"){
			this.paddle.width += block.value;
			this.paddleSize = this.paddle.width; //save the paddle width for next levels
			if(this.paddleSize >= this.gameWidth)this.beatGame();
		}
		else if(block.toString() == "PenaltyBlock"){
			if(ball.moveIncrement <= this.maxVelocity)ball.moveIncrement *= block.penalty;
			this.ballVelocity = ball.moveIncrement;
			console.log(this.ballVelocity);
		}
		else if(block.toString() == "BallBlock"){
			this.balls.push(new Ball(block.x, block.y, 10, 0, Math.PI*2,this.ballVelocity));
			this.setBallInMotion(this.balls[this.balls.length-1]);
		}
		this.ctx.clearRect(block.x-1, block.y-1, block.width+2, block.height+2);
		this.blocks.splice(this.collisionBlock, 1);
		ball.dy = -ball.dy;

		if(this.blocks.length <= 0){
			this.won(ball);
		}	
	}

	die(ball){
		if(this.user.lives > 0){
			if(ball.getColor() === "black"){
			this.ctx.clearRect(this.paddle.x-1, this.paddle.y-1, this.paddle.width+2, this.paddle.height+2);
			this.startBall();
			this.user.addLives(-1);
			}
			
			this.removeInterval(ball);
		}
		else this.lost();
	}

	won(ball){
		this.user.lives +=1;
		this.ball.y = -100;
		this.removeInterval(ball);
		this.clearCanvas();
		this.populateBlocks();
		this.startBall();
	}


	beatGame(){
		window.alert("YOU WON GAME OVER");
		this.resetPaddle();
		this.play();
	}
}


